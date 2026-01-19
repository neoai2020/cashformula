import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { comparisonPages } from '@/lib/platinum-data';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { comparisonId, affiliateLink1, affiliateLink2, boosters = [] } = body;

    // Validate required fields
    if (!comparisonId || !affiliateLink1 || !affiliateLink2) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the comparison page data
    const comparison = comparisonPages.find((c) => c.id === comparisonId);

    if (!comparison) {
      return NextResponse.json(
        { error: 'Comparison not found' },
        { status: 404 }
      );
    }

    // Generate unique slug
    const baseSlug = comparison.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const timestamp = Date.now();
    const publicSlug = `${baseSlug}-${timestamp}`;

    // Generate rich comparison content dynamically
    const comparisonTable = [
      { feature: 'Price', product1: comparison.product1.price, product2: comparison.product2.price, winner: parseFloat(comparison.product1.price.replace(/[^0-9.]/g, '')) < parseFloat(comparison.product2.price.replace(/[^0-9.]/g, '')) ? 1 : 2 },
      { feature: 'Customer Rating', product1: `${comparison.product1.rating}/5 ⭐`, product2: `${comparison.product2.rating}/5 ⭐`, winner: comparison.product1.rating > comparison.product2.rating ? 1 : 2 },
      { feature: 'Build Quality', product1: 'Premium', product2: 'Good', winner: 1 },
      { feature: 'Value for Money', product1: 'Great', product2: 'Excellent', winner: 2 },
      { feature: 'Brand Reputation', product1: 'Excellent', product2: 'Very Good', winner: 1 },
    ];

    // Generate detailed sections
    const sections = [
      {
        title: `${comparison.product1.name} - In-Depth Review`,
        content: `The ${comparison.product1.name} has taken the market by storm with its impressive performance and reliability. Priced at ${comparison.product1.price}, it offers exceptional value for those seeking premium quality.

What sets it apart is its attention to detail and user-friendly design. Customers consistently praise its durability and effectiveness, which is reflected in its stellar ${comparison.product1.rating}/5 rating.

Key highlights include:
${comparison.product1.pros.map(pro => `• ${pro}`).join('\n')}

The build quality is noticeably premium, and you can feel the difference the moment you start using it. It's designed to last for years, making it a smart investment for anyone serious about quality.`
      },
      {
        title: `${comparison.product2.name} - In-Depth Review`,
        content: `The ${comparison.product2.name} is a strong competitor at ${comparison.product2.price}, offering solid performance at a more accessible price point. With a ${comparison.product2.rating}/5 rating, it has earned the trust of thousands of satisfied customers.

This product shines in several areas:
${comparison.product2.pros.map(pro => `• ${pro}`).join('\n')}

For budget-conscious buyers who still want quality, this is an excellent choice. It may not have all the bells and whistles of its competitor, but it delivers where it counts.`
      },
      {
        title: 'Which One Should You Buy?',
        content: `After extensive testing and comparison, here's our recommendation:

${comparison.winner === 1 ? `The ${comparison.product1.name} wins this comparison` : `The ${comparison.product2.name} wins this comparison`}, but both products have their strengths.

${comparison.verdict}

Remember, the "best" choice depends on YOUR specific needs, budget, and preferences. Both products have proven track records and thousands of happy customers.`
      }
    ];

    // Generate comprehensive FAQ
    const faq = [
      {
        question: `Is the ${comparison.product1.name} worth the price?`,
        answer: `Absolutely! While it's priced at ${comparison.product1.price}, you're paying for premium quality, durability, and performance. Based on thousands of reviews, customers feel it's a great investment that pays for itself over time.`
      },
      {
        question: `How does the ${comparison.product2.name} compare in quality?`,
        answer: `The ${comparison.product2.name} offers excellent quality at ${comparison.product2.price}. While it may not have every feature of the ${comparison.product1.name}, it's a fantastic choice for those who want great value without breaking the bank.`
      },
      {
        question: 'Which product has better customer reviews?',
        answer: `Both products have excellent reviews! The ${comparison.product1.name} has a ${comparison.product1.rating}/5 rating, while the ${comparison.product2.name} has a ${comparison.product2.rating}/5 rating. Both are highly recommended by verified buyers.`
      },
      {
        question: 'Is there a warranty on these products?',
        answer: `Yes, both products come with manufacturer warranties. When purchased through Amazon, you also get their A-to-Z Guarantee protection for added peace of mind.`
      },
      {
        question: 'Which one is better for beginners?',
        answer: `${comparison.winner === 2 ? `The ${comparison.product2.name}` : `The ${comparison.product1.name}`} might be slightly better for beginners due to its ease of use. However, both products are designed to be user-friendly and come with clear instructions.`
      },
      {
        question: 'How fast is the shipping?',
        answer: `When purchased through Amazon, both products are eligible for Prime shipping. Most orders arrive within 1-2 business days with Prime, or 3-5 days with standard shipping.`
      }
    ];

    // Prepare page data with FULL rich content
    const pageData = {
      user_id: user.id,
      title: comparison.title,
      keyword: comparison.category,
      asin: comparison.product1.asin,
      geo: 'US',
      affiliate_link: `${affiliateLink1},${affiliateLink2}`, // Store both links
      public_slug: publicSlug,
      status: 'published',
      page_type: 'comparison',
      hero_image: comparison.product1.image,
      conversion_boosters: boosters,
      
      // Product data includes both products
      product_data: {
        product1: {
          ...comparison.product1,
          affiliateLink: affiliateLink1,
          reviews: 15000 + Math.floor(Math.random() * 10000),
        },
        product2: {
          ...comparison.product2,
          affiliateLink: affiliateLink2,
          reviews: 12000 + Math.floor(Math.random() * 8000),
        },
        winner: comparison.winner,
      },

      // FULL generated content with all sections the template needs
      generated_content: {
        type: 'comparison',
        overview: `Looking for the best ${comparison.category.toLowerCase()} option? We've done the research so you don't have to. In this comprehensive comparison, we'll break down exactly how the ${comparison.product1.name} and ${comparison.product2.name} stack up against each other. By the end, you'll know exactly which one is right for YOUR needs and budget.`,
        comparisonTable: comparisonTable,
        sections: sections,
        product1Details: {
          pros: comparison.product1.pros,
          cons: ['Premium price point', 'May have more features than needed for casual users'],
          bestFor: comparison.whenToChoose1,
        },
        product2Details: {
          pros: comparison.product2.pros,
          cons: ['Fewer premium features', 'Slightly less brand prestige'],
          bestFor: comparison.whenToChoose2,
        },
        finalVerdict: comparison.verdict,
        faq: faq,
      },

      amazon_reviews: [],
    };

    // Insert page into database
    const { data: page, error: insertError } = await supabase
      .from('pages')
      .insert(pageData)
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create page', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        slug: page.public_slug,
        url: `/p/${page.public_slug}`,
      },
    });
  } catch (error) {
    console.error('Generate comparison error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
