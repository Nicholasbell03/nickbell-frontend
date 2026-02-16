import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useProjects } from '@/hooks/useQueries';

export function ProjectsListPage() {
  const { data, isLoading, error } = useProjects();
  const projects = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Failed to load projects</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">All Projects</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive collection of my work across full-stack development, AI integration, and cloud architecture
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link key={project.id} to={`/projects/${project.slug}`} className="block">
              <Card
                className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-500/20 overflow-hidden h-full cursor-pointer"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {project.featured_image && (
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={project.featured_image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
