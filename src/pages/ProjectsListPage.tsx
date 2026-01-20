import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  {
    id: '4',
    title: 'Analytics Dashboard',
    slug: 'analytics-dashboard',
    description: 'A comprehensive analytics dashboard for tracking business metrics and generating reports.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
    tech_stack: ['React', 'D3.js', 'Node.js', 'MongoDB'],
  },
  {
    id: '5',
    title: 'Social Media Scheduler',
    slug: 'social-media-scheduler',
    description: 'A tool for scheduling and managing social media posts across multiple platforms.',
    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60',
    tech_stack: ['Laravel', 'Vue.js', 'Redis', 'PostgreSQL'],
  },
  {
    id: '6',
    title: 'Real Estate Platform',
    slug: 'real-estate-platform',
    description: 'A property listing and management platform with virtual tours and appointment scheduling.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60',
    tech_stack: ['React', 'Laravel', 'AWS', 'PostgreSQL'],
  },
];

export function ProjectsListPage() {
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
                    {project.tech_stack.map((tech) => (
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
