import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes with clsx for conditional classes and conflict resolution.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a score with one decimal place.
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/**
 * Generates a random ID.
 */
export function generateId(prefix: string = 'ID'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}
