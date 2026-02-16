import { HeroSection } from "@/components/HeroSection";
import { TechStack } from "@/components/TechStack";
import { GitHubActivity } from "@/components/GitHubActivity";
import { BlogPreview } from "@/components/BlogPreview";
import { ProjectsPreview } from "@/components/ProjectsPreview";
import { SharesPreview } from "@/components/SharesPreview";
import { useFadeInOnScroll } from "@/hooks/useFadeInOnScroll";

export function HomePage() {
	const [techRowRef, techRowFade] = useFadeInOnScroll();

	return (
		<>
			<HeroSection />
			<section className="py-8 md:py-14 px-4">
				<div className="container mx-auto max-w-7xl">
					<div
						ref={techRowRef}
						className={`grid md:grid-cols-3 gap-6 ${techRowFade}`}
					>
						<GitHubActivity />
						<TechStack />
					</div>
				</div>
			</section>
			<ProjectsPreview />
			<BlogPreview />
			<SharesPreview />
		</>
	);
}
