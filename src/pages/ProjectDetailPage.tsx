import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';

// TODO: Fetch project by slug from API (backend TBD)
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  image_url: string;
  project_url: string | null;
  github_url: string | null;
  tech_stack: string[];
}

// TODO: Replace with API call - mock data for development
const mockProjects: Record<string, Project> = {
  'e-commerce-platform': {
    id: '1',
    title: 'E-Commerce Platform',
    slug: 'e-commerce-platform',
    description: 'A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.',
    long_description: `This e-commerce platform was built to handle high-traffic online stores with complex inventory requirements.

Key Features:
- Real-time inventory synchronization across multiple warehouses
- Integrated payment processing with Stripe and PayPal
- Advanced admin dashboard with sales analytics
- Multi-currency and multi-language support
- Automated email marketing integration

The architecture uses Laravel for the backend API, React for the frontend, and Redis for caching and real-time updates. PostgreSQL handles the relational data while Elasticsearch powers the product search functionality.

Performance optimizations include lazy loading, image optimization, and CDN integration, resulting in sub-second page loads even under heavy traffic.`,
    image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=60',
    project_url: 'https://example.com',
    github_url: 'https://github.com/Nicholasbell03',
    tech_stack: ['Laravel', 'React', 'PostgreSQL', 'Redis', 'Stripe', 'Elasticsearch'],
  },
  'ai-content-generator': {
    id: '2',
    title: 'AI Content Generator',
    slug: 'ai-content-generator',
    description: 'An AI-powered content generation tool that helps marketers create engaging copy for various platforms.',
    long_description: `An intelligent content generation platform that leverages OpenAI's GPT models to help marketers create compelling copy.

Key Features:
- Multiple content templates (blog posts, social media, ads, emails)
- Brand voice customization and tone adjustment
- SEO optimization suggestions
- Content history and version control
- Team collaboration features

The application uses Next.js for server-side rendering and optimal SEO, with a custom prompt engineering system that ensures consistent, high-quality outputs tailored to each user's brand guidelines.`,
    image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    project_url: 'https://example.com',
    github_url: null,
    tech_stack: ['Next.js', 'OpenAI', 'TypeScript', 'Tailwind', 'Prisma'],
  },
  'task-management-system': {
    id: '3',
    title: 'Task Management System',
    slug: 'task-management-system',
    description: 'A collaborative task management application with real-time updates and team workspaces.',
    long_description: `A modern task management solution designed for remote teams that need real-time collaboration.

Key Features:
- Kanban boards with drag-and-drop functionality
- Real-time updates using WebSockets
- Team workspaces with role-based permissions
- Time tracking and reporting
- Integration with Slack and email

Built with Vue.js for a reactive frontend experience and Laravel for a robust backend API. WebSockets provide instant updates across all connected clients, ensuring team members always see the latest changes.`,
    image_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60',
    project_url: null,
    github_url: 'https://github.com/Nicholasbell03',
    tech_stack: ['Vue.js', 'Laravel', 'WebSockets', 'MySQL', 'Redis'],
  },
};

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // TODO: Replace with actual API call
  const project = slug ? mockProjects[slug] : null;

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
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        <article className="space-y-8">
          {project.image_url && (
            <div className="relative h-64 md:h-96 overflow-hidden rounded-lg bg-muted">
              <img
                src={project.image_url}
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
            {project.tech_stack.map((tech) => (
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

          <div className="prose prose-invert max-w-none">
            <div className="text-lg leading-relaxed whitespace-pre-wrap">
              {project.long_description}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
