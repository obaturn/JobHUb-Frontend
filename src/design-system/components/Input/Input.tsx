import React, { forwardRef } from 'react';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface InputProps extends BaseComponentProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  testId,
  size = 'md',
  variant = 'default',
  error = false,
  errorMessage,
  helperText,
  label,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Base styles
  const baseStyles = cn(
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
    {
      'w-full': fullWidth,
    }
  );

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // Variant styles
  const variantStyles = {
    default: cn(
      'border rounded-md',
      'bg-white dark:bg-neutral-800',
      'border-neutral-300 dark:border-neutral-600',
      'text-neutral-900 dark:text-neutral-100',
      {
        'border-error-500 focus:ring-error-500 focus:border-error-500': error,
        'focus:ring-primary-500 focus:border-primary-500': !error,
      }
    ),
    filled: cn(
      'border-0 rounded-md',
      'bg-neutral-100 dark:bg-neutral-700',
      'text-neutral-900 dark:text-neutral-100',
      {
        'bg-error-50 dark:bg-error-900/20 focus:ring-error-500': error,
        'focus:ring-primary-500 focus:bg-white dark:focus:bg-neutral-800': !error,
      }
    ),
    flushed: cn(
      'border-0 border-b-2 rounded-none px-0',
      'bg-transparent',
      'text-neutral-900 dark:text-neutral-100',
      {
        'border-error-500 focus:ring-0 focus:border-error-600': error,
        'border-neutral-300 dark:border-neutral-600 focus:ring-0 focus:border-primary-500': !error,
      }
    ),
  };

  const inputClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    {
      'pl-10': leftIcon && size === 'sm',
      'pl-11': leftIcon && size === 'md',
      'pl-12': leftIcon && size === 'lg',
      'pr-10': rightIcon && size === 'sm',
      'pr-11': rightIcon && size === 'md',
      'pr-12': rightIcon && size === 'lg',
    },
    className
  );

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
  };

  const iconPositionClasses = {
    left: {
      sm: 'left-3',
      md: 'left-3',
      lg: 'left-3',
    },
    right: {
      sm: 'right-3',
      md: 'right-3',
      lg: 'right-3',
    },
  };

  return (
    <div className={cn('relative', { 'w-full': fullWidth })}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={cn(
            'absolute inset-y-0 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500',
            iconPositionClasses.left[size]
          )}>
            {React.cloneElement(leftIcon, {
              className: cn(iconSizeClasses[size], leftIcon.props.className)
            })}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          data-testid={testId}
          aria-invalid={error}
          aria-describedby={
            error && errorMessage ? `${inputId}-error` :
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className={cn(
            'absolute inset-y-0 flex items-center pointer-events-none text-neutral-400 dark:text-neutral-500',
            iconPositionClasses.right[size]
          )}>
            {React.cloneElement(rightIcon, {
              className: cn(iconSizeClasses[size], rightIcon.props.className)
            })}
          </div>
        )}
      </div>
      
      {error && errorMessage && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-error-600 dark:text-error-400"
        >
          {errorMessage}
        </p>
      )}
      
      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-neutral-500 dark:text-neutral-400"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;