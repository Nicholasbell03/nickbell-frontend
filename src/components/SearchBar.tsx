import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, X, FileText, Briefcase, Share2 } from "lucide-react";
import { useSearch } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import type { SearchType } from "@/types/search";
import type { BlogSummary } from "@/types/blog";
import type { ProjectSummary } from "@/types/project";
import type { ShareSummary } from "@/types/share";

const TABS: { label: string; value: SearchType }[] = [
	{ label: "All", value: "all" },
	{ label: "Blogs", value: "blog" },
	{ label: "Projects", value: "project" },
	{ label: "Shares", value: "share" },
];

function getDefaultTab(pathname: string): SearchType {
	if (pathname.startsWith("/blog")) return "blog";
	if (pathname.startsWith("/projects")) return "project";
	if (pathname.startsWith("/shares")) return "share";
	return "all";
}

const isMac =
	typeof navigator !== "undefined" && navigator.platform.includes("Mac");

function truncate(text: string | null, maxLength = 80): string {
	if (!text) return "";
	return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

interface SearchBarProps {
	mobile?: boolean;
	onNavigate?: () => void;
}

export function SearchBar({ mobile = false, onNavigate }: SearchBarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [activeTab, setActiveTab] = useState<SearchType>("all");
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const location = useLocation();

	const { data, isLoading } = useSearch(debouncedQuery, "all");
	const results = data?.data;

	const close = useCallback(() => {
		setIsOpen(false);
		setQuery("");
		setDebouncedQuery("");
	}, []);

	const handleNavigate = useCallback(
		(path: string) => {
			navigate(path);
			close();
			onNavigate?.();
		},
		[navigate, close, onNavigate],
	);

	// Debounce query (trim to prevent whitespace-only searches)
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
		return () => clearTimeout(timer);
	}, [query]);

	const open = useCallback(() => {
		setActiveTab(getDefaultTab(location.pathname));
		setIsOpen(true);
		setTimeout(() => inputRef.current?.focus(), 0);
	}, [location.pathname]);

	// Cmd+K / Ctrl+K shortcut
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				open();
			}
			if (e.key === "Escape" && isOpen) {
				close();
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, close, open]);

	// Click outside to close
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				close();
			}
		}
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			return () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [isOpen, close]);

	const blogCount = results?.blogs?.length ?? 0;
	const projectCount = results?.projects?.length ?? 0;
	const shareCount = results?.shares?.length ?? 0;

	function getTabCount(tab: SearchType): number {
		switch (tab) {
			case "all":
				return blogCount + projectCount + shareCount;
			case "blog":
				return blogCount;
			case "project":
				return projectCount;
			case "share":
				return shareCount;
		}
	}

	const showResults = isOpen && query.length >= 2;

	// Mobile: always show full-width input
	if (mobile) {
		return (
			<div ref={containerRef} className="relative w-full">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<input
						ref={inputRef}
						type="text"
						placeholder="Search..."
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							if (!isOpen) open();
						}}
						onFocus={() => {
							if (!isOpen) open();
						}}
						className="w-full pl-9 pr-9 py-2 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40"
					/>
					{query && (
						<button
							onClick={close}
							type="button"
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
				{showResults && (
					<ResultsDropdown
						query={query}
						results={results}
						isLoading={isLoading}
						activeTab={activeTab}
						onTabChange={setActiveTab}
						getTabCount={getTabCount}
						onNavigate={handleNavigate}
					/>
				)}
			</div>
		);
	}

	// Desktop: always-expanded search input
	return (
		<div ref={containerRef} className="relative w-full max-w-xs">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<input
					ref={inputRef}
					type="text"
					placeholder="Search..."
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						if (!isOpen) open();
					}}
					onFocus={() => {
						if (!isOpen) open();
					}}
					className="w-full pl-9 pr-9 py-1.5 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-sm lg:text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40"
				/>
				{query ? (
					<button
						onClick={close}
						type="button"
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						<X className="h-4 w-4" />
					</button>
				) : (
					<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground border border-emerald-500/20 rounded px-1.5 py-0.5 pointer-events-none">
						{isMac ? "\u2318K" : "Ctrl+K"}
					</span>
				)}
			</div>
			{showResults && (
				<ResultsDropdown
					query={query}
					results={results}
					isLoading={isLoading}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					getTabCount={getTabCount}
					onNavigate={handleNavigate}
				/>
			)}
		</div>
	);
}

interface ResultsDropdownProps {
	query: string;
	results:
		| {
				blogs?: BlogSummary[];
				projects?: ProjectSummary[];
				shares?: ShareSummary[];
		  }
		| undefined;
	isLoading: boolean;
	activeTab: SearchType;
	onTabChange: (tab: SearchType) => void;
	getTabCount: (tab: SearchType) => number;
	onNavigate: (path: string) => void;
}

