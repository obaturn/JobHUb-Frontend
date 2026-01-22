import { DesignTokens } from '../types';

/**
 * Utility functions for working with design tokens
 */

/**
 * Get a color value from the design tokens
 */
export function getColor(
  tokens: DesignTokens,
  color: keyof DesignTokens['colors'],
  shade: keyof DesignTokens['colors']['primary'] = '500'
): string {
  return tokens.colors[color][shade];
}

/**
 * Get a spacing value from the design tokens
 */
export function getSpacing(
  tokens: DesignTokens,
  size: keyof DesignTokens['spacing']
): string {
  return tokens.spacing[size];
}

/**
 * Get a font size value from the design tokens
 */
export function getFontSize(
  tokens: DesignTokens,
  size: keyof DesignTokens['typography']['fontSize']
): string {
  return tokens.typography.fontSize[size];
}

/**
 * Get a border radius value from the design tokens
 */
export function getBorderRadius(
  tokens: DesignTokens,
  size: keyof DesignTokens['borderRadius']
): string {
  return tokens.borderRadius[size];
}

/**
 * Get a shadow value from the design tokens
 */
export function getShadow(
  tokens: DesignTokens,
  size: keyof DesignTokens['shadows']
): string {
  return tokens.shadows[size];
}