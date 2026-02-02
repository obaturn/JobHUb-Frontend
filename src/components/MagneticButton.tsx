/**
 * Magnetic Button Component
 * Button that attracts to mouse cursor with smooth animations
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  magneticStrength?: number;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  disabled?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  onClick,
  magneticStrength = 0.3,
  springConfig = { damping: 15, stiffness: 150, mass: 0.1 },
  disabled = false
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations for smooth movement
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Transform for rotation based on position
  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Apply magnetic effect
    x.set(deltaX * magneticStrength);
    y.set(deltaY * magneticStrength);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{
        scale: { duration: 0.2 }
      }}
    >
      {/* Magnetic glow effect */}
      <motion.div
        className="absolute inset-0 rounded-inherit"
        animate={{
          boxShadow: isHovered 
            ? '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Ripple effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-inherit bg-gradient-to-r from-blue-400/20 to-purple-400/20"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
    </motion.button>
  );
};

export default MagneticButton;