/**
 * Glass Card Component
 * Reusable glassmorphism card with various styles
 */

import React from 'react';
import { motion } from 'framer-motion';
import { getGlassClasses, GLASS_PATTERNS, GlassProps } from '../design-system/tokens/glassmorphism';

interface GlassCardProps extends GlassProps {
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'medium',
  className = '',
  children,
  hover = true,
  onClick
}) => {
  const glassClasses = getGlassClasses(variant);
  
  return (
    <motion.div
      className={`${glassClasses} ${GLASS_PATTERNS.card} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;