import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

// TODO: Fetch Blog by slug from Blog API
interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  meta_description: string;
  published_at: string;
  read_time: number;
}

// TODO: Replace with API call - mock data for development
const mockPosts: Record<string, Blog> = {
  'building-scalable-apis-with-laravel': {
    id: 1,
    title: 'Building Scalable APIs with Laravel',
    slug: 'building-scalable-apis-with-laravel',
    excerpt: 'Learn how to design and implement RESTful APIs that can handle millions of requests while maintaining clean architecture.',
    content: `Building APIs that can scale to handle millions of requests requires careful planning and implementation. In this post, I'll share the strategies and patterns I've learned from building production APIs with Laravel.

## API Design Principles

When designing a scalable API, several key principles should guide your decisions:

1. **Consistency** - Use consistent naming conventions, response formats, and error handling throughout your API.

2. **Versioning** - Always version your API from the start. It's much harder to add versioning later.

3. **Rate Limiting** - Implement rate limiting to protect your API from abuse and ensure fair usage.

## Database Optimization

One of the biggest bottlenecks in API performance is database queries. Here are some strategies:

- Use eager loading to avoid N+1 queries
- Add appropriate indexes based on your query patterns
- Consider using read replicas for heavy read workloads
- Implement query caching where appropriate

## Caching Strategies

Laravel provides excellent caching support. Use it wisely:

- Cache frequently accessed, rarely changed data
- Use cache tags for easy invalidation
- Consider using Redis for better performance
- Implement cache warming for critical data

## Conclusion

Building scalable APIs is an iterative process. Start with solid foundations, measure performance, and optimize based on real data.`,
    featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60',
    meta_description: 'Learn how to design and implement RESTful APIs that can handle millions of requests while maintaining clean architecture.',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: 8,
  },
  'react-server-components-deep-dive': {
    id: 2,
    title: 'React Server Components: A Deep Dive',
    slug: 'react-server-components-deep-dive',
    excerpt: 'Exploring the new React Server Components paradigm and how it changes the way we think about rendering.',
    content: `React Server Components represent a fundamental shift in how we build React applications. Let's explore what they are and how to use them effectively.

## What Are Server Components?

Server Components are React components that render exclusively on the server. They never ship JavaScript to the client, resulting in smaller bundles and faster page loads.

## Benefits of Server Components

1. **Zero Bundle Size Impact** - Server Components don't add to your JavaScript bundle.

2. **Direct Backend Access** - You can directly access databases, file systems, and other backend resources.

3. **Automatic Code Splitting** - Client Components are automatically code-split.

## When to Use Server vs Client Components

Use Server Components for:
- Fetching data
- Accessing backend resources
- Keeping sensitive information on the server

Use Client Components for:
- Interactivity and event listeners
- State and effects
- Browser-only APIs

## Conclusion

Server Components are a powerful addition to React. Understanding when to use them will help you build faster, more efficient applications.`,
    featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    meta_description: 'Exploring the new React Server Components paradigm and how it changes the way we think about rendering.',
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: 12,
  },
  'integrating-ai-into-web-applications': {
    id: 3,
    title: 'Integrating AI into Your Web Applications',
    slug: 'integrating-ai-into-web-applications',
    excerpt: 'A practical guide to adding AI capabilities to existing applications using modern APIs and best practices.',
    content: `AI integration is becoming increasingly accessible for web developers. This guide covers practical approaches to adding AI features to your applications.

## Getting Started with AI APIs

The easiest way to add AI capabilities is through APIs like OpenAI, Anthropic, or Google's Gemini. These provide powerful models without the need to train your own.

## Common Use Cases

1. **Content Generation** - Generate blog posts, product descriptions, or marketing copy.

2. **Chatbots** - Build intelligent conversational interfaces.

3. **Code Assistance** - Help developers with code completion and debugging.

4. **Data Analysis** - Extract insights from unstructured data.

## Best Practices

- Always validate and sanitize AI outputs
- Implement proper error handling
- Consider costs and rate limits
- Cache responses where appropriate
- Provide feedback mechanisms for users

## Conclusion

AI integration doesn't have to be complex. Start with simple use cases and iterate based on user feedback.`,
    featured_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60',
    meta_description: 'A practical guide to adding AI capabilities to existing applications using modern APIs and best practices.',
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    read_time: 10,
  },
};

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // TODO: Replace with actual API call
  const post = slug ? mockPosts[slug] : null;

  if (!post) {
    return (
      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
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
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.published_at), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.read_time} min read
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
          </div>

          <div className="border-t border-emerald-500/20 pt-8">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-500/20 pt-8 flex justify-between">
            <Link to="/blog">
              <Button variant="outline" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                All Posts
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
