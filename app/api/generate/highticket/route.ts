import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { highTicketProducts } from '@/lib/platinum-data';

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
    const { productId, affiliateLink, boosters = [] } = body;

    // Validate required fields
    if (!productId || !affiliateLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the product data
    const product = highTicketProducts.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate unique slug
    const baseSlug = product.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
    const timestamp = Date.now();
    const publicSlug = `${baseSlug}-${timestamp}`;

    // Generate comprehensive FAQ if not provided
    const defaultFaq = [
      {
        question: `Is ${product.title} worth the ${product.price} price tag?`,
        answer: `Absolutely! This product has earned a stellar ${product.rating}/5 rating from over ${product.reviews.toLocaleString()} verified buyers. The quality justifies the investment, and many customers report it pays for itself through improved efficiency and satisfaction.`
      },
      {
        question: 'What if I\'m not satisfied with my purchase?',
        answer: 'Amazon offers a hassle-free return policy. If you\'re not 100% satisfied, you can return the item within 30 days for a full refund. Plus, you\'re protected by Amazon\'s A-to-Z Guarantee.'
      },
      {
        question: 'How fast will I receive my order?',
        answer: 'With Amazon Prime, you can receive your order as fast as same-day or next-day delivery depending on your location. Standard shipping typically takes 3-5 business days.'
      },
      {
        question: 'Is this product durable and long-lasting?',
        answer: `Yes! Based on thousands of customer reviews, the ${product.title} is built to last. The premium materials and construction ensure years of reliable performance.`
      },
      {
        question: 'Does this come with a warranty?',
        answer: 'Yes, this product includes the manufacturer\'s warranty. When purchased through Amazon, you also get additional buyer protection through their customer service.'
      },
      {
        question: 'Is this the best option in its category?',
        answer: `With ${product.reviews.toLocaleString()}+ reviews and a ${product.rating}/5 star rating, this is one of the highest-rated products in the ${product.category} category. It\'s trusted by thousands of satisfied customers.`
      }
    ];

    // Generate rich sections
    const sections = [
      {
        heading: 'Why This Product Stands Out',
        content: `In a market flooded with options, the ${product.title} rises above the competition. Here's what makes it special:\n\n${product.bulletPoints.map(b => `✓ ${b}`).join('\n\n')}\n\nThese aren't just marketing claims - they're backed by ${product.reviews.toLocaleString()}+ verified customer reviews with an average rating of ${product.rating}/5 stars.`
      },
      {
        heading: 'Who Is This Perfect For?',
        content: `This product is ideal for:\n\n• Anyone who values quality over cheap alternatives that break quickly\n• People who want a premium experience without compromise\n• Buyers looking for a product backed by thousands of positive reviews\n• Those who appreciate excellent customer service and easy returns\n\nIf you're tired of replacing inferior products and want something that just WORKS, this is for you.`
      },
      {
        heading: 'Real Customer Experience',
        content: `What are real buyers saying? Here are the common themes from ${product.reviews.toLocaleString()}+ reviews:\n\n⭐ "Exceeded my expectations" - The most common phrase in reviews\n⭐ "Worth every penny" - Customers feel the value matches the price\n⭐ "Should have bought sooner" - Many wish they hadn't waited\n⭐ "Better than expected quality" - The build quality impresses buyers\n\nWith ${product.rating}/5 stars, this product has earned the trust of the Amazon community.`
      }
    ];

    // Use product FAQ if available, otherwise use defaults
    const faq = (product.profitPage?.faq && product.profitPage.faq.length > 0) 
      ? product.profitPage.faq 
      : defaultFaq;

    // Prepare page data with FULL rich content
    const pageData = {
      user_id: user.id,
      title: product.profitPage?.headline || `${product.title} - Honest Review`,
      keyword: product.category,
      asin: product.asin,
      geo: 'US',
      affiliate_link: affiliateLink,
      public_slug: publicSlug,
      status: 'published',
      page_type: 'single_product',
      hero_image: product.imageUrl,
      conversion_boosters: boosters,
      
      // Product data
      product_data: {
        title: product.title,
        price: product.price,
        rating: product.rating,
        reviews_count: product.reviews,
        bulletPoints: product.bulletPoints,
        imageUrl: product.imageUrl,
      },

      // FULL generated content
      generated_content: {
        title: product.profitPage?.headline || `${product.title} - Honest Review`,
        overview: product.profitPage?.overview || `Discover why ${product.reviews.toLocaleString()}+ customers love the ${product.title}. With a ${product.rating}/5 star rating, this premium ${product.category.toLowerCase()} product delivers exceptional quality and performance. Read our in-depth review to see if it's right for you.`,
        sections: sections,
        pros: product.profitPage?.pros || product.bulletPoints.slice(0, 5),
        cons: product.profitPage?.cons || ['Premium price point', 'May be overkill for casual users'],
        verdict: product.profitPage?.verdict || `After thorough research and analysis of ${product.reviews.toLocaleString()}+ customer reviews, we highly recommend the ${product.title}. At ${product.price}, it represents excellent value for a premium product with ${product.rating}/5 stars.`,
        faq: faq,
        conclusion: `Don't miss out on this top-rated ${product.category.toLowerCase()} product. With thousands of satisfied customers and a stellar ${product.rating}/5 rating, the ${product.title} delivers on its promises. Click the button above to check current availability and pricing on Amazon.`
      },

      // Empty amazon_reviews
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
    console.error('Generate high-ticket page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
