import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

export function safeHostname(url: string, fallback = 'Unknown source'): string {
  try {
    return new URL(url).hostname;
  } catch {
    return fallback;
  }
}
