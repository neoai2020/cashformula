import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin Supabase client
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

// Fix "Why" headlines in titles
function fixTitle(title: string, productTitle?: string): string {
  if (!title) return title;
  
  // If title starts with "Why", replace it
  if (title.toLowerCase().startsWith('why ')) {
    // Get the rest of the title after "Why"
    const rest = title.slice(4);
    
    // Generate a better title
    const alternatives = [
      `The ${rest}`,
      `Discover ${rest}`,
      `Meet ${rest}`,
      `Get ${rest}`,
      `This ${rest}`,
    ];
    
    // Pick one based on what sounds best
    if (rest.toLowerCase().includes('is ') || rest.toLowerCase().includes('are ')) {
      // "Why X Is Amazing" -> "X Is Amazing"
      return rest.charAt(0).toUpperCase() + rest.slice(1);
    }
    
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  }
  
  return title;
}

export async function POST() {
  try {
    const supabase = getSupabaseAdmin();
    
    // Fetch all dfy_pages
    const { data: dfyPages, error: fetchError } = await supabase
      .from('dfy_pages')
      .select('id, generated_content, product_data');
    
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    let fixedCount = 0;
    const results: { id: string; oldTitle: string; newTitle: string }[] = [];

    for (const page of dfyPages || []) {
      const content = page.generated_content as Record<string, unknown> | null;
      if (!content?.title) continue;
      
      const oldTitle = String(content.title);
      
      // Check if title starts with "Why"
      if (oldTitle.toLowerCase().startsWith('why ')) {
        const productTitle = (page.product_data as Record<string, unknown>)?.title as string;
        const newTitle = fixTitle(oldTitle, productTitle);
        
        // Update the generated_content with new title
        const updatedContent = {
          ...content,
          title: newTitle,
        };
        
        const { error: updateError } = await supabase
          .from('dfy_pages')
          .update({ generated_content: updatedContent })
          .eq('id', page.id);
        
        if (!updateError) {
          fixedCount++;
          results.push({ id: page.id, oldTitle, newTitle });
        }
      }
    }

    // Also fix pages table
    const { data: userPages, error: pagesError } = await supabase
      .from('pages')
      .select('id, generated_content, product_data');
    
    if (!pagesError) {
      for (const page of userPages || []) {
        const content = page.generated_content as Record<string, unknown> | null;
        if (!content?.title) continue;
        
        const oldTitle = String(content.title);
        
        if (oldTitle.toLowerCase().startsWith('why ')) {
          const productTitle = (page.product_data as Record<string, unknown>)?.title as string;
          const newTitle = fixTitle(oldTitle, productTitle);
          
          const updatedContent = {
            ...content,
            title: newTitle,
          };
          
          const { error: updateError } = await supabase
            .from('pages')
            .update({ generated_content: updatedContent })
            .eq('id', page.id);
          
          if (!updateError) {
            fixedCount++;
            results.push({ id: page.id, oldTitle, newTitle });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} headlines`,
      results,
    });
  } catch (error) {
    console.error('Fix headlines error:', error);
    return NextResponse.json(
      { error: 'Failed to fix headlines' },
      { status: 500 }
    );
  }
}
