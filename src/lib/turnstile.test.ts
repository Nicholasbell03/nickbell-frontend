import { describe, expect, it } from 'vitest';
import { getTurnstileToken, isTurnstileEnabled, preloadTurnstile } from './turnstile';

// PUBLIC_TURNSTILE_SITE_KEY is unset under vitest, mirroring local dev.
describe('turnstile without a site key', () => {
  it('is disabled', () => {
    expect(isTurnstileEnabled()).toBe(false);
  });

  it('resolves no token without touching the DOM', async () => {
    // No window/document exist in the node test environment, so any attempt
    // to load the script or render a widget would throw here.
    expect(() => preloadTurnstile()).not.toThrow();
    await expect(getTurnstileToken()).resolves.toBeNull();
  });
});
