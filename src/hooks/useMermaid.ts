import { useEffect, type RefObject } from 'react';

export function useMermaid(
  containerRef: RefObject<HTMLDivElement | null>,
  html: string,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = container.querySelectorAll<HTMLPreElement>('pre.mermaid');
    if (nodes.length === 0) return;

    let cancelled = false;

    import('mermaid')
      .then(({ default: mermaid }) => {
        if (cancelled) return;

        mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        mermaid.run({ nodes, suppressErrors: true });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [containerRef, html]);
}
