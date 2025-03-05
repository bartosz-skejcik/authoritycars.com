import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectToUrlParams(obj: Record<string, string>): string {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}
