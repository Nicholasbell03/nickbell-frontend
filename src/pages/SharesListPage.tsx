import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/ui/pagination';
import { ArrowRight, Globe, Loader2 } from 'lucide-react';
import { FaYoutube, FaXTwitter, FaLinkedin } from 'react-icons/fa6';
import { formatDistanceToNow } from 'date-fns';
import { useShares } from '@/hooks/useQueries';
import type { SourceType } from '@/types/share';
import { safeHostname, stripHtml } from '@/lib/utils';
import { SourceIcon } from '@/components/SourceIcon';

const SOURCE_BADGE_CONFIG: Record<SourceType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  webpage: { label: 'Web', icon: Globe },
  youtube: { label: 'YouTube', icon: FaYoutube },
  x_post: { label: 'X / Twitter', icon: FaXTwitter },
  linkedin: { label: 'LinkedIn', icon: FaLinkedin },
};

function SourceBadge({ type }: { type: SourceType }) {
  const config = SOURCE_BADGE_CONFIG[type];
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function SharesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const { data, isLoading, error } = useShares(page);
  const shares = data?.data ?? [];
  const meta = data?.meta;

  function handlePageChange(newPage: number) {
    setSearchParams(newPage > 1 ? { page: String(newPage) } : {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
          <h1 className="text-2xl font-bold text-red-400">Failed to load shares</h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">Shares</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Curated links, videos, and posts worth sharing — with personal commentary
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shares.map((share, index) => (
            <Link key={share.id} to={`/shares/${share.slug}`} className="block">
              <Card
                className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-500/20 overflow-hidden h-full cursor-pointer flex flex-col"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="relative h-40 overflow-hidden bg-muted">
                  {share.image_url ? (
                    <img
                      src={share.image_url}
                      alt={share.title ?? ''}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center">
                      <SourceIcon type={share.source_type} className="h-14 w-14 text-emerald-800" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <SourceBadge type={share.source_type} />
                    {share.author && (
                      <span className="text-sm text-muted-foreground">{share.author}</span>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-emerald-400 transition-colors mb-2">
                    {share.title ?? safeHostname(share.url)}
                  </CardTitle>
                  {(share.summary || share.commentary) && (
                    <CardDescription className={share.summary ? "mb-4" : "line-clamp-3 mb-4"}>{share.summary ?? stripHtml(share.commentary!)}</CardDescription>
                  )}
                  <div className="mt-auto flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(share.created_at), { addSuffix: true })}
                    </span>
                    <span className="text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                      View
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {meta && (
          <Pagination
            currentPage={meta.current_page}
            lastPage={meta.last_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
