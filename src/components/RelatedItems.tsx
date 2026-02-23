import { Link } from 'react-router-dom';
import { FileText, Briefcase, Share2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ContentType, RelatedItem } from '@/types/related';

const typeConfig: Record<ContentType, { icon: typeof FileText; path: string; label: string }> = {
  blog: { icon: FileText, path: '/blog', label: 'Blog' },
  project: { icon: Briefcase, path: '/projects', label: 'Project' },
  share: { icon: Share2, path: '/shares', label: 'Share' },
};

function getItemPath(item: RelatedItem): string {
  return `${typeConfig[item.type].path}/${item.slug}`;
}

export function RelatedItems({ items }: { items: RelatedItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        You might also like
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;

          return (
            <Link key={`${item.type}-${item.slug}`} to={getItemPath(item)}>
              <Card
                className="group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border-emerald-500/20 overflow-hidden h-full cursor-pointer flex flex-col"
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="relative h-32 overflow-hidden bg-muted">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center">
                      <Icon className="h-10 w-10 text-emerald-800" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <Badge className="absolute top-2 right-2 bg-background/80 text-emerald-400 border-emerald-500/20 text-xs">
                    {config.label}
                  </Badge>
                </div>
                <CardHeader className="flex-1">
                  <CardTitle className="text-sm group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>
                  {item.description && (
                    <CardDescription className="line-clamp-2 text-xs">
                      {item.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
