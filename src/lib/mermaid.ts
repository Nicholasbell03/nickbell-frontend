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

const SPINNER_HTML = `<div class="flex items-center justify-center py-8 text-emerald-500 animate-pulse">
  <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  <span class="text-sm font-medium">Rendering diagram...</span>
</div>`;

const ERROR_HTML = `<div class="p-4 border border-red-500/20 bg-red-500/10 text-red-400 rounded-md text-sm">Failed to render diagram.</div>`;

let renderQueue = Promise.resolve();
let nextId = 0;

export async function renderMermaid(container: HTMLElement) {
  // 1. Claim nodes synchronously to prevent double processing, even while mermaid is downloading
  const nodes = Array.from(container.querySelectorAll<HTMLElement>('pre.mermaid:not([data-processed])'));
  if (nodes.length === 0) return renderQueue;

  const toRender: { node: HTMLElement; id: string; text: string }[] = [];

  nodes.forEach((node) => {
    node.setAttribute('data-processed', 'true');
    const text = node.textContent || '';
    const id = `mermaid-${nextId++}`;
    toRender.push({ node, id, text });

    // Show loading state immediately to prevent "blank space" flash
    node.innerHTML = SPINNER_HTML;
  });

  // 2. Fetch/await mermaid asynchronously
  const mermaid = await getMermaid();

  // 3. Queue the rendering to ensure we don't overwhelm the browser or overlap
  renderQueue = renderQueue.then(async () => {
    for (const { node, id, text } of toRender) {
      try {
        const { svg, bindFunctions } = await mermaid.render(id, text);
        node.innerHTML = svg;
        bindFunctions?.(node);
      } catch (err) {
        console.error('Mermaid render failed for node:', err);
        node.innerHTML = ERROR_HTML;
      }
    }
  });

  return renderQueue;
}

export function preloadMermaid() {
  getMermaid().catch(() => {});
}
