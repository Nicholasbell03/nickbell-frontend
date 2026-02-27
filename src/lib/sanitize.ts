import DOMPurify from 'dompurify';

/**
 * DOMPurify config for trusted CMS content (blogs, project descriptions).
 * Extends the default allowlist with SVG elements and attributes needed
 * for inline architecture diagrams.
 */
const CMS_PURIFY_CONFIG = {
  ADD_TAGS: ['svg', 'path', 'line', 'rect', 'polygon', 'text', 'circle', 'ellipse', 'g', 'defs', 'clipPath', 'use'],
  ADD_ATTR: ['viewBox', 'xmlns', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'd', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'width', 'height', 'text-anchor', 'font-size', 'font-weight', 'points', 'transform', 'clip-path'],
};

/**
 * Escape the inner content of `<pre class="mermaid">` blocks so that tags
 * like `<br/>` (used by mermaid for line-breaks in labels) are preserved as
 * literal text instead of being parsed as HTML by the browser.  Mermaid reads
 * the element's `textContent`, so the browser's entity-decoding restores the
 * original characters before mermaid ever sees them.
 */
function escapeMermaidBlocks(html: string): string {
  return html.replace(
    /<pre class="mermaid">([\s\S]*?)<\/pre>/g,
    (_, content: string) => {
      const escaped = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `<pre class="mermaid">${escaped}</pre>`;
    },
  );
}

/**
 * Sanitise trusted CMS HTML content (with SVG support).
 */
export function sanitizeCmsHtml(html: string): string {
  const sanitized = DOMPurify.sanitize(html, CMS_PURIFY_CONFIG) as string;
  return escapeMermaidBlocks(sanitized);
}
