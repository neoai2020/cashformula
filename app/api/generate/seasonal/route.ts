import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { seasonalCalendar } from '@/lib/platinum-data';

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
    const { month, productIndex, asin, affiliateLink, boosters = [] } = body;

    // Validate required fields
    if (!month || productIndex === undefined || !asin || !affiliateLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the seasonal promotion data
    const seasonal = seasonalCalendar.find((s) => s.month === month);

    if (!seasonal) {
      return NextResponse.json(
        { error: 'Seasonal data not found' },
        { status: 404 }
      );
    }

    if (productIndex >= seasonal.topProducts.length) {
      return NextResponse.json(
        { error: 'Invalid product index' },
        { status: 400 }
      );
    }

    const productName = seasonal.topProducts[productIndex];

    // Generate unique slug
    const baseSlug = `${seasonal.month.toLowerCase()}-${productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}`;
    const timestamp = Date.now();
    const publicSlug = `${baseSlug}-${timestamp}`;

    // Generate title
    const title = `${productName} - Perfect for ${seasonal.season}`;

    // Prepare page data
    const pageData = {
      user_id: user.id,
      title: title,
      keyword: seasonal.theme,
      asin: asin,
      geo: 'US', // Default geo
      affiliate_link: affiliateLink,
      public_slug: publicSlug,
      status: 'published',
      page_type: 'seasonal',
      hero_image: null, // Will use product image from Amazon if available
      conversion_boosters: boosters,
      
      // Product data
      product_data: {
        productName: productName,
        month: seasonal.month,
        season: seasonal.season,
        theme: seasonal.theme,
        emoji: seasonal.emoji,
      },

      // Generated content
      generated_content: {
        type: 'seasonal',
        intro: `Perfect for ${seasonal.season}, this ${productName} is ideal for ${seasonal.theme.toLowerCase()}. ${seasonal.tips[0] || ''}`,
        postIdeas: seasonal.postIdeas,
        tips: seasonal.tips,
      },

      // Empty amazon_reviews for seasonal pages
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
    console.error('Generate seasonal page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
