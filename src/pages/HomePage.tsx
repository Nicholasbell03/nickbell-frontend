import { HeroSection } from '@/components/HeroSection';
import { TechStack } from '@/components/TechStack';
import { BlogPreview } from '@/components/BlogPreview';
import { ProjectsPreview } from '@/components/ProjectsPreview';
import { SharesPreview } from '@/components/SharesPreview';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TechStack />
      <ProjectsPreview />
      <BlogPreview />
      <SharesPreview />
    </>
  );
}
