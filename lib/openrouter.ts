const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type AiProvider = 'openrouter' | 'rapidapi';

export let lastAiProvider: AiProvider | null = null;

export function setLastAiProvider(provider: AiProvider) {
  lastAiProvider = provider;
}

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export async function openRouterChat(
  messages: { role: string; content: string }[],
  opts: { temperature?: number; maxTokens?: number; timeoutMs?: number } = {}
): Promise<string> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY?.trim() ?? ''}`,
    'Content-Type': 'application/json',
    'X-Title': 'Cash Formula',
  };
  const referer = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || '';
  if (referer) headers['HTTP-Referer'] = referer;

  const body: Record<string, unknown> = {
    model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
    messages,
  };
  if (opts.temperature !== undefined) body.temperature = opts.temperature;
  if (opts.maxTokens !== undefined) body.max_tokens = opts.maxTokens;

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(opts.timeoutMs ?? 45000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`OpenRouter HTTP ${response.status}: ${detail.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('OpenRouter returned empty content');
  }
  return content;
}
