export interface ProjectSummary {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  featured_image: string | null;
  project_url: string | null;
  github_url: string | null;
  technologies: string[];
  published_at: string;
}

export interface Project extends ProjectSummary {
  long_description: string | null;
}
