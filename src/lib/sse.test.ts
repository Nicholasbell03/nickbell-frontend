import { describe, expect, it } from 'vitest';
import { readSseErrorMessage } from './sse';

const sse = (...events: string[]) => events.map((e) => `data: ${e}\n\n`).join('');

describe('readSseErrorMessage', () => {
  it('returns the message from a 403 verification failure', async () => {
    const response = new Response(
      sse('{"type":"error","code":"verification_failed","message":"Verification failed. Please refresh."}', '[DONE]'),
      { status: 403, headers: { 'Content-Type': 'text/event-stream' } },
    );

    await expect(readSseErrorMessage(response)).resolves.toBe('Verification failed. Please refresh.');
  });

  it('returns the message from a 429 rate-limit response', async () => {
    const response = new Response(
      sse('{"type":"error","code":"rate_limited","message":"Slow down."}', '[DONE]'),
      { status: 429 },
    );

    await expect(readSseErrorMessage(response)).resolves.toBe('Slow down.');
  });

  it('returns null for non-SSE bodies so callers fall back to a generic message', async () => {
    await expect(readSseErrorMessage(new Response('<html>Bad gateway</html>', { status: 502 }))).resolves.toBeNull();
    await expect(readSseErrorMessage(new Response('{"message":"Server Error"}', { status: 500 }))).resolves.toBeNull();
    await expect(readSseErrorMessage(new Response(null, { status: 503 }))).resolves.toBeNull();
  });
});
