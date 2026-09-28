import sanitizeHtml from 'sanitize-html';

/**
 * Inline SVG diagram elements authors use in CMS content. Deliberately excludes
 * script, foreignObject (embeds arbitrary HTML), use/image (load external
 * resources via href), a (SVG links) and animate/set (can rewrite attributes
 * such as href at runtime).
 */
const SVG_TAGS = [
  'svg', 'g', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path',
  'text', 'tspan', 'title', 'desc', 'defs', 'linearGradient', 'radialGradient', 'stop', 'marker',
];

/** Geometry and presentation attributes only: no on* handlers, href or xlink:href. */
const SVG_ATTRIBUTES = [
  'viewBox', 'xmlns', 'width', 'height', 'role', 'aria-label', 'aria-hidden', 'preserveAspectRatio',
  'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'points', 'transform',
  'fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-linecap',
  'stroke-linejoin', 'stroke-opacity', 'opacity', 'text-anchor', 'dominant-baseline',
  'font-family', 'font-size', 'font-weight', 'letter-spacing', 'offset', 'stop-color', 'stop-opacity',
  'markerWidth', 'markerHeight', 'refX', 'refY', 'orient',
];

/** Sanitise trusted CMS HTML content. */
export function sanitizeCmsHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption', 'video', 'source', 'iframe'], SVG_TAGS),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      ...Object.fromEntries(SVG_TAGS.map((tag) => [tag, SVG_ATTRIBUTES])),
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'class'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow'],
      '*': ['class', 'id', 'style'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
    // SVG is case-sensitive (viewBox, linearGradient); the parser lowercases names by default.
    // Allowlist matching is case-sensitive too, so HTML tags must be authored in lower case.
    parser: { lowerCaseTags: false, lowerCaseAttributeNames: false },
  });
}
