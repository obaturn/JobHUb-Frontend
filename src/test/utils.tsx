import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../design-system/theme/ThemeProvider';

// Custom render function that includes ThemeProvider
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };