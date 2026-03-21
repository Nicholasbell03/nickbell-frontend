import DOMPurify from 'isomorphic-dompurify';

/** Sanitise trusted CMS HTML content. */
export function sanitizeCmsHtml(html: string): string {
  return DOMPurify.sanitize(html) as string;
}
