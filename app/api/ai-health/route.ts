import { NextRequest, NextResponse } from 'next/server';
import { lastAiProvider, openRouterChat, setLastAiProvider } from '@/lib/openrouter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = process.env.AI_HEALTH_SECRET;
  if (!secret || request.headers.get('x-ai-health-secret') !== secret) {
    return new NextResponse(null, { status: 404 });
  }

  const noStore = { 'Cache-Control': 'no-store' };
  const started = Date.now();
  try {
    const text = await openRouterChat([{ role: 'user', content: 'Reply with the single word ok' }]);
    setLastAiProvider('openrouter');
    return NextResponse.json(
      { ok: true, provider: lastAiProvider, ms: Date.now() - started, sample: text.slice(0, 40) },
      { headers: noStore }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error), ms: Date.now() - started },
      { status: 502, headers: noStore }
    );
  }
}
