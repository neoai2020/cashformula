import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchQuerySchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit
    const rateLimit = checkRateLimit(user.id, 30, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    }

    // Validate query
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    const validation = searchQuerySchema.safeParse({ query });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    // Call RapidAPI
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_AMAZON_HOST || 'real-time-amazon-data.p.rapidapi.com';

    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY not configured');
      return NextResponse.json(
        { error: 'Search service not configured. Please contact support.' },
        { status: 500 }
      );
    }
    
    console.log('Calling Amazon API with host:', rapidApiHost);

    // Build the API URL based on the host being used
    let apiUrl: string;
    if (rapidApiHost.includes('real-time-amazon-data')) {
      apiUrl = `https://${rapidApiHost}/search?query=${encodeURIComponent(query!)}&page=1&country=US`;
    } else {
      apiUrl = `https://${rapidApiHost}/search?query=${encodeURIComponent(query!)}&page=1&geo=US`;
    }
    
    console.log('Fetching from:', apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Amazon API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Product search temporarily unavailable. Please try again later.' },
        { status: 500 }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      return NextResponse.json(
        { error: 'Invalid response from product search. Please try again.' },
        { status: 500 }
      );
    }
    
    // Log raw response for debugging
    console.log('Amazon API raw response:', JSON.stringify(data).slice(0, 500));
    
    // Transform and return products - handle various API response formats
    let products = data?.data?.products || data?.products || data?.results || [];
    
    // If data itself is an array
    if (Array.isArray(data)) {
      products = data;
    }
    
    // If data.data is an array
    if (Array.isArray(data?.data)) {
      products = data.data;
    }
    
    console.log('Products found:', products.length);
    if (products.length > 0) {
      console.log('First product raw:', JSON.stringify(products[0]).slice(0, 800));
    }
    
    return NextResponse.json({
      success: true,
      products: products.map((p: Record<string, unknown>) => {
        // Handle various price formats
        const priceObj = p.price as Record<string, unknown> | string | undefined;
        let priceValue: string | undefined;
        if (typeof priceObj === 'object' && priceObj) {
          priceValue = String(priceObj.current_price || priceObj.raw || priceObj.value || priceObj.amount || '');
        } else if (priceObj) {
          priceValue = String(priceObj);
        }
        
        // Handle various image formats - check nested objects too
        const imagesArray = p.images as string[] | undefined;
        let imageValue = p.image || p.thumbnail || p.main_image || p.product_photo || 
                        p.image_url || p.imageUrl || p.img || p.photo;
        
        // Check if images is an array
        if (!imageValue && imagesArray && Array.isArray(imagesArray) && imagesArray.length > 0) {
          imageValue = imagesArray[0];
        }
        
        // Check nested image object
        if (!imageValue && typeof p.image === 'object' && p.image) {
          const imgObj = p.image as Record<string, unknown>;
          imageValue = imgObj.url || imgObj.src || imgObj.link;
        }
        
        // Handle various rating formats
        let ratingValue = p.rating || p.stars || p.product_star_rating || p.star_rating;
        if (typeof ratingValue === 'object' && ratingValue) {
          ratingValue = (ratingValue as Record<string, unknown>).value || (ratingValue as Record<string, unknown>).score;
        }
        if (typeof ratingValue === 'string') {
          ratingValue = parseFloat(ratingValue);
        }
        
        // Handle reviews count
        let reviewsCount = p.reviews_count || p.ratings_total || p.reviews || 
                          p.product_num_ratings || p.num_ratings || p.reviewCount || p.review_count;
        if (typeof reviewsCount === 'string') {
          reviewsCount = parseInt(reviewsCount.replace(/[^0-9]/g, ''), 10);
        }
        
        const result = {
          asin: String(p.asin || p.product_asin || p.ASIN || p.productId || ''),
          title: String(p.title || p.name || p.product_title || p.productName || 'Unknown Product'),
          image: imageValue ? String(imageValue) : null,
          price: priceValue || p.current_price || p.product_price || null,
          rating: ratingValue || null,
          reviews_count: reviewsCount || null,
        };
        
        return result;
      }),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

