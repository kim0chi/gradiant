import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for conditionally joining Tailwind CSS classes
 *
 * This function combines clsx and tailwind-merge to provide a clean way
 * to conditionally apply Tailwind classes while properly handling conflicts
 *
 * @param {...ClassValue[]} inputs - Class values to be merged
 * @returns {string} - Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
