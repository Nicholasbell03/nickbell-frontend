import { useEffect, type RefObject } from 'react';
import { renderMermaid } from '@/lib/mermaid';

export function useMermaid(
  containerRef: RefObject<HTMLDivElement | null>,
  html: string,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !html) return;

    let cancelled = false;
    const timers: number[] = [];

    const run = () => {
      if (cancelled) return;
      renderMermaid(container).catch(() => {});
    };

    // Run immediately, then retry shortly after mount/update to cover
    // delayed DOM/content paint on first load and route transitions.
    run();
    timers.push(window.setTimeout(run, 120));
    timers.push(window.setTimeout(run, 400));

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [containerRef, html]);
}
