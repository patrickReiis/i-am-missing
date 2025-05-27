import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import './polyfills'; // Import polyfills

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}