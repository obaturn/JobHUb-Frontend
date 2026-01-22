/**
 * Utility function to conditionally join class names
 * Similar to the popular 'clsx' library but lightweight
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility to merge Tailwind classes, handling conflicts
 * For now, this is a simple implementation - can be enhanced with tailwind-merge later
 */
export function mergeClasses(baseClasses: string, additionalClasses?: string): string {
  if (!additionalClasses) return baseClasses;
  return cn(baseClasses, additionalClasses);
}