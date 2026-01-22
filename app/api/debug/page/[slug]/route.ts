import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = getSupabaseAdmin();
    
    const { data: page, error } = await supabase
      .from('pages')
      .select('id, title, conversion_boosters, page_type, created_at')
      .eq('public_slug', slug)
      .single();
    
    if (error || !page) {
      return NextResponse.json({ error: 'Page not found', slug }, { status: 404 });
    }
    
    return NextResponse.json({
      slug,
      title: page.title,
      page_type: page.page_type,
      conversion_boosters: page.conversion_boosters,
      created_at: page.created_at,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
