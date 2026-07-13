import type { APIRoute } from 'astro';
import { fetchAllPages, siteOrigin } from '@/lib/content-index';
import type { BlogSummary } from '@/types/blog';
import type { ProjectSummary } from '@/types/project';
import type { ShareSummary } from '@/types/share';

const NOTE_MAX_LENGTH = 200;

function line(title: string | null, url: string, note?: string | null): string {
  const collapsed = note?.replace(/\s+/g, ' ').trim() ?? '';
  const clipped =
    collapsed.length > NOTE_MAX_LENGTH ? `${collapsed.slice(0, NOTE_MAX_LENGTH).trimEnd()}…` : collapsed;
  const suffix = clipped ? `: ${clipped}` : '';
  return `- [${title ?? url}](${url})${suffix}`;
}

export const GET: APIRoute = async ({ site }) => {
  const origin = siteOrigin(site);

  const [blogs, projects, shares] = await Promise.all([
    fetchAllPages<BlogSummary>('/api/v1/blogs'),
    fetchAllPages<ProjectSummary>('/api/v1/projects'),
    fetchAllPages<ShareSummary>('/api/v1/shares'),
  ]);

  // null marks a failed fetch — serve what we have, but never let the CDN
  // durably cache a degraded index.
  const allSucceeded = blogs !== null && projects !== null && shares !== null;

  const sections = [
    '# Nicholas Bell',
    '',
    '> Personal site of Nicholas Bell, a software engineer building modern web applications. It hosts blog posts, a portfolio of projects, and curated links (shares), backed by a Laravel API with an Astro frontend.',
    '',
    'Blog posts are available as clean markdown by appending `.md` to their URL (linked below).',
    '',
    '## Blog',
    '',
    ...(blogs ?? []).map((b) => line(b.title, `${origin}/blog/${b.slug}.md`, b.excerpt)),
    '',
    '## Projects',
    '',
    ...(projects ?? []).map((p) => line(p.title, `${origin}/projects/${p.slug}`, p.description)),
    '',
    '## Shares',
    '',
    ...(shares ?? []).map((s) => line(s.title, `${origin}/shares/${s.slug}`, s.description)),
    '',
    '## Optional',
    '',
    `- [RSS feed](${origin}/feed): latest blog posts and projects`,
    `- [Sitemap](${origin}/sitemap.xml)`,
    `- [Search API](https://api.nickbell.dev/api/v1/search?q=): hybrid semantic + keyword search over all site content (JSON)`,
    '',
  ];

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      // CDN cache: 1 day fresh, 7 days stale-while-revalidate
      ...(allSucceeded && {
        'Netlify-CDN-Cache-Control': 'durable, public, s-maxage=86400, stale-while-revalidate=604800',
      }),
    },
  });
};
