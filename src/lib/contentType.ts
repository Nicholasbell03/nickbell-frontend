import { FileText, Briefcase, Share2 } from 'lucide-react';
import type { ContentType, RelatedItem } from '@/types/related';

export const contentTypeConfig: Record<ContentType, { icon: typeof FileText; path: string; label: string }> = {
  blog: { icon: FileText, path: '/blog', label: 'Blog' },
  project: { icon: Briefcase, path: '/projects', label: 'Project' },
  share: { icon: Share2, path: '/shares', label: 'Share' },
};

export function getItemPath(item: Pick<RelatedItem, 'type' | 'slug'>): string {
  return `${contentTypeConfig[item.type].path}/${item.slug}`;
}
