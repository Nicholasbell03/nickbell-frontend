import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Loader2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { getPreviewToken } from '@/services/api';
import { useBlog, useRelatedContent } from '@/hooks/useQueries';
import { sanitizeCmsHtml } from '@/lib/sanitize';
import { UpNext } from '@/components/UpNext';
import { RelatedItems } from '@/components/RelatedItems';

export function BlogPostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const previewToken = getPreviewToken();
  const { data, isLoading, error } = useBlog(slug, previewToken);
  const { data: relatedData } = useRelatedContent('blog', slug);
  const post = data?.data ?? null;

  const sanitizedContent = useMemo(
    () => post?.content ? sanitizeCmsHtml(post.content) : '',
    [post],
  );

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
          <h1 className="text-2xl font-bold text-red-400">Failed to load post</h1>
          <p className="text-muted-foreground">{error.message}</p>
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

          {post.featured_image && (
            <div className="rounded-lg overflow-hidden border border-emerald-500/20">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full max-h-[400px] object-contain"
              />
            </div>
          )}

          <div className="border-t border-emerald-500/20 pt-8">
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-a:text-emerald-400 prose-a:no-underline prose-a:hover:underline prose-strong:text-foreground prose-code:text-emerald-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-emerald-500/20 prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>

          {relatedData?.data.next && (
            <div className="border-t border-emerald-500/20 pt-8">
              <UpNext item={relatedData.data.next} />
            </div>
          )}

          {relatedData?.data.related && relatedData.data.related.length > 0 && (
            <div className="border-t border-emerald-500/20 pt-8">
              <RelatedItems items={relatedData.data.related} />
            </div>
          )}

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
