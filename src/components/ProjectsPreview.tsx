import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// TODO: Fetch from Projects API (backend TBD)
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  tech_stack: string[];
}

// TODO: Replace with API call - mock data for development
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    slug: 'e-commerce-platform',
    description: 'A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.',
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
    tech_stack: ['Laravel', 'React', 'PostgreSQL', 'Redis', 'Stripe'],
  },
  {
    id: '2',
    title: 'AI Content Generator',
    slug: 'ai-content-generator',
    description: 'An AI-powered content generation tool that helps marketers create engaging copy for various platforms.',
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    tech_stack: ['Next.js', 'OpenAI', 'TypeScript', 'Tailwind'],
  },
  {
    id: '3',
    title: 'Task Management System',
    slug: 'task-management-system',
    description: 'A collaborative task management application with real-time updates and team workspaces.',
    image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60',
    tech_stack: ['Vue.js', 'Laravel', 'WebSockets', 'MySQL'],
  },
];

export function ProjectsPreview() {
  return (
    <section id="projects" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
            <p className="text-muted-foreground text-lg">
              A selection of recent work showcasing expertise across full-stack development
            </p>
          </div>
          <Link to="/projects">
            <Button variant="outline" className="group hidden sm:flex">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockProjects.map((project, index) => (
            <Link key={project.id} to={`/projects/${project.slug}`}>
              <Card
                className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-500/20 overflow-hidden h-full cursor-pointer"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {project.image_url && (
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={project.image_url}
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
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        +{project.tech_stack.length - 4}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center sm:hidden">
          <Link to="/projects">
            <Button variant="outline" className="group">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
