/** Set CDN cache headers on a successful response. Skips silently if data is null (API failure). */
export function setCdnCache(
  response: { headers: Headers },
  data: unknown,
  { sMaxAge, swr }: { sMaxAge: number; swr: number },
) {
  if (data == null) return;
  response.headers.set(
    'Netlify-CDN-Cache-Control',
    `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`,
  );
}
