# JobHub Design System

A comprehensive design system for the JobHub platform, built with React, TypeScript, and Tailwind CSS.

## Overview

The JobHub Design System provides a consistent set of reusable components, design tokens, and patterns that ensure a cohesive user experience across the entire platform.

## Architecture

- **Foundation**: Design tokens, theme system, and utilities
- **Components**: Atomic design principles with atoms, molecules, and organisms
- **Testing**: Property-based testing with fast-check and unit testing with Vitest
- **Documentation**: Interactive component documentation with Storybook

## Getting Started

### Installation

The design system is part of the main JobHub application. All dependencies are managed through the main package.json.

### Usage

```tsx
import { Button, ThemeProvider } from './design-system';

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary" size="md">
        Click me
      </Button>
    </ThemeProvider>
  );
}
```

### Theme System

The design system includes a comprehensive theme system with:

- **Design Tokens**: Colors, typography, spacing, shadows, and more
- **Theme Modes**: Light, dark, and system preference support
- **Customization**: Extensible theme configuration

### Testing

Components are tested using:

- **Unit Tests**: Vitest + React Testing Library
- **Property-Based Tests**: fast-check for universal properties
- **Visual Tests**: Storybook for component documentation and visual testing

### Development

```bash
# Run tests
npm run test

# Start Storybook
npm run storybook

# Run tests with UI
npm run test:ui
```

## Component Categories

### Foundation Components (Atoms)
- Button
- Input
- Typography
- Icon
- Spinner

### Layout Components
- Container
- Grid
- Stack
- Card
- Modal

### Form Components
- FormField
- Select
- Checkbox
- RadioGroup
- FileUpload

### Data Display Components
- Table
- JobCard
- UserCard
- Stats
- Badge

### Feedback Components
- Toast
- Alert
- ErrorBoundary
- EmptyState
- ProgressBar

### Navigation Components
- Header
- Sidebar
- Breadcrumb
- Tabs
- Pagination

## Design Principles

1. **Consistency**: All components follow standardized APIs and visual patterns
2. **Accessibility**: WCAG 2.1 AA compliance built into every component
3. **Performance**: Optimized for fast loading and smooth interactions
4. **Flexibility**: Customizable through props and theme system
5. **Developer Experience**: Clear documentation and TypeScript support