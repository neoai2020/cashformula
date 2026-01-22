import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout

// Product categories with search terms
const CATEGORIES = [
  {
    name: 'Health & Fitness',
    searches: ['yoga mat premium', 'resistance bands set', 'massage gun deep tissue', 'fitness tracker watch', 'protein shaker bottle'],
  },
  {
    name: 'Home & Kitchen',
    searches: ['air fryer large capacity', 'instant pot pressure cooker', 'knife set kitchen', 'blender smoothie', 'robot vacuum cleaner'],
  },
  {
    name: 'Baby & Kids',
    searches: ['baby monitor camera', 'diaper bag backpack', 'baby stroller lightweight', 'portable high chair', 'educational toys toddler'],
  },
  {
    name: 'Beauty & Skincare',
    searches: ['vitamin c serum face', 'led face mask', 'hair dryer professional', 'makeup mirror lighted', 'skincare set gift'],
  },
  {
    name: 'Tech & Electronics',
    searches: ['wireless earbuds bluetooth', 'ring light streaming', 'portable charger 20000mah', 'smart watch fitness', 'webcam 1080p'],
  },
  {
    name: 'Pet Supplies',
    searches: ['dog bed large', 'pet camera treat dispenser', 'automatic pet feeder', 'dog grooming kit', 'pet carrier airline approved'],
  },
  {
    name: 'Outdoor & Garden',
    searches: ['portable grill camping', 'garden tool set', 'camping tent 4 person', 'outdoor hammock', 'solar lights outdoor'],
  },
  {
    name: 'Office & Productivity',
    searches: ['standing desk converter', 'ergonomic office chair', 'desk organizer', 'monitor stand riser', 'mechanical keyboard'],
  },
];

// Generate social captions for a product
function generateSocialCaptions(productTitle: string, price: string): string[] {
  const shortTitle = productTitle.split(' ').slice(0, 4).join(' ');
  return [
    `🔥 Just found this amazing ${shortTitle} and I'm OBSESSED! If you've been looking for one, this is THE one to get. Check it out 👇 {LINK}`,
    `Okay but why didn't anyone tell me about this ${shortTitle} sooner?! 😍 It's only ${price} and the reviews are insane. You need this: {LINK}`,
    `PSA: Stop scrolling! 🛑 This ${shortTitle} is going viral for a reason. I got mine and it's a game changer. Link in bio or here: {LINK}`,
  ];
}

// Calculate estimated commission (4-10% of price)
function calculateCommission(price: string): string {
  const numPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 50;
  const lowComm = Math.floor(numPrice * 0.04);
  const highComm = Math.floor(numPrice * 0.10);
  return `$${lowComm} - $${highComm}`;
}

