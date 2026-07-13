import { fetchApi } from '@/lib/api';
import type { PaginatedResponse } from '@/types/blog';

const MAX_PAGES = 50;

/** Fetch every page of a paginated API index. Returns [] on failure. */
export async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  const items: T[] = [];
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const res = await fetchApi<PaginatedResponse<T>>(`${endpoint}?page=${page}`);
      items.push(...res.data);
      if (page >= res.meta.last_page) break;
    }
  } catch {
    return [];
  }
  return items;
}
