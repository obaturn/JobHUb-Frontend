import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-primary/25',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-secondary/25',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/25',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/25',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25'
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} ${className}`}>
      <div className="relative">
        {/* Label */}
        <AnimatePresence>
          {(showLabel || isHovered) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 10 : -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-1/2 -translate-y-1/2 ${
                position.includes('right') ? 'right-full mr-3' : 'left-full ml-3'
              } bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg`}
            >
              {label}
              {/* Arrow */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 ${
                  position.includes('right') ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={onClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            ${sizeClasses[size]} 
            ${variantClasses[variant]}
            rounded-full shadow-lg flex items-center justify-center
            transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2
          `}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          aria-label={label}
        >
          <motion.div
            animate={{ rotate: isHovered ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </motion.button>

        {/* Ripple effect */}
        <motion.div
          className={`absolute inset-0 rounded-full ${variantClasses[variant].split(' ')[0]} opacity-20`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default FloatingButton;