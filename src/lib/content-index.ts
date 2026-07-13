import { fetchApi } from '@/lib/api';
import type { PaginatedResponse } from '@/types/blog';

const MAX_PAGES = 50;

/** Resolve the canonical site origin, falling back to production. */
export function siteOrigin(site: URL | undefined): string {
  return (site ?? new URL('https://nickbell.dev')).origin;
}

/**
 * Fetch every page of a paginated API index.
 * Returns null on failure so callers can skip CDN caching of degraded output.
 */
export async function fetchAllPages<T>(endpoint: string): Promise<T[] | null> {
  const items: T[] = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetchApi<PaginatedResponse<T>>(`${endpoint}?page=${page}`);
      items.push(...res.data);
      if (page >= res.meta.last_page) break;
    }
  } catch (err) {
    console.error(`content-index: failed to fetch ${endpoint}`, err);
    return null;
  }
  return items;
}
