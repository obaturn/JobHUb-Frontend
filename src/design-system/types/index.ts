import React from 'react';

// Base component props that all design system components should extend
export interface BaseComponentProps {
  className?: string;
  testId?: string;
  children?: React.ReactNode;
}

// Themeable props for components that support variants
export interface ThemeableProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// Interactive props for clickable/interactive components
export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

// Color scale type for design tokens
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

// Design tokens interface
export interface DesignTokens {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    neutral: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
  };
  typography: {
    fontFamily: {
      sans: string;
      mono: string;
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
}

// Theme configuration
export interface ThemeConfig {
  tokens: DesignTokens;
  mode: 'light' | 'dark' | 'system';
  customizations?: Partial<DesignTokens>;
}