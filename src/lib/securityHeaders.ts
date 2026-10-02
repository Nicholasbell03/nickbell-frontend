/**
 * Security headers for every SSR response (applied in src/middleware.ts).
 *
 * Netlify does not apply netlify.toml / _headers custom headers to responses
 * from functions, and every page on this site is server-rendered by the SSR
 * function, so pages must set these themselves. netlify.toml mirrors the
 * enforced headers for files the CDN serves directly (/_astro/*, public/);
 * securityHeaders.test.ts keeps the two in sync.
 */

const API_ORIGIN = 'https://api.nickbell.dev';

/** Origins the browser talks to for the chat/search API (client-api.ts). */
function apiOrigins(): string[] {
  const origins = new Set([API_ORIGIN]);
  try {
    origins.add(new URL(import.meta.env.PUBLIC_API_URL).origin);
  } catch {
    // Unset or invalid — client-api.ts falls back to API_ORIGIN as well
  }
  return [...origins];
}

/**
 * Full Content Security Policy, currently shipped as Report-Only so
 * violations show in the browser console without breaking anything.
 * Sources, by consumer:
 * - script: Astro island/hydration + ClientRouter inline scripts and the
 *   inline onerror handler on homepage share images ('unsafe-inline'),
 *   Cloudflare Web Analytics beacon (Layout.astro), Turnstile (lib/turnstile.ts)
 * - style: Astro-scoped <style> blocks and style="" attributes in CMS HTML
 * - img: CMS images on assets.nickbell.dev plus share OG images from
 *   arbitrary hosts (pbs.twimg.com, i.ytimg.com, cdn.sanity.io, ...) — https:
 * - media: CMS <video> on assets.nickbell.dev, react-tweet videos
 * - connect: chat/search API, ClientRouter page fetches ('self'), analytics
 * - frame: YouTube/Vimeo embeds allowed by lib/sanitize.ts, Turnstile
 */
export function buildContentSecurityPolicy(): string {
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      'https://static.cloudflareinsights.com',
      'https://challenges.cloudflare.com',
    ],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'media-src': ["'self'", 'https://assets.nickbell.dev', 'https://video.twimg.com'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      ...apiOrigins(),
      'https://cloudflareinsights.com',
      'https://static.cloudflareinsights.com',
    ],
    'frame-src': [
      'https://www.youtube.com',
      'https://youtube.com',
      'https://player.vimeo.com',
      'https://challenges.cloudflare.com',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };

  return Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
}

/** Headers enforced on every response (pages here, static files via netlify.toml). */
export const ENFORCED_SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  // Only clickjacking protection is enforced for now; see Report-Only below.
  'Content-Security-Policy': "frame-ancestors 'none'",
};

const CSP_REPORT_ONLY = buildContentSecurityPolicy();

/** Apply all security headers to an SSR response's headers. */
export function applySecurityHeaders(headers: Headers): void {
  for (const [name, value] of Object.entries(ENFORCED_SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  headers.set('Content-Security-Policy-Report-Only', CSP_REPORT_ONLY);
}
