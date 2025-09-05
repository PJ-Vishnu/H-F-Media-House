import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Basic sanitizer to remove HTML tags.
export function sanitize(input: string): string {
    if(!input) return "";
    return input.replace(/<[^>]*>?/gm, '');
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj) return obj;
  const sanitizedObj = {} as T;
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      sanitizedObj[key] = sanitize(value) as any;
    } else if (typeof value === 'object' && value !== null) {
      sanitizedObj[key] = sanitizeObject(value);
    } else {
      sanitizedObj[key] = value;
    }
  }
  return sanitizedObj;
}

    