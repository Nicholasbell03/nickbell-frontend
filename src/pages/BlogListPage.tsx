import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, ArrowRight, Loader2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { blogApi } from '@/services/api';
import type { BlogSummary } from '@/types/blog';

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    blogApi
      .getAll()
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
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
          <h1 className="text-2xl font-bold text-red-400">Failed to load posts</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">All Posts</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts on web development, AI integration, software architecture, and lessons learned from building real-world applications
          </p>
        </div>

        <div className="space-y-6">
          {posts.map((post, index) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card
                className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-500/20 cursor-pointer"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 lg:w-80 shrink-0">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                      />
                    ) : (
                      <div className="w-full h-48 md:h-full min-h-[160px] bg-slate-800/50 rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col items-center justify-center gap-3 border-r border-emerald-500/10">
                        <FileText className="h-10 w-10 text-emerald-500/40" />
                        <span className="text-xs text-muted-foreground/50 uppercase tracking-widest">Article</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.read_time} min
                      </div>
                    </div>
                    <CardTitle className="group-hover:text-emerald-400 transition-colors mb-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 mb-4">{post.excerpt}</CardDescription>
                    <div className="mt-auto text-sm text-emerald-400 group-hover:text-emerald-300 flex items-center gap-2">
                      Read More
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
