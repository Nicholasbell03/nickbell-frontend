/**
 * Extract the user-facing message from a non-2xx chat response. The backend
 * sends errors (429 rate limit, 403 failed verification, 503 unavailable)
 * as an SSE body: `data: {"type":"error","code":"...","message":"..."}`.
 */
export async function readSseErrorMessage(response: Response): Promise<string | null> {
  try {
    const body = await response.text();
    for (const line of body.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') continue;
      try {
        const event = JSON.parse(data);
        if (event.type === 'error' && typeof event.message === 'string' && event.message) {
          return event.message;
        }
      } catch {
        // Not JSON — keep looking
      }
    }
  } catch {
    // Body unreadable
  }
  return null;
}
