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

    // Prepare page data
    const pageData = {
      user_id: user.id,
      title: comparison.title,
      keyword: comparison.category,
      asin: comparison.product1.asin, // Primary product
      affiliate_link: affiliateLink1,
      public_slug: publicSlug,
      status: 'published',
      page_type: 'comparison',
      hero_image: comparison.product1.image, // Use product 1 image as hero
      conversion_boosters: boosters,
      
      // Product data includes both products for comparison
      product_data: {
        product1: {
          ...comparison.product1,
          affiliateLink: affiliateLink1,
        },
        product2: {
          ...comparison.product2,
          affiliateLink: affiliateLink2,
        },
        winner: comparison.winner,
      },

      // Generated content - store the simple comparison data
      generated_content: {
        type: 'comparison',
        verdict: comparison.verdict,
        whenToChoose1: comparison.whenToChoose1,
        whenToChoose2: comparison.whenToChoose2,
      },

      // Empty amazon_reviews for comparison pages
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
