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
 * Sanitise trusted CMS HTML content (with SVG support).
 */
export function sanitizeCmsHtml(html: string): string {
  return DOMPurify.sanitize(html, CMS_PURIFY_CONFIG) as string;
}
