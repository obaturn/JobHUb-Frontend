/**
 * Design System - Animation Tokens
 * Consistent Framer Motion animations across the application
 */

import { Variants } from 'framer-motion';

// Standard animation variants
export const FADE_IN_UP: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export const FADE_IN: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export const SCALE_IN: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export const SLIDE_IN_LEFT: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export const SLIDE_IN_RIGHT: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

// Container variants for staggered animations
export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const STAGGER_CONTAINER_FAST: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const STAGGER_CONTAINER_SLOW: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// Hover animations
export const HOVER_LIFT = {
  whileHover: { 
    y: -5, 
    scale: 1.02,
    transition: { duration: 0.3 }
  }
};

export const HOVER_SCALE = {
  whileHover: { 
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

export const HOVER_GLOW = {
  whileHover: { 
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: { duration: 0.3 }
  }
};

// Tap animations
export const TAP_SCALE = {
  whileTap: { scale: 0.95 }
};

// Viewport settings for scroll animations
export const VIEWPORT_ONCE = {
  once: true,
  margin: "-100px"
};

export const VIEWPORT_REPEAT = {
  once: false,
  margin: "-50px"
};

// Common transition settings
export const TRANSITIONS = {
  smooth: { duration: 0.6, ease: "easeOut" as const },
  fast: { duration: 0.3, ease: "easeOut" as const },
  slow: { duration: 1, ease: "easeOut" as const },
  spring: { type: "spring" as const, stiffness: 100, damping: 12 },
  bounce: { type: "spring" as const, stiffness: 400, damping: 10 }
};