/**
 * Lazy Section Component
 * Renders children only when they come into viewport
 * Improves initial page load performance
 */

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLazyLoad, useReducedMotion } from '../hooks/useLazyLoad';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  className = '',
  threshold = 0.1,
  rootMargin = '100px'
}) => {
  const { ref, isIntersecting } = useLazyLoad({ threshold, rootMargin });
  const prefersReducedMotion = useReducedMotion();

  const defaultFallback = (
    <div className={`min-h-[200px] flex items-center justify-center ${className}`}>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );

  return (
    <div ref={ref} className={className}>
      {isIntersecting ? (
        prefersReducedMotion ? (
          <div>{children}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

export default LazySection;