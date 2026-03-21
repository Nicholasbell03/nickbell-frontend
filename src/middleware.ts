import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  // Never cache preview pages at CDN or browser
  if (context.url.searchParams.has('token')) {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('Netlify-CDN-Cache-Control', 'private, no-store');
  }

  return response;
});
