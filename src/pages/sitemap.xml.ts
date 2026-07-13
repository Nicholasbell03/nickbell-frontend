import type { APIRoute } from 'astro';
import { fetchAllPages } from '@/lib/content-index';
import type { BlogSummary } from '@/types/blog';
import type { ProjectSummary } from '@/types/project';
import type { ShareSummary } from '@/types/share';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
}

function toIsoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://nickbell.dev')).origin;

  const [blogs, projects, shares] = await Promise.all([
    fetchAllPages<BlogSummary>('/api/v1/blogs'),
    fetchAllPages<ProjectSummary>('/api/v1/projects'),
    fetchAllPages<ShareSummary>('/api/v1/shares'),
  ]);

  const entries: SitemapEntry[] = [
    { loc: `${origin}/` },
    { loc: `${origin}/blog` },
    { loc: `${origin}/projects` },
    { loc: `${origin}/shares` },
    ...blogs.map((b) => ({ loc: `${origin}/blog/${b.slug}`, lastmod: toIsoDate(b.published_at) })),
    ...projects.map((p) => ({
      loc: `${origin}/projects/${p.slug}`,
      lastmod: toIsoDate(p.published_at),
    })),
    ...shares.map((s) => ({ loc: `${origin}/shares/${s.slug}`, lastmod: toIsoDate(s.created_at) })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((e) =>
      [
        '  <url>',
        `    <loc>${escapeXml(e.loc)}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    ),
    '</urlset>',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // CDN cache: 1 day fresh, 7 days stale-while-revalidate
      'Netlify-CDN-Cache-Control': 'durable, public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
};
