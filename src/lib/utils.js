import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// FIXME find out whatever this is

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
