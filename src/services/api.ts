import type { Blog, BlogSummary, PaginatedResponse } from '@/types/blog';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const blogApi = {
  async getAll(page = 1): Promise<PaginatedResponse<BlogSummary>> {
    return fetchApi<PaginatedResponse<BlogSummary>>(`/api/v1/blogs?page=${page}`);
  },

  async getFeatured(): Promise<{ data: BlogSummary[] }> {
    return fetchApi<{ data: BlogSummary[] }>('/api/v1/blogs/featured');
  },

  async getBySlug(slug: string): Promise<{ data: Blog }> {
    return fetchApi<{ data: Blog }>(`/api/v1/blogs/${slug}`);
  },
};
