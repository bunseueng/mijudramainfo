import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeUrl(url: string | undefined): string {
  if (!url) return '#';
  
  try {
    const urlObj = new URL(url);
    // Only allow specific protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '#';
    }
    return urlObj.toString();
  } catch {
    return '#';
  }
}

export function isValidUrl(url: string | undefined): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}