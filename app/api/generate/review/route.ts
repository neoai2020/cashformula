import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReviewSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit (stricter for AI generation)
    const rateLimit = checkRateLimit(user.id + '-generate', 5, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      );
    }

    // Validate body
    const body = await request.json();
    const validation = generateReviewSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { keyword, asin, productData, reviews = [], affiliateLink } = validation.data;
    
    // Ensure we have valid data with defaults
    const safeProductData = {
      title: productData.title || 'Product',
      price: productData.price || 'Check price',
      rating: productData.rating || 4.5,
      reviews_count: productData.reviews_count || 0,
    };
    
    const safeReviews = (reviews || []).filter(r => r.text).map(r => ({
      text: r.text,
      rating: r.rating || 5,
    }));

    // Call ChatGPT API
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_CHATGPT_HOST || 'chatgpt-42.p.rapidapi.com';

    if (!rapidApiKey) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Build prompt
    const reviewSummary = safeReviews
      .slice(0, 5)
      .map((r) => `"${r.text.slice(0, 200)}"`)
      .join('\n');

    const prompt = `You are a professional product reviewer. Generate a compelling review page content for this Amazon product. Write in simple, clear language (4th-grade reading level). Sound confident and enthusiastic. Do not make medical or financial claims.

Product: ${safeProductData.title}
Category/Keyword: ${keyword}
Price: ${safeProductData.price}
Rating: ${safeProductData.rating}

Some customer reviews:
${reviewSummary}

Generate a JSON response with this EXACT structure (no markdown, just valid JSON):
{
  "title": "A SHORT catchy headline (max 60 characters) - NEVER start with 'Why'. Use action words like 'Game-Changer', 'Must-Have', 'Best', 'Ultimate'. Examples: 'The Ultimate Kitchen Gadget You Need', 'This Air Fryer Changed Everything', 'Best Yoga Mat I Ever Owned', 'Game-Changer for Home Workouts'",
  "overview": "2-3 paragraphs explaining what this product is and why it's great",
  "pros": ["5-6 specific benefits as short bullet points"],
  "cons": ["1-2 minor drawbacks to seem balanced"],
  "sections": [
    {"heading": "Who Is This For?", "content": "1-2 paragraphs"},
    {"heading": "Key Features", "content": "1-2 paragraphs highlighting features"},
    {"heading": "My Experience", "content": "1-2 paragraphs written as first-person experience"}
  ],
  "faq": [
    {"question": "Common question 1?", "answer": "Helpful answer"},
    {"question": "Common question 2?", "answer": "Helpful answer"},
    {"question": "Common question 3?", "answer": "Helpful answer"}
  ],
  "recommended_copy": "A short 1-sentence strong recommendation with CTA"
}

IMPORTANT: The title must NOT start with "Why". Start with action words instead.

Return ONLY valid JSON, no explanation or markdown.`;

    const response = await fetch(`https://${rapidApiHost}/gpt4`, {
      method: 'POST',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        web_access: false,
      }),
    });

    if (!response.ok) {
      console.error('ChatGPT API error:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract content from response
    let content = data?.result || data?.message || data?.choices?.[0]?.message?.content || '';
    
    // Clean up any markdown code blocks
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON
    let generatedContent;
    try {
      generatedContent = JSON.parse(content);
    } catch {
      console.error('Failed to parse AI response:', content);
      // Return fallback content - NO "Why" in the title
      generatedContent = {
        title: `The ${keyword} Game-Changer You Need`,
        overview: `The ${safeProductData.title} has quickly become a fan favorite in the ${keyword} space. With thousands of positive reviews and a reputation for quality, this product delivers on its promises.`,
        pros: [
          'High quality construction',
          'Great value for money',
          'Easy to use',
          'Fast shipping',
          'Excellent customer reviews',
        ],
        cons: ['May be out of stock due to popularity'],
        sections: [
          {
            heading: 'Who Is This For?',
            content: `This product is perfect for anyone looking for a reliable ${keyword} solution. Whether you're a beginner or experienced user, you'll find value in this purchase.`,
          },
          {
            heading: 'Key Features',
            content: 'This product includes premium materials and thoughtful design that sets it apart from competitors.',
          },
        ],
        faq: [
          {
            question: 'Is this product worth the price?',
            answer: 'Absolutely! The quality and features justify the investment.',
          },
          {
            question: 'How long does shipping take?',
            answer: 'Most orders arrive within 3-5 business days with Amazon Prime.',
          },
        ],
        recommended_copy: 'Get yours today before they sell out!',
      };
    }

    // Generate unique slug
    const slug = `${keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
    
    // Save to database
    const { data: page, error: dbError } = await supabase
      .from('pages')
      .insert({
        user_id: user.id,
        title: generatedContent.title || safeProductData.title,
        keyword,
        asin,
        affiliate_link: affiliateLink,
        product_data: safeProductData,
        amazon_reviews: safeReviews.length > 0 ? safeReviews : [], // Required field
        generated_content: generatedContent,
        public_slug: slug,
        status: 'published',
        hero_image: productData.image || null, // Save the product image
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save page' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        public_slug: page.public_slug,
        title: page.title,
      },
      content: generatedContent,
    });
  } catch (error) {
    console.error('Generate review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

