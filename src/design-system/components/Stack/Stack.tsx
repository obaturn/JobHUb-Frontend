import React from 'react';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface StackProps extends BaseComponentProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  divider?: React.ReactElement;
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol' | 'nav';
}

const Stack: React.FC<StackProps> = ({
  children,
  className,
  testId,
  direction = 'column',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  divider,
  as: Component = 'div',
  ...props
}) => {
  const directionStyles = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse',
  };

  const spacingStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  const alignStyles = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyStyles = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const stackClasses = cn(
    'flex',
    directionStyles[direction],
    !divider && spacingStyles[spacing], // Only apply gap if no divider
    alignStyles[align],
    justifyStyles[justify],
    {
      'flex-wrap': wrap,
    },
    className
  );

  // If divider is provided, we need to manually insert it between children
  const renderChildren = () => {
    if (!divider) {
      return children;
    }

    const childArray = React.Children.toArray(children);
    const childrenWithDividers: React.ReactNode[] = [];

    childArray.forEach((child, index) => {
      childrenWithDividers.push(child);
      
      // Add divider between children (not after the last one)
      if (index < childArray.length - 1) {
        childrenWithDividers.push(
          React.cloneElement(divider, {
            key: `divider-${index}`,
            className: cn('flex-shrink-0', divider.props.className),
          })
        );
      }
    });

    return childrenWithDividers;
  };

  return (
    <Component
      className={stackClasses}
      data-testid={testId}
      {...props}
    >
      {renderChildren()}
    </Component>
  );
};

// Convenience components
export const HStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack direction="row" {...props} />
);

export const VStack: React.FC<Omit<StackProps, 'direction'>> = (props) => (
  <Stack direction="column" {...props} />
);

export default Stack;