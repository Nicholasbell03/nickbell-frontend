import { useQuery } from '@tanstack/react-query';
import { blogApi, githubApi, projectApi, shareApi } from '@/services/api';

/**
 * Query keys for cache management.
 * Using a factory pattern makes it easy to invalidate related queries.
 */
export const queryKeys = {
  blogs: {
    all: ['blogs'] as const,
    lists: () => [...queryKeys.blogs.all, 'list'] as const,
    list: (page: number) => [...queryKeys.blogs.lists(), page] as const,
    featured: () => [...queryKeys.blogs.all, 'featured'] as const,
    details: () => [...queryKeys.blogs.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.blogs.details(), slug] as const,
    preview: (slug: string) => [...queryKeys.blogs.all, 'preview', slug] as const,
  },
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (page: number) => [...queryKeys.projects.lists(), page] as const,
    featured: () => [...queryKeys.projects.all, 'featured'] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.projects.details(), slug] as const,
    preview: (slug: string) => [...queryKeys.projects.all, 'preview', slug] as const,
  },
  shares: {
    all: ['shares'] as const,
    lists: () => [...queryKeys.shares.all, 'list'] as const,
    list: (page: number) => [...queryKeys.shares.lists(), page] as const,
    featured: () => [...queryKeys.shares.all, 'featured'] as const,
    details: () => [...queryKeys.shares.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.shares.details(), slug] as const,
  },
  github: {
    all: ['github'] as const,
    activity: () => [...queryKeys.github.all, 'activity'] as const,
  },
};

/**
 * Fetch all blogs with pagination
 */
export function useBlogs(page = 1) {
  return useQuery({
    queryKey: queryKeys.blogs.list(page),
    queryFn: () => blogApi.getAll(page),
    staleTime: 10 * 60 * 1000, // 10 minutes - matches backend cache
  });
}

/**
 * Fetch featured blogs for homepage
 */
export function useFeaturedBlogs() {
  return useQuery({
    queryKey: queryKeys.blogs.featured(),
    queryFn: () => blogApi.getFeatured(),
    staleTime: 5 * 60 * 1000, // 5 minutes - matches backend cache
  });
}

/**
 * Fetch a single blog by slug
 */
export function useBlog(slug: string | undefined, previewToken?: string | null) {
  return useQuery({
    queryKey: previewToken
      ? queryKeys.blogs.preview(slug!)
      : queryKeys.blogs.detail(slug!),
    queryFn: () => blogApi.getBySlug(slug!, previewToken),
    enabled: !!slug,
    staleTime: previewToken ? 0 : 60 * 60 * 1000, // No cache for preview, 1 hour for published
  });
}

/**
 * Fetch all projects with pagination
 */
export function useProjects(page = 1) {
  return useQuery({
    queryKey: queryKeys.projects.list(page),
    queryFn: () => projectApi.getAll(page),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch featured projects for homepage
 */
export function useFeaturedProjects() {
  return useQuery({
    queryKey: queryKeys.projects.featured(),
    queryFn: () => projectApi.getFeatured(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single project by slug
 */
export function useProject(slug: string | undefined, previewToken?: string | null) {
  return useQuery({
    queryKey: previewToken
      ? queryKeys.projects.preview(slug!)
      : queryKeys.projects.detail(slug!),
    queryFn: () => projectApi.getBySlug(slug!, previewToken),
    enabled: !!slug,
    staleTime: previewToken ? 0 : 60 * 60 * 1000, // No cache for preview, 1 hour for published
  });
}

/**
 * Fetch all shares with pagination
 */
export function useShares(page = 1) {
  return useQuery({
    queryKey: queryKeys.shares.list(page),
    queryFn: () => shareApi.getAll(page),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch featured shares for homepage
 */
export function useFeaturedShares() {
  return useQuery({
    queryKey: queryKeys.shares.featured(),
    queryFn: () => shareApi.getFeatured(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single share by slug
 */
export function useShare(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.shares.detail(slug!),
    queryFn: () => shareApi.getBySlug(slug!),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Fetch GitHub contribution activity
 */
export function useGitHubActivity() {
  return useQuery({
    queryKey: queryKeys.github.activity(),
    queryFn: () => githubApi.getActivity(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
