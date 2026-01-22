import React from 'react';
import { BaseComponentProps, ThemeableProps, InteractiveProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface ButtonProps extends BaseComponentProps, ThemeableProps, InteractiveProps {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  testId,
  variant = 'solid',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  onClick,
  ...props
}) => {
  // Base styles
  const baseStyles = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    {
      'w-full': fullWidth,
      'cursor-wait': loading,
    }
  );

  // Size styles
  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs rounded gap-1',
    sm: 'px-3 py-2 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-md gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2',
    xl: 'px-8 py-4 text-lg rounded-lg gap-2.5',
  };

  // Variant styles
  const variantStyles = {
    solid: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 active:bg-primary-700',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 active:bg-secondary-700',
      success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 active:bg-success-700',
      warning: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 active:bg-warning-700',
      error: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 active:bg-error-700',
    },
    outline: {
      primary: 'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100 dark:hover:bg-primary-900/20 dark:active:bg-primary-900/30',
      secondary: 'border border-secondary-500 text-secondary-500 hover:bg-secondary-50 focus:ring-secondary-500 active:bg-secondary-100 dark:hover:bg-secondary-900/20 dark:active:bg-secondary-900/30',
      success: 'border border-success-500 text-success-500 hover:bg-success-50 focus:ring-success-500 active:bg-success-100 dark:hover:bg-success-900/20 dark:active:bg-success-900/30',
      warning: 'border border-warning-500 text-warning-500 hover:bg-warning-50 focus:ring-warning-500 active:bg-warning-100 dark:hover:bg-warning-900/20 dark:active:bg-warning-900/30',
      error: 'border border-error-500 text-error-500 hover:bg-error-50 focus:ring-error-500 active:bg-error-100 dark:hover:bg-error-900/20 dark:active:bg-error-900/30',
    },
    ghost: {
      primary: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100 dark:hover:bg-primary-900/20 dark:active:bg-primary-900/30',
      secondary: 'text-secondary-500 hover:bg-secondary-50 focus:ring-secondary-500 active:bg-secondary-100 dark:hover:bg-secondary-900/20 dark:active:bg-secondary-900/30',
      success: 'text-success-500 hover:bg-success-50 focus:ring-success-500 active:bg-success-100 dark:hover:bg-success-900/20 dark:active:bg-success-900/30',
      warning: 'text-warning-500 hover:bg-warning-50 focus:ring-warning-500 active:bg-warning-100 dark:hover:bg-warning-900/20 dark:active:bg-warning-900/30',
      error: 'text-error-500 hover:bg-error-50 focus:ring-error-500 active:bg-error-100 dark:hover:bg-error-900/20 dark:active:bg-error-900/30',
    },
    link: {
      primary: 'text-primary-500 hover:text-primary-600 focus:ring-primary-500 active:text-primary-700 underline-offset-4 hover:underline',
      secondary: 'text-secondary-500 hover:text-secondary-600 focus:ring-secondary-500 active:text-secondary-700 underline-offset-4 hover:underline',
      success: 'text-success-500 hover:text-success-600 focus:ring-success-500 active:text-success-700 underline-offset-4 hover:underline',
      warning: 'text-warning-500 hover:text-warning-600 focus:ring-warning-500 active:text-warning-700 underline-offset-4 hover:underline',
      error: 'text-error-500 hover:text-error-600 focus:ring-error-500 active:text-error-700 underline-offset-4 hover:underline',
    },
  };

  const buttonClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant][variant === 'primary' ? 'primary' : 'primary'], // Default to primary for now
    className
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      data-testid={testId}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && React.cloneElement(leftIcon, { className: cn('w-4 h-4', leftIcon.props.className) })}
      {children}
      {!loading && rightIcon && React.cloneElement(rightIcon, { className: cn('w-4 h-4', rightIcon.props.className) })}
    </button>
  );
};

export default Button;