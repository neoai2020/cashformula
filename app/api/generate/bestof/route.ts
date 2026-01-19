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

    // Prepare page data
    const pageData = {
      user_id: user.id,
      title: list.title,
      keyword: list.category,
      asin: list.products[0].asin, // Primary product
      geo: 'US', // Default geo
      affiliate_link: affiliateLinks[0], // Primary affiliate link
      public_slug: publicSlug,
      status: 'published',
      page_type: 'bestof',
      hero_image: list.products[0].image,
      conversion_boosters: boosters,
      
      // Product data includes all ranked products with their affiliate links
      product_data: {
        products: list.products.map((product, index) => ({
          ...product,
          affiliateLink: affiliateLinks[index],
        })),
      },

      // Generated content
      generated_content: {
        type: 'bestof',
        subtitle: list.subtitle,
        intro: list.intro,
      },

      // Empty amazon_reviews for best-of pages
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
