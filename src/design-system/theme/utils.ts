import { DesignTokens } from '../types';

/**
 * Utility functions for working with theme values
 */

/**
 * Get CSS custom property name for a design token
 */
export function getCSSVar(tokenPath: string): string {
  return `var(--${tokenPath.replace(/\./g, '-')})`;
}

/**
 * Generate CSS custom properties from design tokens
 */
export function generateCSSVars(tokens: DesignTokens): Record<string, string> {
  const vars: Record<string, string> = {};
  
  // Colors
  Object.entries(tokens.colors).forEach(([colorName, colorScale]) => {
    Object.entries(colorScale).forEach(([shade, value]) => {
      vars[`--color-${colorName}-${shade}`] = value;
    });
  });
  
  // Typography
  Object.entries(tokens.typography.fontSize).forEach(([size, value]) => {
    vars[`--font-size-${size}`] = value;
  });
  
  Object.entries(tokens.typography.fontWeight).forEach(([weight, value]) => {
    vars[`--font-weight-${weight}`] = value.toString();
  });
  
  Object.entries(tokens.typography.lineHeight).forEach(([height, value]) => {
    vars[`--line-height-${height}`] = value.toString();
  });
  
  // Spacing
  Object.entries(tokens.spacing).forEach(([size, value]) => {
    vars[`--spacing-${size}`] = value;
  });
  
  // Border radius
  Object.entries(tokens.borderRadius).forEach(([size, value]) => {
    vars[`--border-radius-${size}`] = value;
  });
  
  // Shadows
  Object.entries(tokens.shadows).forEach(([size, value]) => {
    vars[`--shadow-${size}`] = value;
  });
  
  return vars;
}

/**
 * Apply CSS custom properties to the document root
 */
export function applyCSSVars(tokens: DesignTokens): void {
  const vars = generateCSSVars(tokens);
  const root = document.documentElement;
  
  Object.entries(vars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

/**
 * Get a color value with opacity
 */
export function getColorWithOpacity(color: string, opacity: number): string {
  // Convert hex to rgb and add opacity
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // If it's already an rgb/rgba value, modify the opacity
  if (color.startsWith('rgb')) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity})`;
    }
  }
  
  return color;
}

/**
 * Create a theme variant with custom colors
 */
export function createThemeVariant(
  baseTokens: DesignTokens,
  customizations: Partial<DesignTokens>
): DesignTokens {
  return {
    ...baseTokens,
    ...customizations,
    colors: {
      ...baseTokens.colors,
      ...customizations.colors,
    },
    typography: {
      ...baseTokens.typography,
      ...customizations.typography,
    },
  };
}