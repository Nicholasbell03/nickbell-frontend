const CRAWLER_UA_REGEX =
  /LinkedInBot|Slackbot|Twitterbot|facebookexternalhit|Googlebot|Discordbot|WhatsApp|Applebot|Pinterestbot|TelegramBot|Baiduspider/i;

const SITE_NAME = 'Nicholas Bell';
const SITE_URL = 'https://nickbell.dev';
const DEFAULT_TITLE = 'Nicholas Bell | Software Engineer';
const DEFAULT_DESCRIPTION =
  'Software engineer building modern web applications. Blog posts, projects, and curated links.';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;
const API_BASE = 'https://api.nickbell.dev/api/v1';

interface OgData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
  publishedTime?: string;
}

function buildHtml(og: OgData): string {
  const escaped = {
    title: escapeHtml(og.title),
    description: escapeHtml(og.description),
    image: escapeHtml(og.image),
    url: escapeHtml(og.url),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escaped.title}</title>
  <meta name="description" content="${escaped.description}" />
  <link rel="canonical" href="${escaped.url}" />

  <meta property="og:title" content="${escaped.title}" />
  <meta property="og:description" content="${escaped.description}" />
  <meta property="og:image" content="${escaped.image}" />
  <meta property="og:url" content="${escaped.url}" />
  <meta property="og:type" content="${escapeHtml(og.type)}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  ${og.publishedTime ? `<meta property="article:published_time" content="${escapeHtml(og.publishedTime)}" />` : ''}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escaped.title}" />
  <meta name="twitter:description" content="${escaped.description}" />
  <meta name="twitter:image" content="${escaped.image}" />
</head>
<body></body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function absoluteImageUrl(url: string | null | undefined): string {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

const API_PATH_MAP: Record<string, string> = {
  blog: 'blogs',
  projects: 'projects',
  shares: 'shares',
};

function parseRoute(pathname: string): { type: string; apiPath: string; slug: string } | null {
  const match = pathname.match(/^\/(blog|projects|shares)\/([^/?#]+)/);
  if (!match) return null;
  return { type: match[1], apiPath: API_PATH_MAP[match[1]], slug: match[2] };
}

export default async function handler(request: Request, context: { next: () => Promise<Response> }) {
  const ua = request.headers.get('user-agent') ?? '';
  if (!CRAWLER_UA_REGEX.test(ua)) {
    return context.next();
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  // Homepage — return hardcoded defaults, no API call
  if (pathname === '/' || pathname === '') {
    return new Response(
      buildHtml({
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        image: DEFAULT_IMAGE,
        url: SITE_URL,
        type: 'website',
      }),
      {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      },
    );
  }

  const route = parseRoute(pathname);
  if (!route) {
    return context.next();
  }

  try {
    const apiUrl = `${API_BASE}/${route.apiPath}/${route.slug}`;
    const response = await fetch(apiUrl, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return crawlerResponse(defaultOgForPath(pathname));
    }

    const json = await response.json();
    const data = json.data;

    const og: OgData = {
      title: `${data.title ?? route.slug} | ${SITE_NAME}`,
      description: data.meta_description ?? data.excerpt ?? data.description ?? DEFAULT_DESCRIPTION,
      image: absoluteImageUrl(data.featured_image ?? data.image_url),
      url: `${SITE_URL}${pathname}`,
      type: route.type === 'blog' ? 'article' : 'website',
    };

    if (route.type === 'blog' && data.published_at) {
      og.publishedTime = data.published_at;
    }

    return crawlerResponse(og);
  } catch (error) {
    console.error('Failed to build OG metadata for request', {
      pathname,
      route,
      error,
    });

    return crawlerResponse(defaultOgForPath(pathname));
  }
}

function defaultOgForPath(pathname: string): OgData {
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    url: `${SITE_URL}${pathname}`,
    type: 'website',
  };
}

function crawlerResponse(og: OgData): Response {
  return new Response(buildHtml(og), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
