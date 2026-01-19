import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest) {
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
    const { pageId, conversion_boosters } = body;

    // Validate required fields
    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    // Validate boosters is an array
    if (conversion_boosters && !Array.isArray(conversion_boosters)) {
      return NextResponse.json(
        { error: 'Conversion boosters must be an array' },
        { status: 400 }
      );
    }

    // Update the page - only allow updating own pages
    const { data: page, error: updateError } = await supabase
      .from('pages')
      .update({
        conversion_boosters: conversion_boosters || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
      .eq('user_id', user.id) // Security: only update own pages
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update page', details: updateError.message },
        { status: 500 }
      );
    }

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found or you do not have permission to edit it' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        title: page.title,
        conversion_boosters: page.conversion_boosters,
      },
    });
  } catch (error) {
    console.error('Update page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get user's pages
export async function GET(request: NextRequest) {
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

    // Get all user's pages
    const { data: pages, error: fetchError } = await supabase
      .from('pages')
      .select('id, title, public_slug, page_type, conversion_boosters, created_at, hero_image')
      .eq('user_id', user.id)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch pages' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      pages: pages || [],
    });
  } catch (error) {
    console.error('Get pages error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
