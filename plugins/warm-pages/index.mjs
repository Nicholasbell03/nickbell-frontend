// Netlify build plugin: after every successful deploy (which purges the
// durable CDN cache), crawl the sitemap so every page is re-rendered and
// cached at the edge before real visitors arrive. Runs inside the deploy
// pipeline — no external cron needed.
const CONCURRENCY = 8;
const REQUEST_TIMEOUT_MS = 30_000;

export const onSuccess = async ({ utils }) => {
  const base = (process.env.URL || 'https://nickbell.dev').replace(/\/$/, '');

  try {
    const sitemapRes = await fetch(`${base}/sitemap.xml`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!sitemapRes.ok) {
      throw new Error(`sitemap returned ${sitemapRes.status}`);
    }

    const xml = await sitemapRes.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (urls.length === 0) {
      throw new Error('sitemap contained no URLs');
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