function ResultsDropdown({
	query,
	results,
	isLoading,
	activeTab,
	onTabChange,
	getTabCount,
	onNavigate,
}: ResultsDropdownProps) {
	const visibleCount = getTabCount(activeTab);

	return (
		<div className="fixed top-[4.5rem] lg:top-[5rem] left-0 right-0 mx-auto w-full max-w-7xl px-4 z-50 md:w-3/4">
		<div className="rounded-lg border border-emerald-500/20 bg-background shadow-lg overflow-hidden">
			{/* Segmented control */}
			<div className="flex justify-end px-3 py-3 border-b border-emerald-500/20">
				<div className="inline-flex rounded-md bg-emerald-500/5 p-0.5">
					{TABS.map((tab) => {
						const count = getTabCount(tab.value);
						return (
							<button
								key={tab.value}
								onClick={() => onTabChange(tab.value)}
								type="button"
								className={cn(
									"flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded transition-all",
									activeTab === tab.value
										? "bg-emerald-500/20 text-emerald-400 shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{tab.label}
								{results && count > 0 && (
									<span className="bg-emerald-500/20 text-emerald-400 rounded-full px-1.5 py-0.5 text-[10px] leading-none">
										{count}
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Results */}
			<div className="max-h-[28rem] overflow-y-auto p-2">
				{isLoading ? (
					<div className="space-y-2 p-2">
						{[1, 2, 3].map((i) => (
							<div key={i} className="animate-pulse flex gap-3 items-center px-3 py-2">
								<div className="h-8 w-8 bg-emerald-500/10 rounded-lg shrink-0" />
								<div className="flex-1 space-y-1.5">
									<div className="h-3.5 bg-emerald-500/10 rounded w-3/4" />
									<div className="h-3 bg-emerald-500/10 rounded w-full" />
								</div>
							</div>
						))}
					</div>
				) : visibleCount === 0 ? (
					<div className="text-center py-6 space-y-2">
						<p className="text-sm text-muted-foreground">
							No {activeTab === "blog" ? "blogs" : activeTab === "project" ? "projects" : activeTab === "share" ? "shares" : "results"} found for &lsquo;{query}&rsquo;
						</p>
						{activeTab !== "all" && getTabCount("all") > 0 && (
							<button
								type="button"
								onClick={() => onTabChange("all")}
								className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
							>
								See all results ({getTabCount("all")})
							</button>
						)}
					</div>
				) : (
					<div className="space-y-1">
						{(activeTab === "all" || activeTab === "blog") &&
							results?.blogs?.map((blog) => (
								<ResultItem
									key={`blog-${blog.id}`}
									icon={<FileText className="h-4 w-4" />}
									title={blog.title}
									subtitle={truncate(blog.excerpt)}
									badge={`${blog.read_time} min read`}
									onClick={() => onNavigate(`/blog/${blog.slug}`)}
								/>
							))}
						{(activeTab === "all" || activeTab === "project") &&
							results?.projects?.map((project) => (
								<ResultItem
									key={`project-${project.id}`}
									icon={<Briefcase className="h-4 w-4" />}
									title={project.title}
									subtitle={truncate(project.description)}
									pills={project.technologies?.slice(0, 3)}
									onClick={() => onNavigate(`/projects/${project.slug}`)}
								/>
							))}
						{(activeTab === "all" || activeTab === "share") &&
							results?.shares?.map((share) => (
								<ResultItem
									key={`share-${share.id}`}
									icon={<Share2 className="h-4 w-4" />}
									title={share.title ?? "Untitled"}
									subtitle={truncate(share.description ?? share.commentary)}
									badge={share.source_type.replace("_", " ")}
									onClick={() => onNavigate(`/shares/${share.slug}`)}
								/>
							))}
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="flex items-center justify-end gap-3 px-3 py-1.5 border-t border-emerald-500/20 text-[10px] text-muted-foreground">
				<span>
					<kbd className="border border-emerald-500/20 rounded px-1 py-0.5">
						Esc
					</kbd>{" "}
					to close
				</span>
				<span>
					<kbd className="border border-emerald-500/20 rounded px-1 py-0.5">
						{isMac ? "\u2318K" : "Ctrl+K"}
					</kbd>{" "}
					to search
				</span>
			</div>
		</div>
		</div>
	);
}

interface ResultItemProps {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	badge?: string;
	pills?: string[];
	onClick: () => void;
}

function ResultItem({
	icon,
	title,
	subtitle,
	badge,
	pills,
	onClick,
}: ResultItemProps) {
	return (
		<button
			onClick={onClick}
			type="button"
			className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-emerald-500/10 transition-colors"
		>
			<span className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-emerald-500/15 text-emerald-400">
				{icon}
			</span>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-foreground truncate">
						{title}
					</span>
					{badge && (
						<span className="shrink-0 text-[10px] bg-emerald-500/15 text-emerald-400 rounded px-1.5 py-0.5">
							{badge}
						</span>
					)}
				</div>
				{subtitle && (
					<p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
						{subtitle}
					</p>
				)}
				{pills && pills.length > 0 && (
					<div className="flex gap-1 mt-1">
						{pills.map((pill) => (
							<span
								key={pill}
								className="text-[10px] bg-emerald-500/10 text-emerald-400/80 rounded px-1.5 py-0.5"
							>
								{pill}
							</span>
						))}
					</div>
				)}
			</div>
		</button>
	);
}
