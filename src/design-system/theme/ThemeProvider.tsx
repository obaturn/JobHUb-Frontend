import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeConfig, DesignTokens } from '../types';
import { designTokens } from './tokens';

interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleTheme: () => void;
  tokens: DesignTokens;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = {} 
}) => {
  const [theme, setThemeState] = useState<ThemeConfig>({
    tokens: designTokens,
    mode: 'dark',
    ...initialTheme,
  });

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setThemeState(prev => ({ ...prev, mode: savedTheme }));
    }
    applyTheme(savedTheme || 'dark');
  }, []);

  const applyTheme = (newMode: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (newMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
    } else {
      root.classList.add(newMode);
      root.style.colorScheme = newMode;
    }
  };

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    setThemeState(prev => {
      const updated = { ...prev, ...newTheme };
      
      if (newTheme.mode) {
        localStorage.setItem('theme', newTheme.mode);
        applyTheme(newTheme.mode);
      }
      
      return updated;
    });
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme.mode);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme({ mode: nextTheme });
  };

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme.mode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme.mode]);

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
    tokens: theme.customizations ? 
      { ...designTokens, ...theme.customizations } : 
      designTokens,
    isDark: theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isLight: theme.mode === 'light' || (theme.mode === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches),
    isSystem: theme.mode === 'system',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};