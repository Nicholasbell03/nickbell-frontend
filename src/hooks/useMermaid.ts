import { useEffect, type RefObject } from 'react';
import { renderMermaid } from '@/lib/mermaid';

export function useMermaid(
  containerRef: RefObject<HTMLDivElement | null>,
  html: string,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !html) return;

    renderMermaid(container).catch((err) => {
      console.error('Mermaid init failed:', err);
    });
  }, [containerRef, html]);
}
