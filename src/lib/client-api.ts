/**
 * Client-side API utilities for React islands (chat, search).
 * Server-side pages use src/lib/api.ts instead.
 */

import type { SearchResults, SearchType } from '@/types/search';

const API_BASE = import.meta.env.PUBLIC_API_URL || 'https://api.nickbell.dev';

export const chatApi = {
  streamChat(
    message: string,
    conversationId: string | null,
    turnstileToken: string | null,
    signal?: AbortSignal,
  ): Promise<Response> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    // Single-use bot-protection token, verified by the backend (see lib/turnstile.ts)
    if (turnstileToken) headers['X-Turnstile-Token'] = turnstileToken;

    return fetch(`${API_BASE}/api/v1/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, conversation_id: conversationId }),
      signal,
    });
  },
};

export async function searchContent(
  query: string,
  type: SearchType = 'all',
  signal?: AbortSignal,
): Promise<SearchResults> {
  const params = new URLSearchParams({ q: query, type });
  const res = await fetch(`${API_BASE}/api/v1/search?${params}`, { signal });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}