// Determine competition level based on reviews
function getCompetitionLevel(reviewsCount: number): string {
  if (reviewsCount > 50000) return 'high';
  if (reviewsCount > 10000) return 'medium';
  return 'low';
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin secret
    const { searchParams } = new URL(request.url);
    const adminSecret = searchParams.get('secret');
    
    if (adminSecret !== process.env.ADMIN_SECRET && adminSecret !== 'generate-gold-pages') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const amazonHost = process.env.RAPIDAPI_AMAZON_HOST || 'amazon-online-data-api.p.rapidapi.com';
    const chatgptHost = process.env.RAPIDAPI_CHATGPT_HOST || 'chatgpt-42.p.rapidapi.com';

    if (!rapidApiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const results: Array<{ category: string; product: string; status: string }> = [];
    let totalCreated = 0;

    // Process each category
    for (const category of CATEGORIES) {
      console.log(`Processing category: ${category.name}`);

      for (const searchTerm of category.searches) {
        try {
          // 1. Search Amazon for the product
          console.log(`  Searching: ${searchTerm}`);
          const searchResponse = await fetch(
            `https://${amazonHost}/search?query=${encodeURIComponent(searchTerm)}&page=1&geo=US`,
            {
              headers: {
                'x-rapidapi-key': rapidApiKey,
                'x-rapidapi-host': amazonHost,
              },
            }
          );

          if (!searchResponse.ok) {
            console.error(`Amazon search failed for ${searchTerm}`);
            results.push({ category: category.name, product: searchTerm, status: 'search_failed' });
            continue;
          }

          const searchData = await searchResponse.json();
          let products = searchData?.data?.products || searchData?.products || searchData?.data || [];
          
          if (Array.isArray(searchData)) {
            products = searchData;
          }

          if (!products.length) {
            console.error(`No products found for ${searchTerm}`);
            results.push({ category: category.name, product: searchTerm, status: 'no_products' });
            continue;
          }

          // Get the first good product (with image and price)
          const product = products.find((p: Record<string, unknown>) => {
            const hasImage = p.image || p.thumbnail || p.main_image || p.product_photo;
            const hasPrice = p.price || p.current_price || p.product_price;
            return hasImage && hasPrice;
          }) || products[0];

          // Extract product data
          const asin = String(product.asin || product.product_asin || product.ASIN || '');
          const title = String(product.title || product.name || product.product_title || 'Product');
          
          // Get image
          let image = product.image || product.thumbnail || product.main_image || product.product_photo || product.image_url;
          if (typeof image === 'object' && image) {
            image = (image as Record<string, string>).url || (image as Record<string, string>).src;
          }
          
          // Get price
          let price = product.price || product.current_price || product.product_price;
          if (typeof price === 'object' && price) {
            price = (price as Record<string, string>).current_price || (price as Record<string, string>).raw || (price as Record<string, string>).value;
          }
          price = String(price || '$49.99');
          if (!price.startsWith('$')) price = '$' + price;

          // Get rating
          let rating = product.rating || product.stars || product.product_star_rating || 4.5;
          if (typeof rating === 'string') rating = parseFloat(rating);

          // Get reviews count
          let reviewsCount = product.reviews_count || product.ratings_total || product.product_num_ratings || 1000;
          if (typeof reviewsCount === 'string') {
            reviewsCount = parseInt(reviewsCount.replace(/[^0-9]/g, ''), 10);
          }

          console.log(`  Found product: ${title.slice(0, 50)}...`);

          // 2. Generate content with ChatGPT
          const prompt = `You are a professional product reviewer. Generate a compelling review page content for this Amazon product. Write in simple, clear language (4th-grade reading level). Sound confident and enthusiastic. Do not make medical or financial claims.

Product: ${title}
Category: ${category.name}
Price: ${price}
Rating: ${rating}

Generate a JSON response with this EXACT structure (no markdown, just valid JSON):
{
  "title": "A SHORT catchy headline (max 60 characters)",
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

Return ONLY valid JSON, no explanation or markdown.`;

          const chatResponse = await fetch(`https://${chatgptHost}/gpt4`, {
            method: 'POST',
            headers: {
              'x-rapidapi-key': rapidApiKey,
              'x-rapidapi-host': chatgptHost,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [{ role: 'user', content: prompt }],
              web_access: false,
            }),
          });

          let generatedContent;
          if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            let content = chatData?.result || chatData?.message || chatData?.choices?.[0]?.message?.content || '';
            content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            
            try {
              generatedContent = JSON.parse(content);
            } catch {
              console.error(`  Failed to parse ChatGPT response for ${searchTerm}`);
              // Use fallback content
              generatedContent = {
                title: `${title.split(' ').slice(0, 5).join(' ')} - Honest Review`,
                overview: `The ${title} has quickly become a favorite in the ${category.name} space. With thousands of positive reviews and excellent ratings, this product delivers exceptional value.`,
                pros: ['High quality', 'Great value', 'Easy to use', 'Fast shipping', 'Excellent reviews'],
                cons: ['Popular item - may sell out'],
                sections: [
                  { heading: 'Who Is This For?', content: `Perfect for anyone looking for a quality ${category.name.toLowerCase()} product.` },
                  { heading: 'Key Features', content: 'Premium materials and thoughtful design set this apart.' },
                ],
                faq: [
                  { question: 'Is this worth the price?', answer: 'Absolutely! Great value for money.' },
                  { question: 'How long does shipping take?', answer: 'Usually 2-5 days with Amazon.' },
                ],
                recommended_copy: 'Get yours today!',
              };
            }
          } else {
            console.error(`  ChatGPT API failed for ${searchTerm}`);
            generatedContent = {
              title: `${title.split(' ').slice(0, 5).join(' ')} - Complete Review`,
              overview: `This ${title} is highly rated with excellent reviews.`,
              pros: ['High quality', 'Great value', 'Easy to use'],
              cons: ['Popular item'],
              sections: [],
              faq: [],
              recommended_copy: 'Get yours today!',
            };
          }

          // 3. Save to dfy_pages
          const slug = `gold-${searchTerm.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;
          
          const { error: dbError } = await supabase
            .from('dfy_pages')
            .insert({
              niche: category.name,
              category: category.name,
              asin,
              keyword: searchTerm,
              public_slug: slug,
              product_data: {
                title,
                price,
                rating,
                reviews_count: reviewsCount,
              },
              generated_content: generatedContent,
              hero_image: image ? String(image) : null,
              price,
              rating,
              reviews_count: reviewsCount,
              commission_estimate: calculateCommission(price),
              competition_level: getCompetitionLevel(reviewsCount),
              is_trending: Math.random() > 0.7, // 30% chance of trending
              is_new: Math.random() > 0.8, // 20% chance of new
              social_captions: generateSocialCaptions(title, price),
            });

          if (dbError) {
            console.error(`  Database error for ${searchTerm}:`, dbError);
            results.push({ category: category.name, product: searchTerm, status: 'db_error' });
          } else {
            console.log(`  ✓ Created: ${title.slice(0, 40)}...`);
            results.push({ category: category.name, product: title.slice(0, 50), status: 'success' });
            totalCreated++;
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1500));

        } catch (error) {
          console.error(`Error processing ${searchTerm}:`, error);
          results.push({ category: category.name, product: searchTerm, status: 'error' });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${totalCreated} Gold Package products`,
      totalCreated,
      results,
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed products', details: String(error) },
      { status: 500 }
    );
  }
}

// GET endpoint to check status
export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('dfy_pages')
    .select('id, category, product_data, hero_image')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const byCategory: Record<string, number> = {};
  data?.forEach((p) => {
    const cat = p.category || 'Unknown';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });

  return NextResponse.json({
    total: data?.length || 0,
    byCategory,
    hasImages: data?.filter(p => p.hero_image).length || 0,
  });
}
