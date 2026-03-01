export type SourceType = 'webpage' | 'youtube' | 'x_post' | 'linkedin';

export interface ShareSummary {
  id: number;
  url: string;
  source_type: SourceType;
  title: string | null;
  slug: string;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
  author: string | null;
  commentary: string | null;
  summary: string | null;
  created_at: string;
}

export interface Share extends ShareSummary {
  embed_data: {
    video_id?: string;
    tweet_id?: string;
  } | null;
}
