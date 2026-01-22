import React from 'react';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface GridProps extends BaseComponentProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' | 'none';
  rows?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto' | 'none';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  colGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: Partial<Pick<GridProps, 'cols' | 'rows' | 'gap'>>;
    md?: Partial<Pick<GridProps, 'cols' | 'rows' | 'gap'>>;
    lg?: Partial<Pick<GridProps, 'cols' | 'rows' | 'gap'>>;
    xl?: Partial<Pick<GridProps, 'cols' | 'rows' | 'gap'>>;
  };
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol';
}

const Grid: React.FC<GridProps> = ({
  children,
  className,
  testId,
  cols = 'auto',
  rows = 'auto',
  gap = 'md',
  colGap,
  rowGap,
  responsive,
  as: Component = 'div',
  ...props
}) => {
  const colsStyles = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
    auto: 'grid-cols-auto',
    none: 'grid-cols-none',
  };

  const rowsStyles = {
    1: 'grid-rows-1',
    2: 'grid-rows-2',
    3: 'grid-rows-3',
    4: 'grid-rows-4',
    5: 'grid-rows-5',
    6: 'grid-rows-6',
    auto: 'grid-rows-auto',
    none: 'grid-rows-none',
  };

  const gapStyles = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const colGapStyles = {
    none: 'gap-x-0',
    xs: 'gap-x-1',
    sm: 'gap-x-2',
    md: 'gap-x-4',
    lg: 'gap-x-6',
    xl: 'gap-x-8',
  };

  const rowGapStyles = {
    none: 'gap-y-0',
    xs: 'gap-y-1',
    sm: 'gap-y-2',
    md: 'gap-y-4',
    lg: 'gap-y-6',
    xl: 'gap-y-8',
  };

  // Generate responsive classes
  const responsiveClasses = responsive ? Object.entries(responsive).map(([breakpoint, config]) => {
    const prefix = breakpoint === 'sm' ? 'sm:' : breakpoint === 'md' ? 'md:' : breakpoint === 'lg' ? 'lg:' : 'xl:';
    const classes = [];
    
    if (config.cols) classes.push(`${prefix}${colsStyles[config.cols]}`);
    if (config.rows) classes.push(`${prefix}${rowsStyles[config.rows]}`);
    if (config.gap) classes.push(`${prefix}${gapStyles[config.gap]}`);
    
    return classes.join(' ');
  }).join(' ') : '';

  const gridClasses = cn(
    'grid',
    colsStyles[cols],
    rowsStyles[rows],
    colGap ? colGapStyles[colGap] : rowGap ? rowGapStyles[rowGap] : gapStyles[gap],
    responsiveClasses,
    className
  );

  return (
    <Component
      className={gridClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

// Grid Item component
export interface GridItemProps extends BaseComponentProps {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' | 'full';
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto' | 'full';
  colStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  rowStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'auto';
  as?: 'div' | 'li' | 'article' | 'section';
}

export const GridItem: React.FC<GridItemProps> = ({
  children,
  className,
  testId,
  colSpan = 'auto',
  rowSpan = 'auto',
  colStart,
  rowStart,
  as: Component = 'div',
  ...props
}) => {
  const colSpanStyles = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    12: 'col-span-12',
    auto: 'col-auto',
    full: 'col-span-full',
  };

  const rowSpanStyles = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
    5: 'row-span-5',
    6: 'row-span-6',
    auto: 'row-auto',
    full: 'row-span-full',
  };

  const colStartStyles = {
    1: 'col-start-1',
    2: 'col-start-2',
    3: 'col-start-3',
    4: 'col-start-4',
    5: 'col-start-5',
    6: 'col-start-6',
    7: 'col-start-7',
    8: 'col-start-8',
    9: 'col-start-9',
    10: 'col-start-10',
    11: 'col-start-11',
    12: 'col-start-12',
    13: 'col-start-13',
    auto: 'col-start-auto',
  };

  const rowStartStyles = {
    1: 'row-start-1',
    2: 'row-start-2',
    3: 'row-start-3',
    4: 'row-start-4',
    5: 'row-start-5',
    6: 'row-start-6',
    7: 'row-start-7',
    auto: 'row-start-auto',
  };

  const itemClasses = cn(
    colSpanStyles[colSpan],
    rowSpanStyles[rowSpan],
    colStart && colStartStyles[colStart],
    rowStart && rowStartStyles[rowStart],
    className
  );

  return (
    <Component
      className={itemClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Grid;