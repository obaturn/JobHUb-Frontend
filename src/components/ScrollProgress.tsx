/**
 * Scroll Progress Indicator
 * Shows reading progress and provides smooth scroll navigation
 */

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollSection {
  id: string;
  label: string;
  icon?: string;
}

interface ScrollProgressProps {
  sections?: ScrollSection[];
  showPercentage?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const ScrollProgress: React.FC<ScrollProgressProps> = ({
  sections = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'features', label: 'Features', icon: '⭐' },
    { id: 'jobs', label: 'Jobs', icon: '💼' },
    { id: 'companies', label: 'Companies', icon: '🏢' },
    { id: 'testimonials', label: 'Reviews', icon: '💬' },
  ],
  showPercentage = true,
  position = 'right'
}) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide based on scroll position
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setIsVisible(latest > 0.1);
      
      // Calculate active section based on scroll progress
      const sectionIndex = Math.floor(latest * sections.length);
      setActiveSection(Math.min(sectionIndex, sections.length - 1));
    });

    return unsubscribe;
  }, [scrollYProgress, sections.length]);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-0 right-0 h-1';
      case 'bottom':
        return 'bottom-0 left-0 right-0 h-1';
      case 'left':
        return 'left-4 top-1/2 transform -translate-y-1/2 w-1 h-64';
      case 'right':
        return 'right-4 top-1/2 transform -translate-y-1/2 w-1 h-64';
      default:
        return 'right-4 top-1/2 transform -translate-y-1/2 w-1 h-64';
    }
  };

  const isHorizontal = position === 'top' || position === 'bottom';

  return (
    <>
      {/* Main Progress Bar */}
      <motion.div
        className={`fixed z-50 ${getPositionClasses()}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isHorizontal ? (
          // Horizontal progress bar
          <div className="w-full h-full bg-black/10 backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 origin-left"
              style={{ scaleX }}
            />
          </div>
        ) : (
          // Vertical progress indicator with sections
          <div className="relative">
            {/* Background track */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-full" />
            
            {/* Progress fill */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full origin-top"
              style={{ scaleY: scaleX }}
            />

            {/* Section dots */}
            <div className="absolute -left-8 top-0 h-full flex flex-col justify-between py-2">
              {sections.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`group relative w-8 h-8 rounded-full transition-all duration-300 ${
                    index <= activeSection 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-white/80 text-gray-600 hover:bg-blue-100'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xs">{section.icon}</span>
                  
                  {/* Tooltip */}
                  <motion.div
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                    initial={{ x: 10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {section.label}
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Percentage indicator */}
      {showPercentage && !isHorizontal && (
        <motion.div
          className="fixed right-16 bottom-8 z-50 bg-black/80 text-white px-3 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span>
            {Math.round(scrollYProgress.get() * 100)}%
          </motion.span>
        </motion.div>
      )}

      {/* Scroll to top button */}
      <motion.button
        className="fixed right-4 bottom-4 z-50 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </>
  );
};

export default ScrollProgress;