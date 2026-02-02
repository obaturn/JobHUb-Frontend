import React from 'react';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface ContainerProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centerContent?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: 'div' | 'section' | 'article' | 'main' | 'aside';
}

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  testId,
  size = 'xl',
  centerContent = false,
  padding = 'md',
  as: Component = 'div',
  ...props
}) => {
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-none',
    full: 'w-full max-w-none',
  };

  const paddingStyles = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8',
  };

  const containerClasses = cn(
    'w-full',
    sizeStyles[size],
    paddingStyles[padding],
    centerContent && size !== 'full' ? 'mx-auto' : '',
    className
  );

  return (
    <Component
      className={containerClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;