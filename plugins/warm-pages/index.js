// Netlify build plugin: after every successful deploy (which purges the
// durable CDN cache), crawl the sitemap so every page is re-rendered and
// cached at the edge before real visitors arrive. Runs inside the deploy
// pipeline — no external cron needed.
const CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 30_000;
// Safety cap so a runaway sitemap can never burn build minutes.
const MAX_URLS = 500;

export const onSuccess = async ({ utils }) => {
  // Only production deploys purge (and serve) the production cache — warming
  // from previews/branch deploys would crawl the live domain pointlessly.
  if (process.env.CONTEXT && process.env.CONTEXT !== 'production') {
    console.log(`warm-pages: skipping for context "${process.env.CONTEXT}"`);
    return;
  }

  const base = (process.env.URL || 'https://nickbell.dev').replace(/\/$/, '');

  try {
    const sitemapRes = await fetch(`${base}/sitemap.xml`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!sitemapRes.ok) {
      throw new Error(`sitemap returned ${sitemapRes.status}`);
    }

    const xml = await sitemapRes.text();
    let urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length === 0) {
      throw new Error('sitemap contained no URLs');
    }
    if (urls.length > MAX_URLS) {
      console.warn(`warm-pages: sitemap has ${urls.length} URLs, warming only the first ${MAX_URLS}`);
      urls = urls.slice(0, MAX_URLS);
    }

    let warmed = 0;
    const failed = [];

    for (let i = 0; i < urls.length; i += CONCURRENCY) {
      const chunk = urls.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(
        chunk.map((url) => fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })),
      );

      results.forEach((result, j) => {
        if (result.status === 'fulfilled' && result.value.ok) {
          warmed++;
        } else {
          failed.push(chunk[j]);
        }
      });
    }

    console.log(`warm-pages: warmed ${warmed}/${urls.length} pages`);
    if (failed.length > 0) {
      console.warn(`warm-pages: failed to warm ${failed.length}:`, failed.join(', '));
    }

    utils.status.show({
      title: 'Page warming',
      summary: `Warmed ${warmed}/${urls.length} pages into the edge cache`,
    });
  } catch (err) {
    // Warming is best-effort — never fail a successful deploy over it. The
    // /api/warm-frontend endpoint remains available as a manual fallback.
    console.warn(`warm-pages: skipped — ${err.message}`);
    utils.status.show({
      title: 'Page warming',
      summary: `Skipped: ${err.message}`,
    });
  }
};
