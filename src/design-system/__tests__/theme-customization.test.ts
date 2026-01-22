import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { PBT_CONFIG } from '../../test/setup';
import { designTokens } from '../theme/tokens';
import { createThemeVariant } from '../theme/utils';

/**
 * **Feature: frontend-design-system, Property 30: Theme Customization Support**
 * **Validates: Requirements 6.5**
 * 
 * Property: For any custom theme requirement, the system should support 
 * theme extensions and overrides
 */

describe('Theme Customization Support Properties', () => {
  it('should support custom color overrides', () => {
    fc.assert(
      fc.property(
        fc.record({
          customPrimary: fc.record({
            500: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
            600: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
          }),
          customSecondary: fc.record({
            500: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
          }),
        }),
        (customColors) => {
          // Property: Custom colors should override base colors
          const customTheme = createThemeVariant(designTokens, {
            colors: {
              primary: customColors.customPrimary,
              secondary: customColors.customSecondary,
            },
          });
          
          // Property: Custom colors should be applied
          expect(customTheme.colors.primary['500']).toBe(customColors.customPrimary['500']);
          expect(customTheme.colors.primary['600']).toBe(customColors.customPrimary['600']);
          expect(customTheme.colors.secondary['500']).toBe(customColors.customSecondary['500']);
          
          // Property: Non-overridden colors should remain from base theme
          expect(customTheme.colors.primary['400']).toBe(designTokens.colors.primary['400']);
          expect(customTheme.colors.secondary['400']).toBe(designTokens.colors.secondary['400']);
          
          // Property: Other color categories should remain unchanged
          expect(customTheme.colors.success['500']).toBe(designTokens.colors.success['500']);
          expect(customTheme.colors.error['500']).toBe(designTokens.colors.error['500']);
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should support custom typography overrides', () => {
    fc.assert(
      fc.property(
        fc.record({
          customFontSizes: fc.record({
            base: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
            lg: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
          }),
          customFontWeights: fc.record({
            medium: fc.integer({ min: 400, max: 600 }),
            bold: fc.integer({ min: 600, max: 800 }),
          }),
        }),
        (customTypography) => {
          // Property: Custom typography should override base typography
          const customTheme = createThemeVariant(designTokens, {
            typography: {
              fontSize: customTypography.customFontSizes,
              fontWeight: customTypography.customFontWeights,
            },
          });
          
          // Property: Custom font sizes should be applied
          expect(customTheme.typography.fontSize.base).toBe(customTypography.customFontSizes.base);
          expect(customTheme.typography.fontSize.lg).toBe(customTypography.customFontSizes.lg);
          
          // Property: Custom font weights should be applied
          expect(customTheme.typography.fontWeight.medium).toBe(customTypography.customFontWeights.medium);
          expect(customTheme.typography.fontWeight.bold).toBe(customTypography.customFontWeights.bold);
          
          // Property: Non-overridden typography should remain from base theme
          expect(customTheme.typography.fontSize.sm).toBe(designTokens.typography.fontSize.sm);
          expect(customTheme.typography.fontWeight.normal).toBe(designTokens.typography.fontWeight.normal);
          
          // Property: Font family should remain from base theme
          expect(customTheme.typography.fontFamily.sans).toBe(designTokens.typography.fontFamily.sans);
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should support custom spacing overrides', () => {
    fc.assert(
      fc.property(
        fc.record({
          customSpacing: fc.record({
            4: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
            8: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
            16: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
          }),
        }),
        (customSpacingConfig) => {
          // Property: Custom spacing should override base spacing
          const customTheme = createThemeVariant(designTokens, {
            spacing: customSpacingConfig.customSpacing,
          });
          
          // Property: Custom spacing values should be applied
          expect(customTheme.spacing['4']).toBe(customSpacingConfig.customSpacing['4']);
          expect(customTheme.spacing['8']).toBe(customSpacingConfig.customSpacing['8']);
          expect(customTheme.spacing['16']).toBe(customSpacingConfig.customSpacing['16']);
          
          // Property: Non-overridden spacing should remain from base theme
          expect(customTheme.spacing['2']).toBe(designTokens.spacing['2']);
          expect(customTheme.spacing['12']).toBe(designTokens.spacing['12']);
          
          // Property: Base spacing values should remain
          expect(customTheme.spacing['0']).toBe('0');
          expect(customTheme.spacing['px']).toBe('1px');
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should support partial theme customizations', () => {
    fc.assert(
      fc.property(
        fc.record({
          partialColors: fc.option(fc.record({
            primary: fc.option(fc.record({
              500: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
            })),
          })),
          partialTypography: fc.option(fc.record({
            fontSize: fc.option(fc.record({
              base: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
            })),
          })),
        }),
        (partialCustomizations) => {
          // Property: Partial customizations should not break theme structure
          const customizations: any = {};
          
          if (partialCustomizations.partialColors) {
            customizations.colors = partialCustomizations.partialColors;
          }
          
          if (partialCustomizations.partialTypography) {
            customizations.typography = partialCustomizations.partialTypography;
          }
          
          const customTheme = createThemeVariant(designTokens, customizations);
          
          // Property: Theme should maintain complete structure
          expect(customTheme.colors.primary).toHaveProperty('50');
          expect(customTheme.colors.primary).toHaveProperty('500');
          expect(customTheme.colors.primary).toHaveProperty('950');
          
          expect(customTheme.typography.fontSize).toHaveProperty('xs');
          expect(customTheme.typography.fontSize).toHaveProperty('base');
          expect(customTheme.typography.fontSize).toHaveProperty('xl');
          
          // Property: Customized values should be applied if provided
          if (partialCustomizations.partialColors?.primary?.['500']) {
            expect(customTheme.colors.primary['500']).toBe(partialCustomizations.partialColors.primary['500']);
          } else {
            expect(customTheme.colors.primary['500']).toBe(designTokens.colors.primary['500']);
          }
          
          if (partialCustomizations.partialTypography?.fontSize?.base) {
            expect(customTheme.typography.fontSize.base).toBe(partialCustomizations.partialTypography.fontSize.base);
          } else {
            expect(customTheme.typography.fontSize.base).toBe(designTokens.typography.fontSize.base);
          }
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should support theme extension without breaking base theme', () => {
    fc.assert(
      fc.property(
        fc.record({
          extensionColors: fc.record({
            brand: fc.record({
              500: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
            }),
          }),
          extensionSpacing: fc.record({
            custom: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
          }),
        }),
        (extensions) => {
          // Property: Theme extensions should not modify base theme
          const originalPrimary = designTokens.colors.primary['500'];
          const originalSpacing4 = designTokens.spacing['4'];
          
          // Create extended theme
          const extendedTheme = createThemeVariant(designTokens, {
            colors: {
              ...extensions.extensionColors,
            },
            spacing: {
              ...extensions.extensionSpacing,
            },
          });
          
          // Property: Base theme should remain unchanged
          expect(designTokens.colors.primary['500']).toBe(originalPrimary);
          expect(designTokens.spacing['4']).toBe(originalSpacing4);
          
          // Property: Extended theme should include base values
          expect(extendedTheme.colors.primary['500']).toBe(originalPrimary);
          expect(extendedTheme.spacing['4']).toBe(originalSpacing4);
          
          // Property: Extended theme should include new values
          expect(extendedTheme.colors).toHaveProperty('brand');
          expect(extendedTheme.spacing).toHaveProperty('custom');
          expect((extendedTheme.colors as any).brand['500']).toBe(extensions.extensionColors.brand['500']);
          expect((extendedTheme.spacing as any).custom).toBe(extensions.extensionSpacing.custom);
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });

  it('should validate custom theme values', () => {
    fc.assert(
      fc.property(
        fc.record({
          validColor: fc.string().filter(s => /^#[0-9a-fA-F]{6}$/.test(s)),
          validSpacing: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
          validFontSize: fc.string().filter(s => /^[\d.]+rem$/.test(s)),
          validFontWeight: fc.integer({ min: 100, max: 900 }).filter(n => n % 100 === 0),
        }),
        (validValues) => {
          // Property: Valid custom values should be accepted
          const customTheme = createThemeVariant(designTokens, {
            colors: {
              primary: {
                500: validValues.validColor,
              },
            },
            spacing: {
              4: validValues.validSpacing,
            },
            typography: {
              fontSize: {
                base: validValues.validFontSize,
              },
              fontWeight: {
                medium: validValues.validFontWeight,
              },
            },
          });
          
          // Property: Valid values should be applied correctly
          expect(customTheme.colors.primary['500']).toBe(validValues.validColor);
          expect(customTheme.spacing['4']).toBe(validValues.validSpacing);
          expect(customTheme.typography.fontSize.base).toBe(validValues.validFontSize);
          expect(customTheme.typography.fontWeight.medium).toBe(validValues.validFontWeight);
          
          // Property: Values should match expected formats
          expect(customTheme.colors.primary['500']).toMatch(/^#[0-9a-fA-F]{6}$/);
          expect(customTheme.spacing['4']).toMatch(/^[\d.]+rem$/);
          expect(customTheme.typography.fontSize.base).toMatch(/^[\d.]+rem$/);
          expect(customTheme.typography.fontWeight.medium % 100).toBe(0);
        }
      ),
      { numRuns: PBT_CONFIG.numRuns }
    );
  });
});