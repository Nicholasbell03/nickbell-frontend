import { Link } from 'react-router-dom';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Globe, Loader2 } from 'lucide-react';
import { FaYoutube, FaXTwitter } from 'react-icons/fa6';
import { formatDistanceToNow } from 'date-fns';
import { useShares } from '@/hooks/useQueries';
import type { SourceType } from '@/types/share';
import { safeHostname } from '@/lib/utils';

function SourceBadgeIcon({ type, className }: { type: SourceType; className?: string }) {
  switch (type) {
    case 'youtube':
      return <FaYoutube className={className} />;
    case 'x_post':
      return <FaXTwitter className={className} />;
    default:
      return <Globe className={className} />;
  }
}

function SourceBadge({ type }: { type: SourceType }) {
  const config = {
    webpage: { label: 'Web', icon: Globe },
    youtube: { label: 'YouTube', icon: FaYoutube },
    x_post: { label: 'X / Twitter', icon: FaXTwitter },
  }[type];

  const Icon = config.icon;

  return (
    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function SharesListPage() {
  const { data, isLoading, error } = useShares();
  const shares = data?.data ?? [];

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
            <Link key={share.id} to={`/shares/${share.slug}`}>
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
                      <SourceBadgeIcon type={share.source_type} className="h-14 w-14 text-emerald-800" />
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
                  {share.commentary && (
                    <CardDescription className="line-clamp-3 mb-4">{share.commentary.replace(/<[^>]*>/g, '')}</CardDescription>
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
      </div>
    </div>
  );
}
