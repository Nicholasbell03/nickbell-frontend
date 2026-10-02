import { defineMiddleware } from 'astro:middleware';
import { applySecurityHeaders } from '@/lib/securityHeaders';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Netlify's netlify.toml headers don't reach SSR function responses
  applySecurityHeaders(response.headers);

  // Never cache preview pages at CDN or browser
  if (context.url.searchParams.has('token')) {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Netlify-CDN-Cache-Control', 'private, no-store');
  }

  return response;
});
