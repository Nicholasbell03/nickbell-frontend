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
      <TechStack />
      <GitHubActivity />
      <ProjectsPreview />
      <BlogPreview />
      <SharesPreview />
    </>
  );
}
