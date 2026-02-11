import type { BlogSummary } from "./blog";
import type { ProjectSummary } from "./project";
import type { ShareSummary } from "./share";

export type SearchType = "all" | "blog" | "project" | "share";

export interface SearchResults {
	blogs?: BlogSummary[];
	projects?: ProjectSummary[];
	shares?: ShareSummary[];
}
