import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isOpenRouterConfigured, openRouterChat, setLastAiProvider } from '@/lib/openrouter';
import { generatePostSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit
    const rateLimit = checkRateLimit(user.id + '-post', 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      );
    }

    // Validate body
    const body = await request.json();
    const validation = generatePostSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { productTitle, keyword, pageUrl } = validation.data;

    // Call ChatGPT API
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_CHATGPT_HOST || 'chatgpt-42.p.rapidapi.com';

    if (!rapidApiKey) {
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    const prompt = `Generate a viral Instagram/social media post for promoting this product review page. Make it engaging, casual, and include emojis. Do not make health or income claims.

Product: ${productTitle}
Category: ${keyword}
Review Page URL: ${pageUrl}

Generate a JSON response with this EXACT structure (no markdown, just valid JSON):
{
  "caption": "An engaging 2-3 sentence caption that creates curiosity and includes the URL. Use emojis. Include a call-to-action.",
  "hashtags": "15-20 relevant hashtags separated by spaces, starting with #"
}

Return ONLY valid JSON, no explanation or markdown.`;

    let content = '';
    if (isOpenRouterConfigured()) {
      try {
        content = await openRouterChat([{ role: 'user', content: prompt }]);
        setLastAiProvider('openrouter');
      } catch (error) {
        console.warn('[ai] OpenRouter failed, using RapidAPI:', error instanceof Error ? error.message : error);
      }
    }

    if (!content) {
      const response = await fetch(`https://${rapidApiHost}/gpt4`, {
        method: 'POST',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': rapidApiHost,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          web_access: false,
        }),
        signal: AbortSignal.timeout(90000),
      });

      if (!response.ok) {
        console.error('ChatGPT API error:', response.status, await response.text());
        return NextResponse.json(
          { error: 'Failed to generate post' },
          { status: response.status }
        );
      }

      const data = await response.json();
    
      // Extract content from response
      content = data?.result || data?.message || data?.choices?.[0]?.message?.content || '';
      setLastAiProvider('rapidapi');
    }
    
    // Clean up any markdown code blocks
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON
    let generatedPost;
    try {
      generatedPost = JSON.parse(content);
    } catch {
      console.error('Failed to parse AI response:', content);
      // Return fallback content
      generatedPost = {
        caption: `🔥 Just found this amazing ${keyword} that everyone's talking about! Check out my honest review 👇\n\n${pageUrl}\n\n✨ Link in bio for full details!`,
        hashtags: `#${keyword.replace(/\s+/g, '')} #amazonfinds #musthave #viral #trending #productreview #recommended #shopping #deals #bestseller #toprated #qualityproducts #shopnow #linkinbio #review`,
      };
    }

    return NextResponse.json({
      success: true,
      post: generatedPost,
    });
  } catch (error) {
    console.error('Generate post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

