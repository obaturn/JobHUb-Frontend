import React from 'react';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface IconProps extends BaseComponentProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  color?: 'current' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted';
  icon: React.ReactElement;
}

const Icon: React.FC<IconProps> = ({
  className,
  testId,
  size = 'md',
  color = 'current',
  icon,
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  };

  const colorStyles = {
    current: 'text-current',
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
    muted: 'text-neutral-400 dark:text-neutral-500',
  };

  const iconClasses = cn(
    sizeStyles[size],
    colorStyles[color],
    'flex-shrink-0',
    className
  );

  return React.cloneElement(icon, {
    className: iconClasses,
    'data-testid': testId,
    ...props,
  });
};

export default Icon;