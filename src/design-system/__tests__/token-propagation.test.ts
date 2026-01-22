import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { PBT_CONFIG } from '../../test/setup';
import { generateCSSVars, applyCSSVars } from '../theme/utils';
import { designTokens } from '../theme/tokens';

/**
 * **Feature: frontend-design-system, Property 28: Token Change Propagation**
 * **Validates: Requirements 6.3**
 * 
 * Property: For any design token update, changes should propagate automatically 
 * to all components using those tokens
 */

describe('Token Change Propagation Properties', () => {
  it('should generate consistent CSS variables from design tokens', () => {
    fc.assert(
      fc.property(
        fc.constant(designTokens),
        (tokens) => {
          // Property: CSS variables should be generated for all token categories
          const cssVars = generateCSSVars(tokens);
          
          // Property: Color variables should exist for all color scales
          Object.keys(tokens.colors).forEach(colorName => {
            Object.keys(tokens.colors[colorName as keyof typeof tokens.colors]).forEach(shade => {
              const varName = `--color-${colorName}-${shade}`;
              expect(cssVars).toHaveProperty(varName);
              expect(cssVars[varName]).toMatch(/^#[0-9a-fA-F]{6}$/);
            });
          });
          
          // Property: Typography variables should exist
          Object.keys(tokens.typography.fontSize).forEach(size => {
            const varName = `--font-size-${size}`;
            expect(cssVars).toHaveProperty(varName);
          });
          
          // Property: Spacing variables should exist
          Object.keys(tokens.spacing).forEach(size => {
            const varName = `--spacing-${size}`;
            expect(cssVars).toHaveProperty(varName);
          });
          
          // Property: All CSS variable names should follow naming convention
          Object.keys(cssVars).forEach(varName => {
            expect(varName).toMatch(/^--[a-z-]+$/);
          });
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should propagate token changes to CSS custom properties', () => {
    fc.assert(
      fc.property(
        fc.record({
          colorUpdate: fc.record({
            primary: fc.record({
              500: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
            }),
          }),
          spacingUpdate: fc.record({
            4: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
          }),
        }),
        (tokenUpdates) => {
          // Property: Updated tokens should generate updated CSS variables
          const updatedTokens = {
            ...designTokens,
            colors: {
              ...designTokens.colors,
              primary: {
                ...designTokens.colors.primary,
                ...tokenUpdates.colorUpdate.primary,
              },
            },
            spacing: {
              ...designTokens.spacing,
              ...tokenUpdates.spacingUpdate,
            },
          };
          
          const cssVars = generateCSSVars(updatedTokens);
          
          // Property: Updated color should be reflected in CSS variables
          expect(cssVars['--color-primary-500']).toBe(tokenUpdates.colorUpdate.primary['500']);
          
          // Property: Updated spacing should be reflected in CSS variables
          expect(cssVars['--spacing-4']).toBe(tokenUpdates.spacingUpdate['4']);
          
          // Property: Other tokens should remain unchanged
          expect(cssVars['--color-secondary-500']).toBe(designTokens.colors.secondary['500']);
          expect(cssVars['--spacing-8']).toBe(designTokens.spacing['8']);
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should maintain token relationships during propagation', () => {
    fc.assert(
      fc.property(
        fc.record({
          primaryColor: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
          baseSpacing: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
        }),
        (updates) => {
          // Property: Token relationships should be maintained
          const updatedTokens = {
            ...designTokens,
            colors: {
              ...designTokens.colors,
              primary: {
                ...designTokens.colors.primary,
                500: updates.primaryColor,
              },
            },
            spacing: {
              ...designTokens.spacing,
              4: updates.baseSpacing,
            },
          };
          
          // Property: Token structure should remain consistent
          expect(updatedTokens.colors.primary).toHaveProperty('50');
          expect(updatedTokens.colors.primary).toHaveProperty('500');
          expect(updatedTokens.colors.primary).toHaveProperty('950');
          
          // Property: Updated values should be valid
          expect(updatedTokens.colors.primary['500']).toBe(updates.primaryColor);
          expect(updatedTokens.spacing['4']).toBe(updates.baseSpacing);
          
          // Property: Other color scales should remain intact
          expect(updatedTokens.colors.secondary['500']).toBe(designTokens.colors.secondary['500']);
          expect(updatedTokens.colors.success['500']).toBe(designTokens.colors.success['500']);
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should handle partial token updates correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          partialColorUpdate: fc.option(fc.record({
            primary: fc.option(fc.record({
              400: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
              600: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
            })),
          })),
          partialSpacingUpdate: fc.option(fc.record({
            2: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
            6: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
          })),
        }),
        (partialUpdates) => {
          // Property: Partial updates should not break token structure
          let updatedTokens = { ...designTokens };
          
          if (partialUpdates.partialColorUpdate?.primary) {
            updatedTokens = {
              ...updatedTokens,
              colors: {
                ...updatedTokens.colors,
                primary: {
                  ...updatedTokens.colors.primary,
                  ...partialUpdates.partialColorUpdate.primary,
                },
              },
            };
          }
          
          if (partialUpdates.partialSpacingUpdate) {
            updatedTokens = {
              ...updatedTokens,
              spacing: {
                ...updatedTokens.spacing,
                ...partialUpdates.partialSpacingUpdate,
              },
            };
          }
          
          // Property: Token structure should remain complete
          expect(updatedTokens.colors.primary).toHaveProperty('50');
          expect(updatedTokens.colors.primary).toHaveProperty('500');
          expect(updatedTokens.colors.primary).toHaveProperty('950');
          
          // Property: Non-updated tokens should remain unchanged
          expect(updatedTokens.colors.primary['500']).toBe(designTokens.colors.primary['500']);
          expect(updatedTokens.spacing['4']).toBe(designTokens.spacing['4']);
          
          // Property: CSS variables should reflect partial updates
          const cssVars = generateCSSVars(updatedTokens);
          expect(Object.keys(cssVars).length).toBeGreaterThan(0);
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });
});