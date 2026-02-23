import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { contentTypeConfig, getItemPath } from '@/lib/contentType';
import type { UpNextItem } from '@/types/related';

export function UpNext({ item }: { item: UpNextItem }) {
  const config = contentTypeConfig[item.type];

  return (
    <Link to={getItemPath(item)}>
      <Button variant="outline" className="group" title={item.title}>
        Next {config.label}
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Link>
  );
}
