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

    // Prepare page data
    const pageData = {
      user_id: user.id,
      title: product.profitPage.headline,
      keyword: product.category,
      asin: product.asin,
      geo: 'US', // Default geo
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
        reviews: product.reviews,
        bulletPoints: product.bulletPoints,
        imageUrl: product.imageUrl,
      },

      // Generated content from platinum data
      generated_content: {
        headline: product.profitPage.headline,
        subheadline: product.profitPage.subheadline,
        overview: product.profitPage.overview,
        sections: [
          {
            heading: 'Key Benefits',
            content: product.bulletPoints.map(b => `<p>✓ ${b}</p>`).join(''),
          }
        ],
        pros: product.profitPage.pros,
        cons: product.profitPage.cons,
        verdict: product.profitPage.verdict,
        faq: product.profitPage.faq,
        conclusion: product.profitPage.verdict,
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
