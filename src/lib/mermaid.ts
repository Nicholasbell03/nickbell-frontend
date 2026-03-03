import type Mermaid from 'mermaid';

let initPromise: Promise<typeof Mermaid> | null = null;

function getMermaid() {
  if (!initPromise) {
    initPromise = import('mermaid')
      .then(({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        return mermaid;
      })
      .catch((err) => {
        initPromise = null;
        throw err;
      });
  }
  return initPromise;
}

let renderQueue = Promise.resolve();

export async function renderMermaid(container: HTMLElement) {
  const mermaid = await getMermaid();

  renderQueue = renderQueue.then(async () => {
    const nodes = container.querySelectorAll<HTMLElement>('pre.mermaid:not([data-processed])');
    if (nodes.length === 0) return;
    await mermaid.run({ nodes, suppressErrors: true });
  });

  return renderQueue;
}

export function preloadMermaid() {
  getMermaid().catch(() => {});
}
