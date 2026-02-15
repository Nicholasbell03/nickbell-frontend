import type { Blog, BlogSummary, PaginatedResponse } from "@/types/blog";
import type { GitHubActivity } from "@/types/github";
import type { Project, ProjectSummary } from "@/types/project";
import type { SearchResults, SearchType } from "@/types/search";
import type { Share, ShareSummary } from "@/types/share";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "https://api.nickbell.dev";

async function fetchApi<T>(
	endpoint: string,
	headers?: Record<string, string>,
): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		headers,
	});

	if (!response.ok) {
		throw new Error(`API error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}

/**
 * Get preview token from URL if present
 */
export function getPreviewToken(): string | null {
	const params = new URLSearchParams(window.location.search);
	return params.get("token");
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

	async getBySlug(
		slug: string,
		previewToken?: string | null,
	): Promise<{ data: Blog }> {
		if (previewToken) {
			return fetchApi<{ data: Blog }>(`/api/v1/blogs/preview/${slug}`, {
				"X-Preview-Token": previewToken,
			});
		}
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

	async getBySlug(
		slug: string,
		previewToken?: string | null,
	): Promise<{ data: Project }> {
		if (previewToken) {
			return fetchApi<{ data: Project }>(`/api/v1/projects/preview/${slug}`, {
				"X-Preview-Token": previewToken,
			});
		}
		return fetchApi<{ data: Project }>(`/api/v1/projects/${slug}`);
	},
};

export const githubApi = {
	async getActivity(): Promise<{ data: GitHubActivity }> {
		return fetchApi<{ data: GitHubActivity }>("/api/v1/github/activity");
	},
};

export const shareApi = {
	async getAll(page = 1): Promise<PaginatedResponse<ShareSummary>> {
		return fetchApi<PaginatedResponse<ShareSummary>>(
			`/api/v1/shares?page=${page}`,
		);
	},

	async getFeatured(): Promise<{ data: ShareSummary[] }> {
		return fetchApi<{ data: ShareSummary[] }>("/api/v1/shares/featured");
	},

	async getBySlug(slug: string): Promise<{ data: Share }> {
		return fetchApi<{ data: Share }>(`/api/v1/shares/${slug}`);
	},
};

export const chatApi = {
	streamChat(
		message: string,
		conversationId: string | null,
		signal?: AbortSignal,
	): Promise<Response> {
		return fetch(`${API_BASE_URL}/api/v1/chat`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ message, conversation_id: conversationId }),
			signal,
		});
	},
};

export const searchApi = {
	async search(
		query: string,
		type: SearchType = "all",
	): Promise<{ data: SearchResults }> {
		const params = new URLSearchParams({ q: query, type });
		return fetchApi<{ data: SearchResults }>(
			`/api/v1/search?${params.toString()}`,
		);
	},
};
