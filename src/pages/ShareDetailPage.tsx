import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Globe, Loader2 } from 'lucide-react';
import { FaYoutube, FaXTwitter } from 'react-icons/fa6';
import { format } from 'date-fns';
import { useShare } from '@/hooks/useQueries';
import type { SourceType } from '@/types/share';
import { safeHostname } from '@/lib/utils';

function SourceIcon({ type, className }: { type: SourceType; className?: string }) {
  switch (type) {
    case 'youtube':
      return <FaYoutube className={className} />;
    case 'x_post':
      return <FaXTwitter className={className} />;
    default:
      return <Globe className={className} />;
  }
}

export function ShareDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useShare(slug);
  const share = data?.data ?? null;

  const sanitizedCommentary = useMemo(
    () => share?.commentary ? DOMPurify.sanitize(share.commentary) : '',
    [share],
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
          <h1 className="text-2xl font-bold text-red-400">Failed to load share</h1>
          <p className="text-muted-foreground">{error.message}</p>
          <Link to="/shares">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shares
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl font-bold">Share Not Found</h1>
          <p className="text-muted-foreground">
            The share you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shares">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shares
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
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <SourceIcon type={share.source_type} className="h-4 w-4 text-emerald-400" />
              {share.site_name && <span>{share.site_name}</span>}
              <span>{format(new Date(share.created_at), 'MMMM d, yyyy')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {share.title ?? safeHostname(share.url)}
            </h1>
          </div>

          {/* Commentary */}
          {sanitizedCommentary && (
            <div className="border-t border-emerald-500/20 pt-8">
              <h2 className="text-lg font-semibold mb-4 text-emerald-400">My Thoughts</h2>
              <div
                className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: sanitizedCommentary }}
              />
            </div>
          )}

          {/* Source-specific embed */}
          {share.source_type === 'youtube' && share.embed_data?.video_id && (
            <div className="aspect-video rounded-lg overflow-hidden border border-emerald-500/20">
              <iframe
                src={`https://www.youtube.com/embed/${share.embed_data.video_id}`}
                title={share.title ?? 'YouTube video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}

          {(share.source_type === 'x_post' || share.source_type === 'webpage') && share.image_url && (
            <a
              href={share.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden border border-emerald-500/20 hover:border-emerald-500/40 transition-colors group"
            >
              <img
                src={share.image_url}
                alt={share.title ?? ''}
                className="w-full max-h-96 object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
            </a>
          )}

          {share.description && (
            <p className="text-xl text-muted-foreground">{share.description}</p>
          )}

          <div className="border-t border-emerald-500/20 pt-8 flex flex-wrap gap-4 justify-between">
            <Link to="/shares">
              <Button variant="outline" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                All Shares
              </Button>
            </Link>
            <a href={share.url} target="_blank" rel="noopener noreferrer">
              <Button className="bg-emerald-600 hover:bg-emerald-700 group">
                Visit Original
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
