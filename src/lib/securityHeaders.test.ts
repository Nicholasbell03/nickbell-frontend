import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { applySecurityHeaders, buildContentSecurityPolicy, ENFORCED_SECURITY_HEADERS } from './securityHeaders';

/** Parse the `[headers.values]` of the `for = "/*"` block in netlify.toml. */
function netlifyTomlHeaders(): Record<string, string> {
  const toml = readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8');
  const block = toml.split('[[headers]]').find((section) => /for\s*=\s*"\/\*"/.test(section));
  if (!block) throw new Error('No [[headers]] block for "/*" in netlify.toml');

  const values = block.split('[headers.values]')[1] ?? '';
  return Object.fromEntries(
    [...values.matchAll(/^\s*([A-Za-z-]+)\s*=\s*"(.*)"\s*$/gm)].map(([, name, value]) => [name, value]),
  );
}

describe('security headers', () => {
  it('applies the enforced headers and the Report-Only CSP', () => {
    const headers = new Headers({ 'Content-Type': 'text/html' });
    applySecurityHeaders(headers);

    expect(headers.get('X-Frame-Options')).toBe('DENY');
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()');
    expect(headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
    expect(headers.get('Content-Security-Policy')).toBe("frame-ancestors 'none'");
    expect(headers.get('Content-Security-Policy-Report-Only')).toBe(buildContentSecurityPolicy());
    expect(headers.get('Content-Type')).toBe('text/html');
  });

  it('allows the third parties the site depends on in the Report-Only CSP', () => {
    const csp = buildContentSecurityPolicy();

    expect(csp).toMatch(/script-src [^;]*https:\/\/challenges\.cloudflare\.com/);
    expect(csp).toMatch(/script-src [^;]*https:\/\/static\.cloudflareinsights\.com/);
    expect(csp).toMatch(/frame-src [^;]*https:\/\/challenges\.cloudflare\.com/);
    expect(csp).toMatch(/frame-src [^;]*https:\/\/www\.youtube\.com/);
    expect(csp).toMatch(/connect-src [^;]*https:\/\/api\.nickbell\.dev/);
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });

  it('keeps netlify.toml static-file headers in sync with the SSR headers', () => {
    expect(netlifyTomlHeaders()).toEqual(ENFORCED_SECURITY_HEADERS);
  });
});
