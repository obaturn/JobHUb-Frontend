import React from 'react';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

// Heading component
export interface HeadingProps extends BaseComponentProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: '6xl' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  className,
  testId,
  as: Component = 'h2',
  size = '2xl',
  weight = 'semibold',
  color = 'default',
  ...props
}) => {
  const sizeStyles = {
    '6xl': 'text-6xl leading-none',
    '5xl': 'text-5xl leading-none',
    '4xl': 'text-4xl leading-tight',
    '3xl': 'text-3xl leading-tight',
    '2xl': 'text-2xl leading-tight',
    'xl': 'text-xl leading-tight',
    'lg': 'text-lg leading-tight',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorStyles = {
    default: 'text-neutral-900 dark:text-neutral-100',
    muted: 'text-neutral-600 dark:text-neutral-400',
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    error: 'text-error-600 dark:text-error-400',
  };

  const headingClasses = cn(
    sizeStyles[size],
    weightStyles[weight],
    colorStyles[color],
    className
  );

  return (
    <Component
      className={headingClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

// Text component
export interface TextProps extends BaseComponentProps {
  as?: 'p' | 'span' | 'div' | 'label';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right' | 'justify';
}

export const Text: React.FC<TextProps> = ({
  children,
  className,
  testId,
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'default',
  align = 'left',
  ...props
}) => {
  const sizeStyles = {
    xs: 'text-xs leading-normal',
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-relaxed',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorStyles = {
    default: 'text-neutral-900 dark:text-neutral-100',
    muted: 'text-neutral-600 dark:text-neutral-400',
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    error: 'text-error-600 dark:text-error-400',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const textClasses = cn(
    sizeStyles[size],
    weightStyles[weight],
    colorStyles[color],
    alignStyles[align],
    className
  );

  return (
    <Component
      className={textClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

// Caption component (small text)
export interface CaptionProps extends BaseComponentProps {
  as?: 'p' | 'span' | 'div' | 'small';
  size?: 'xs' | 'sm';
  weight?: 'normal' | 'medium' | 'semibold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right';
}

export const Caption: React.FC<CaptionProps> = ({
  children,
  className,
  testId,
  as: Component = 'p',
  size = 'sm',
  weight = 'normal',
  color = 'muted',
  align = 'left',
  ...props
}) => {
  const sizeStyles = {
    xs: 'text-xs leading-normal',
    sm: 'text-sm leading-normal',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
  };

  const colorStyles = {
    default: 'text-neutral-900 dark:text-neutral-100',
    muted: 'text-neutral-500 dark:text-neutral-400',
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    success: 'text-success-600 dark:text-success-400',
    warning: 'text-warning-600 dark:text-warning-400',
    error: 'text-error-600 dark:text-error-400',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const captionClasses = cn(
    sizeStyles[size],
    weightStyles[weight],
    colorStyles[color],
    alignStyles[align],
    className
  );

  return (
    <Component
      className={captionClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};