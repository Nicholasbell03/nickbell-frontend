import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// TODO: Fetch BlogSummary[] from Blog API
interface BlogSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  read_time: number;
}

// TODO: Replace with API call - mock data for development
const mockPosts: BlogSummary[] = [
  {
    id: 1,
    title: 'Building Scalable APIs with Laravel',
    slug: 'building-scalable-apis-with-laravel',
    excerpt: 'Learn how to design and implement RESTful APIs that can handle millions of requests while maintaining clean architecture.',
    featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: 8,
  },
  {
    id: 2,
    title: 'React Server Components: A Deep Dive',
    slug: 'react-server-components-deep-dive',
    excerpt: 'Exploring the new React Server Components paradigm and how it changes the way we think about rendering.',
    featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: 12,
  },
  {
    id: 3,
    title: 'Integrating AI into Your Web Applications',
    slug: 'integrating-ai-into-web-applications',
    excerpt: 'A practical guide to adding AI capabilities to existing applications using modern APIs and best practices.',
    featured_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: 10,
  },
];

export function BlogPreview() {
  return (
    <section className="py-16 md:py-24 px-4 bg-background/50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Latest Thoughts</h2>
            <p className="text-muted-foreground text-lg">
              Insights on web development, AI integration, and software architecture
            </p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="group hidden sm:flex">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockPosts.map((post, index) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card
                className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-500/20 flex flex-col h-full cursor-pointer"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.read_time} min
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="text-sm text-emerald-400 group-hover:text-emerald-300 flex items-center gap-2">
                    Read More
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center sm:hidden">
          <Link to="/blog">
            <Button variant="outline" className="group">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
