export type ContentType = 'blog' | 'project' | 'share';

export interface UpNextItem {
  type: ContentType;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  published_at: string;
}

export interface RelatedItem {
  type: ContentType;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  published_at: string;
}

export interface RelatedContentResponse {
  data: {
    next: UpNextItem | null;
    related: RelatedItem[];
  };
}
