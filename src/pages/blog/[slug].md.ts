import type { APIRoute } from 'astro';
import TurndownService from 'turndown';
import { fetchApi } from '@/lib/api';
import { siteOrigin } from '@/lib/content-index';
import type { Blog } from '@/types/blog';

export const GET: APIRoute = async ({ params, site }) => {
  const origin = siteOrigin(site);
  const { slug } = params;

  let post: Blog;
  try {
    const res = await fetchApi<{ data: Blog }>(`/api/v1/blogs/${slug}`);
    post = res.data;
  } catch {
    return new Response('Not found', { status: 404 });
  }

  const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
  const body = turndown.turndown(post.content);

  const markdown = [
    `# ${post.title}`,
    '',
    `> ${post.excerpt ?? post.meta_description ?? ''}`.trimEnd(),
    '',
    `Published: ${post.published_at.slice(0, 10)}`,
    `Canonical: ${origin}/blog/${post.slug}`,
    '',
    '---',
    '',
    body,
    '',
  ].join('\n');

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // CDN cache: 7 days fresh, 30 days stale-while-revalidate (matches the HTML page)
      'Netlify-CDN-Cache-Control': 'durable, public, s-maxage=604800, stale-while-revalidate=2592000',
    },
  });
};
