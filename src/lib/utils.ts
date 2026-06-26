import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Conditional className merge helper used by all UI components. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
