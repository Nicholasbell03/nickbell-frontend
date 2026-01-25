import type { Blog, BlogSummary, PaginatedResponse } from "@/types/blog";
import type { Project, ProjectSummary } from "@/types/project";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "https://nickbell-dev.onrender.com";

async function fetchApi<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${endpoint}`);

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

export const blogApi = {
	async getAll(page = 1): Promise<PaginatedResponse<BlogSummary>> {
		return fetchApi<PaginatedResponse<BlogSummary>>(
			`/api/v1/blogs?page=${page}`,
		);
	},

	async getFeatured(): Promise<{ data: BlogSummary[] }> {
		return fetchApi<{ data: BlogSummary[] }>("/api/v1/blogs/featured");
	},

	async getBySlug(slug: string): Promise<{ data: Blog }> {
		return fetchApi<{ data: Blog }>(`/api/v1/blogs/${slug}`);
	},
};

export const projectApi = {
	async getAll(page = 1): Promise<PaginatedResponse<ProjectSummary>> {
		return fetchApi<PaginatedResponse<ProjectSummary>>(
			`/api/v1/projects?page=${page}`,
		);
	},

	async getFeatured(): Promise<{ data: ProjectSummary[] }> {
		return fetchApi<{ data: ProjectSummary[] }>(
			"/api/v1/projects/featured",
		);
	},

	async getBySlug(slug: string): Promise<{ data: Project }> {
		return fetchApi<{ data: Project }>(`/api/v1/projects/${slug}`);
	},
};
