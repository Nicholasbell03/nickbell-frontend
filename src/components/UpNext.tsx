import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { contentTypeConfig, getItemPath } from '@/lib/contentType';
import type { UpNextItem } from '@/types/related';

export function UpNext({ item }: { item: UpNextItem }) {
  const config = contentTypeConfig[item.type];
  const Icon = config.icon;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Up Next
      </h3>
      <Link
        to={getItemPath(item)}
        className="group flex items-center gap-4 p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all"
      >
        <Icon className="h-5 w-5 text-emerald-400 shrink-0" />
        <span className="font-medium group-hover:text-emerald-400 transition-colors line-clamp-1 flex-1">
          {item.title}
        </span>
        <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
