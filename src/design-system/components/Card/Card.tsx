import React from 'react';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface CardProps extends BaseComponentProps {
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  interactive?: boolean;
  as?: 'div' | 'article' | 'section' | 'aside';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  testId,
  variant = 'elevated',
  padding = 'md',
  radius = 'lg',
  shadow = 'md',
  hover = false,
  interactive = false,
  as: Component = 'div',
  onClick,
  ...props
}) => {
  const variantStyles = {
    elevated: 'bg-white dark:bg-neutral-800 border-0',
    outlined: 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700',
    filled: 'bg-neutral-50 dark:bg-neutral-900 border-0',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const cardClasses = cn(
    'transition-all duration-200',
    variantStyles[variant],
    paddingStyles[padding],
    radiusStyles[radius],
    variant === 'elevated' && shadowStyles[shadow],
    {
      'hover:shadow-lg hover:-translate-y-0.5': hover && variant === 'elevated',
      'hover:border-neutral-300 dark:hover:border-neutral-600': hover && variant === 'outlined',
      'hover:bg-neutral-100 dark:hover:bg-neutral-800': hover && variant === 'filled',
      'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': interactive || onClick,
    },
    className
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((interactive || onClick) && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Component
      className={cardClasses}
      data-testid={testId}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={(interactive || onClick) ? handleKeyDown : undefined}
      tabIndex={(interactive || onClick) ? 0 : undefined}
      role={(interactive || onClick) ? 'button' : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card sub-components
export interface CardHeaderProps extends BaseComponentProps {
  as?: 'div' | 'header';
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  testId,
  as: Component = 'div',
  ...props
}) => (
  <Component
    className={cn('mb-4', className)}
    data-testid={testId}
    {...props}
  >
    {children}
  </Component>
);

export interface CardBodyProps extends BaseComponentProps {
  as?: 'div' | 'main';
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  testId,
  as: Component = 'div',
  ...props
}) => (
  <Component
    className={cn('flex-1', className)}
    data-testid={testId}
    {...props}
  >
    {children}
  </Component>
);

export interface CardFooterProps extends BaseComponentProps {
  as?: 'div' | 'footer';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  testId,
  as: Component = 'div',
  ...props
}) => (
  <Component
    className={cn('mt-4', className)}
    data-testid={testId}
    {...props}
  >
    {children}
  </Component>
);

export default Card;