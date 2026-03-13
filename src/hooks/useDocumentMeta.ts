import { useEffect } from 'react';

export function useDocumentMeta({ title, description }: { title?: string | null; description?: string | null }) {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') ?? '';

    document.title = title ? `${title} | Nicholas Bell` : prevTitle;

    if (meta) {
      meta.setAttribute('content', description ?? prevDescription);
    }

    return () => {
      document.title = prevTitle;
      if (meta) {
        meta.setAttribute('content', prevDescription);
      }
    };
  }, [title, description]);
}
