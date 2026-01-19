import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Use service role to bypass RLS for public page access
    const supabase = await createServiceClient();

    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('public_slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Return only public-safe data
    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        title: page.title,
        keyword: page.keyword,
        asin: page.asin,
        affiliate_link: page.affiliate_link,
        public_slug: page.public_slug,
        product_data: page.product_data,
        amazon_reviews: page.amazon_reviews,
        generated_content: page.generated_content,
        hero_image: page.hero_image,
        page_type: page.page_type || 'single_product',
        conversion_boosters: page.conversion_boosters || [],
      },
    });
  } catch (error) {
    console.error('Get page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

