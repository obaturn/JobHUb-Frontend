import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { PBT_CONFIG } from '../../test/setup';
import { designTokens } from '../theme/tokens';
import { getColor, getSpacing, getFontSize, getBorderRadius, getShadow } from '../utils/tokens';

/**
 * **Feature: frontend-design-system, Property 26: Design Token Usage Enforcement**
 * **Validates: Requirements 6.1**
 * 
 * Property: For any design element, only standardized design tokens should be used 
 * for colors, typography, and spacing
 */

describe('Design Token Usage Enforcement Properties', () => {
  it('should enforce valid color token usage', () => {
    fc.assert(
      fc.property(
        fc.record({
          colorName: fc.constantFrom('primary', 'secondary', 'neutral', 'success', 'warning', 'error'),
          shade: fc.constantFrom('50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'),
        }),
        (colorToken) => {
          // Property: All color tokens should exist in the design system
          const colorValue = getColor(designTokens, colorToken.colorName as any, colorToken.shade as any);
          
          // Property: Color values should be valid hex colors
          expect(colorValue).toMatch(/^#[0-9a-fA-F]{6}$/);
          
          // Property: Color tokens should be accessible from design tokens
          expect(designTokens.colors[colorToken.colorName as keyof typeof designTokens.colors]).toBeDefined();
          expect(designTokens.colors[colorToken.colorName as keyof typeof designTokens.colors][colorToken.shade as keyof typeof designTokens.colors.primary]).toBeDefined();
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should enforce valid spacing token usage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'),
        (spacingKey) => {
          // Property: All spacing tokens should exist and return valid CSS values
          const spacingValue = getSpacing(designTokens, spacingKey as keyof typeof designTokens.spacing);
          
          // Property: Spacing values should be valid CSS units (rem, px, or 0)
          expect(spacingValue).toMatch(/^(0|[\d.]+rem|[\d.]+px)$/);
          
          // Property: Spacing tokens should be accessible from design tokens
          expect(designTokens.spacing[spacingKey as keyof typeof designTokens.spacing]).toBeDefined();
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should enforce valid typography token usage', () => {
    fc.assert(
      fc.property(
        fc.record({
          fontSize: fc.constantFrom('xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'),
          fontWeight: fc.constantFrom('normal', 'medium', 'semibold', 'bold'),
          lineHeight: fc.constantFrom('tight', 'snug', 'normal', 'relaxed', 'loose'),
        }),
        (typographyToken) => {
          // Property: All typography tokens should exist and return valid values
          const fontSizeValue = getFontSize(designTokens, typographyToken.fontSize as keyof typeof designTokens.typography.fontSize);
          const fontWeightValue = designTokens.typography.fontWeight[typographyToken.fontWeight as keyof typeof designTokens.typography.fontWeight];
          const lineHeightValue = designTokens.typography.lineHeight[typographyToken.lineHeight as keyof typeof designTokens.typography.lineHeight];
          
          // Property: Font size should be valid CSS unit
          expect(fontSizeValue).toMatch(/^[\d.]+rem$/);
          
          // Property: Font weight should be a valid number
          expect(typeof fontWeightValue).toBe('number');
          expect(fontWeightValue).toBeGreaterThanOrEqual(100);
          expect(fontWeightValue).toBeLessThanOrEqual(900);
          
          // Property: Line height should be a valid number
          expect(typeof lineHeightValue).toBe('number');
          expect(lineHeightValue).toBeGreaterThan(0);
          expect(lineHeightValue).toBeLessThanOrEqual(3);
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should enforce valid border radius token usage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('none', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', 'full'),
        (radiusKey) => {
          // Property: All border radius tokens should exist and return valid CSS values
          const radiusValue = getBorderRadius(designTokens, radiusKey as keyof typeof designTokens.borderRadius);
          
          // Property: Border radius values should be valid CSS units
          expect(radiusValue).toMatch(/^(0|[\d.]+rem|9999px)$/);
          
          // Property: Border radius tokens should be accessible from design tokens
          expect(designTokens.borderRadius[radiusKey as keyof typeof designTokens.borderRadius]).toBeDefined();
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should enforce valid shadow token usage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('sm', 'base', 'md', 'lg', 'xl', '2xl', 'inner', 'none'),
        (shadowKey) => {
          // Property: All shadow tokens should exist and return valid CSS values
          const shadowValue = getShadow(designTokens, shadowKey as keyof typeof designTokens.shadows);
          
          // Property: Shadow values should be valid CSS shadow syntax or 'none'
          if (shadowValue === 'none' || shadowValue === '0 0 #0000') {
            expect(shadowValue).toMatch(/^(none|0 0 #0000)$/);
          } else if (shadowValue.includes('inset')) {
            expect(shadowValue).toMatch(/^inset/);
          } else {
            expect(shadowValue).toMatch(/^\d+/); // Should start with a number
          }
          
          // Property: Shadow tokens should be accessible from design tokens
          expect(designTokens.shadows[shadowKey as keyof typeof designTokens.shadows]).toBeDefined();
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should enforce consistent token structure', () => {
    fc.assert(
      fc.property(
        fc.constant(designTokens),
        (tokens) => {
          // Property: Design tokens should have consistent structure
          expect(tokens).toHaveProperty('colors');
          expect(tokens).toHaveProperty('typography');
          expect(tokens).toHaveProperty('spacing');
          expect(tokens).toHaveProperty('borderRadius');
          expect(tokens).toHaveProperty('shadows');
          expect(tokens).toHaveProperty('breakpoints');
          
          // Property: Color scales should be consistent
          Object.values(tokens.colors).forEach(colorScale => {
            expect(colorScale).toHaveProperty('50');
            expect(colorScale).toHaveProperty('500'); // Main color
            expect(colorScale).toHaveProperty('950');
          });
          
          // Property: Typography should have required properties
          expect(tokens.typography).toHaveProperty('fontFamily');
          expect(tokens.typography).toHaveProperty('fontSize');
          expect(tokens.typography).toHaveProperty('fontWeight');
          expect(tokens.typography).toHaveProperty('lineHeight');
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });
});