import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isAdmin(email: string): boolean {
  if (!email) return false;
  
  // Iterate over environment variables to find admin emails
  for (const key in process.env) {
    if (key.startsWith('ADMIN_EMAIL_ID')) {
      if (process.env[key] === email) {
        return true;
      }
    }
  }
  return false;
}