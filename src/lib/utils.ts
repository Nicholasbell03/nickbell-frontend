import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeHostname(url: string, fallback = 'Unknown source'): string {
  try {
    return new URL(url).hostname;
  } catch {
    return fallback;
  }
}
