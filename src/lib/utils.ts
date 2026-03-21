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
