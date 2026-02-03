import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github, Loader2, Eye } from 'lucide-react';
import { getPreviewToken } from '@/services/api';
import { useProject } from '@/hooks/useQueries';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const previewToken = getPreviewToken();
  const { data, isLoading, error } = useProject(slug, previewToken);
  const project = data?.data ?? null;

  if (isLoading) {
    return (
      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Failed to load project</h1>
          <p className="text-muted-foreground">{error.message}</p>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl font-bold">Project Not Found</h1>
          <p className="text-muted-foreground">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 px-4">
      {previewToken && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 py-2 px-4 text-center font-medium">
          <Eye className="inline-block h-4 w-4 mr-2" />
          Preview Mode — This content is not published
        </div>
      )}
      <div className={`container mx-auto max-w-4xl ${previewToken ? 'mt-8' : ''}`}>
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        <article className="space-y-8">
          {project.featured_image && (
            <div className="relative h-64 md:h-96 overflow-hidden rounded-lg bg-muted">
              <img
                src={project.featured_image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-sm px-3 py-1"
              >
                {tech}
              </Badge>
            ))}
          </div>

          {(project.project_url || project.github_url) && (
            <div className="flex gap-4">
              {project.project_url && (
                <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button variant="outline" asChild>
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View Code
                  </a>
                </Button>
              )}
            </div>
          )}

          {project.long_description && (
            <div className="prose prose-invert max-w-none">
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {project.long_description}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
