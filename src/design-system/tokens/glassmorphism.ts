/**
 * Glassmorphism Design Tokens
 * Modern glass-like UI effects with backdrop blur and transparency
 */

export const GLASS_VARIANTS = {
  // Light glass effects
  light: {
    background: 'bg-white/20',
    backdrop: 'backdrop-blur-sm',
    border: 'border border-white/20',
    shadow: 'shadow-lg',
  },
  
  // Medium glass effects
  medium: {
    background: 'bg-white/30',
    backdrop: 'backdrop-blur-md',
    border: 'border border-white/30',
    shadow: 'shadow-xl',
  },
  
  // Strong glass effects
  strong: {
    background: 'bg-white/40',
    backdrop: 'backdrop-blur-lg',
    border: 'border border-white/40',
    shadow: 'shadow-2xl',
  },
  
  // Dark glass effects
  dark: {
    background: 'bg-black/20',
    backdrop: 'backdrop-blur-sm',
    border: 'border border-white/10',
    shadow: 'shadow-lg',
  },
  
  // Colored glass effects
  blue: {
    background: 'bg-blue-500/20',
    backdrop: 'backdrop-blur-sm',
    border: 'border border-blue-300/30',
    shadow: 'shadow-lg shadow-blue-500/20',
  },
  
  purple: {
    background: 'bg-purple-500/20',
    backdrop: 'backdrop-blur-sm',
    border: 'border border-purple-300/30',
    shadow: 'shadow-lg shadow-purple-500/20',
  },
} as const;

// Helper function to get glass classes
export const getGlassClasses = (variant: keyof typeof GLASS_VARIANTS = 'medium') => {
  const glass = GLASS_VARIANTS[variant];
  return `${glass.background} ${glass.backdrop} ${glass.border} ${glass.shadow}`;
};

// Glassmorphism component props
export interface GlassProps {
  variant?: keyof typeof GLASS_VARIANTS;
  className?: string;
  children: React.ReactNode;
}

// Common glassmorphism patterns
export const GLASS_PATTERNS = {
  card: 'rounded-xl p-6',
  button: 'rounded-lg px-6 py-3 font-medium transition-all duration-300 hover:bg-white/40',
  input: 'rounded-lg px-4 py-3 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50',
  modal: 'rounded-2xl p-8 max-w-md mx-auto',
  navigation: 'rounded-full px-6 py-3',
} as const;