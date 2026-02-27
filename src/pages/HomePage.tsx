import { useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { TechStack } from "@/components/TechStack";
import { GitHubActivity } from "@/components/GitHubActivity";
import { BlogPreview } from "@/components/BlogPreview";
import { ProjectsPreview } from "@/components/ProjectsPreview";
import { SharesPreview } from "@/components/SharesPreview";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

export function HomePage() {
	// Preload mermaid in the background so it's cached before users navigate to
	// project/blog pages with diagrams.
	useEffect(() => {
		import("mermaid").catch(() => {});
	}, []);
	const [githubRef, githubFade] = useFadeInOnScroll();
	const [techRef, techFade] = useFadeInOnScroll();

	return (
		<>
			<HeroSection />
			<section className="py-8 md:py-14 px-4">
				<div className="container mx-auto max-w-7xl">
					<div className="grid md:grid-cols-3 gap-6">
						<div ref={githubRef} className={githubFade}>
							<GitHubActivity />
						</div>
						<div
							ref={techRef}
							className={`md:col-span-2 ${techFade}`}
						>
							<TechStack />
						</div>
					</div>
				</div>
			</section>
			<ProjectsPreview />
			<BlogPreview />
			<SharesPreview />
		</>
	);
}
