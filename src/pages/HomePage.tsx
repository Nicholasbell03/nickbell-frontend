import { HeroSection } from '@/components/HeroSection';
import { TechStack } from '@/components/TechStack';
import { GitHubActivity } from '@/components/GitHubActivity';
import { BlogPreview } from '@/components/BlogPreview';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import { SharesPreview } from '@/components/SharesPreview';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-6">
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
