/**
 * Design System - Spacing Tokens
 * Consistent spacing values across the application
 */

export const SECTION_SPACING = {
  // Standard section padding
  small: 'py-12 md:py-16',
  medium: 'py-16 md:py-20', 
  large: 'py-16 md:py-24',
  xlarge: 'py-20 md:py-32',
} as const;

export const CONTAINER_SPACING = {
  // Container padding
  default: 'px-4 sm:px-6 lg:px-8',
  tight: 'px-4 sm:px-6',
  wide: 'px-4 sm:px-6 lg:px-12',
} as const;

export const ELEMENT_SPACING = {
  // Common element spacing
  xs: 'gap-2',
  sm: 'gap-4', 
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
  xxl: 'gap-16',
} as const;

export const GRID_SPACING = {
  // Grid gaps
  tight: 'gap-4 lg:gap-6',
  normal: 'gap-6 lg:gap-8', 
  wide: 'gap-8 lg:gap-12',
} as const;

// Helper function to get consistent spacing
export const getSpacing = {
  section: (size: keyof typeof SECTION_SPACING = 'large') => SECTION_SPACING[size],
  container: (size: keyof typeof CONTAINER_SPACING = 'default') => CONTAINER_SPACING[size],
  element: (size: keyof typeof ELEMENT_SPACING = 'md') => ELEMENT_SPACING[size],
  grid: (size: keyof typeof GRID_SPACING = 'normal') => GRID_SPACING[size],
};