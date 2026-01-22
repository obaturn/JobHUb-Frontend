import React from 'react';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface SpinnerProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'current';
  thickness?: 'thin' | 'normal' | 'thick';
  speed?: 'slow' | 'normal' | 'fast';
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  className,
  testId,
  size = 'md',
  color = 'primary',
  thickness = 'normal',
  speed = 'normal',
  label = 'Loading...',
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorStyles = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    current: 'text-current',
  };

  const thicknessStyles = {
    thin: 'border-2',
    normal: 'border-2',
    thick: 'border-4',
  };

  const speedStyles = {
    slow: 'animate-spin [animation-duration:2s]',
    normal: 'animate-spin',
    fast: 'animate-spin [animation-duration:0.5s]',
  };

  const spinnerClasses = cn(
    'inline-block rounded-full border-solid border-current border-r-transparent',
    sizeStyles[size],
    colorStyles[color],
    thicknessStyles[thickness],
    speedStyles[speed],
    className
  );

  return (
    <div
      className={spinnerClasses}
      role="status"
      aria-label={label}
      data-testid={testId}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;