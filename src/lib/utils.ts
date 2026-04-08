import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { decodeHTML } from 'entities';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html: string): string {
  return decodeHTML(html.replace(/<[^>]*>/g, ''));
}

export function safeHostname(url: string, fallback = 'Unknown source'): string {
  try {
    return new URL(url).hostname;
  } catch {
    return fallback;
  }
}

// X and LinkedIn both cap og:description around ~200 chars, so any value at or
// near that length is almost certainly truncated mid-content. Appending an
// ellipsis makes the downstream "Read full post on X" / "View on LinkedIn" CTA
// read as a continuation. False positives on exactly-at-threshold full posts
// are acceptable — the CTA still points to the authoritative source.
const OG_DESCRIPTION_TRUNCATION_THRESHOLD = 190;

export function withTruncationEllipsis(description: string | null | undefined): string {
  const text = description ?? '';
  if (text.length < OG_DESCRIPTION_TRUNCATION_THRESHOLD) return text;
  return `${text.trimEnd()}…`;
}
