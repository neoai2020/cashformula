import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { bestOfLists } from '@/lib/platinum-data';

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
    const { listId, affiliateLinks, boosters = [] } = body;

    // Validate required fields
    if (!listId || !affiliateLinks || affiliateLinks.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the best-of list data
    const list = bestOfLists.find((l) => l.id === listId);

    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    // Validate we have enough affiliate links
    if (affiliateLinks.length !== list.products.length) {
      return NextResponse.json(
        { error: `Need ${list.products.length} affiliate links for this list` },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = list.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const timestamp = Date.now();
    const publicSlug = `${baseSlug}-${timestamp}`;

    // Generate rich content for each product
    const productsWithContent = list.products.map((product, index) => ({
      ...product,
      name: product.title, // Add name alias for template compatibility
      affiliateLink: affiliateLinks[index],
      rank: index + 1,
      badge: product.badge || (index === 0 ? '🏆 BEST OVERALL' : index === 1 ? '🥈 RUNNER UP' : index === 2 ? '🥉 BEST VALUE' : `#${index + 1} PICK`),
      reviewSummary: `With ${product.rating}/5 stars, this product has earned excellent reviews from thousands of satisfied customers. ${product.pros[0]}.`,
    }));

    // Generate comprehensive intro
    const richIntro = list.intro || `Looking for the best ${list.category.toLowerCase()} products in ${new Date().getFullYear()}? We've tested and researched dozens of options to bring you this definitive list. Whether you're a beginner or a pro, there's something here for everyone. Each product has been selected based on quality, customer reviews, value, and real-world performance.`;

    // Generate FAQ
    const faq = [
      {
        question: 'How did you select these products?',
        answer: `We analyzed thousands of customer reviews, compared features, tested products, and considered value for money. Only products with consistently high ratings (4.5+ stars) and positive customer feedback made our list.`
      },
      {
        question: 'Which product is the best overall?',
        answer: `Our #1 pick is ${list.products[0].title} due to its exceptional combination of quality, features, and customer satisfaction. However, the "best" choice depends on your specific needs and budget.`
      },
      {
        question: 'Are these products worth the investment?',
        answer: `Absolutely! Every product on this list offers excellent value. We've included options at various price points so you can find something that fits your budget without sacrificing quality.`
      },
      {
        question: 'What if I need help choosing?',
        answer: `If our top pick doesn't fit your budget, consider our "Best Value" option. If you need premium features, our #1 pick is the way to go. Each product description includes who it's best for.`
      },
      {
        question: 'Do these products come with warranties?',
        answer: `Yes, all products include manufacturer warranties. When purchased through Amazon, you also get their customer-friendly return policy and A-to-Z Guarantee protection.`
      }
    ];

    // Generate sections
    const sections = [
      {
        title: 'How We Picked These Products',
        content: `Our selection process is rigorous. We analyzed:\n\n✓ Customer reviews from thousands of verified buyers\n✓ Product specifications and features\n✓ Value for money at each price point\n✓ Brand reputation and customer service\n✓ Long-term durability reports\n\nOnly products that excel in ALL these areas made our final list.`
      },
      {
        title: 'Quick Buying Guide',
        content: `Not sure which one to pick? Here's a quick guide:\n\n🏆 Best Overall: ${list.products[0]?.title} - Perfect if you want the best without compromise\n🥈 Runner Up: ${list.products[1]?.title || 'See list'} - Excellent alternative with great features\n💰 Best Value: ${list.products[2]?.title || 'See list'} - Best bang for your buck\n\nAll products on this list are highly rated and recommended!`
      }
    ];

    // Prepare page data with FULL rich content
    const pageData = {
      user_id: user.id,
      title: list.title,
      keyword: list.category,
      asin: list.products[0].asin,
      geo: 'US',
      affiliate_link: affiliateLinks.join(','), // Store all links
      public_slug: publicSlug,
      status: 'published',
      page_type: 'bestof',
      hero_image: list.products[0].image,
      conversion_boosters: boosters,
      
      // Product data with all ranked products
      product_data: {
        products: productsWithContent,
        category: list.category,
      },

      // FULL generated content
      generated_content: {
        type: 'bestof',
        subtitle: list.subtitle || `Updated for ${new Date().getFullYear()} - Expert Picks`,
        intro: richIntro,
        sections: sections,
        faq: faq,
        conclusion: `We hope this guide helps you find the perfect ${list.category.toLowerCase()} product for your needs. All products on this list are highly rated, well-reviewed, and deliver excellent value. Click any product to check current prices and availability on Amazon.`,
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
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
    console.error('Generate best-of page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
