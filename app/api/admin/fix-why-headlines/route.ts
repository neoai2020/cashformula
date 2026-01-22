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

// Fix "Why" headlines and awkward phrases in titles
function fixTitle(title: string, productTitle?: string): string {
  if (!title) return title;
  
  let newTitle = title;
  
  // Remove "Why " from the beginning
  if (newTitle.toLowerCase().startsWith('why ')) {
    newTitle = newTitle.slice(4);
  }
  
  // Remove awkward endings like "Is Amazing", "Is Worth Every Penny", etc.
  const awkwardEndings = [
    / is amazing$/i,
    / are amazing$/i,
    / is worth every penny$/i,
    / is worth it$/i,
    / is the best$/i,
    / is incredible$/i,
    / is fantastic$/i,
  ];
  
  for (const ending of awkwardEndings) {
    newTitle = newTitle.replace(ending, '');
  }
  
  // Clean up the title
  newTitle = newTitle.trim();
  
  // If we have the product title, use it to create a better headline
  if (productTitle && productTitle.length > 5) {
    // Extract a short version of product name (first 6 words max)
    const shortName = productTitle.split(' ').slice(0, 6).join(' ');
    
    // Create engaging headline variations
    const headlines = [
      `${shortName} - Honest Review`,
      `${shortName} Review: Is It Worth It?`,
      `The Truth About ${shortName}`,
      `${shortName} - Complete Buyer's Guide`,
    ];
    
    // Return a random good headline
    return headlines[Math.floor(Math.random() * headlines.length)];
  }
  
  // If no product title, just clean up what we have
  if (newTitle.length > 0) {
    // Capitalize first letter
    newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);
    
    // Add a suffix if title is too short
    if (newTitle.length < 30 && !newTitle.toLowerCase().includes('review')) {
      newTitle = `${newTitle} - Complete Review`;
    }
  }
  
  return newTitle;
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
      
      // Check if title needs fixing (starts with "Why" or has awkward phrases)
      const needsFixing = 
        oldTitle.toLowerCase().startsWith('why ') ||
        oldTitle.toLowerCase().includes(' is amazing') ||
        oldTitle.toLowerCase().includes(' is worth every penny') ||
        oldTitle.toLowerCase().includes(' is worth it');
      
      if (needsFixing) {
        const productTitle = (page.product_data as Record<string, unknown>)?.title as string;
        const newTitle = fixTitle(oldTitle, productTitle);
        
        // Only update if title actually changed
        if (newTitle !== oldTitle) {
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
        
        // Check if title needs fixing
        const needsFixing = 
          oldTitle.toLowerCase().startsWith('why ') ||
          oldTitle.toLowerCase().includes(' is amazing') ||
          oldTitle.toLowerCase().includes(' is worth every penny') ||
          oldTitle.toLowerCase().includes(' is worth it');
        
        if (needsFixing) {
          const productTitle = (page.product_data as Record<string, unknown>)?.title as string;
          const newTitle = fixTitle(oldTitle, productTitle);
          
          if (newTitle !== oldTitle) {
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
