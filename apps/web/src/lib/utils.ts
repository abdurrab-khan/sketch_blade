import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

/**
 * Utility function to merge class names using clsx and twMerge.
 * @param inputs {ClassValue[]} - An array of class names or objects to be merged.
 * @returns {string} - A string representing the merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
