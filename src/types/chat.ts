export interface ContentReference {
  type: "blog" | "project" | "share";
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  href: string;
  meta?: {
    read_time?: number;
    source_type?: string;
    technologies?: string[];
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  references?: ContentReference[];
}
