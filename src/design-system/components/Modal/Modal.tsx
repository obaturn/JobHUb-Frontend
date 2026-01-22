import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BaseComponentProps } from '../../types';
import { cn } from '../../utils/classNames';

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  title?: string;
  centered?: boolean;
  scrollBehavior?: 'inside' | 'outside';
}

const Modal: React.FC<ModalProps> = ({
  children,
  className,
  testId,
  isOpen,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  title,
  centered = true,
  scrollBehavior = 'outside',
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const sizeStyles = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4',
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen]);

  // Handle focus trap
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      const modal = modalRef.current;
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex',
        {
          'items-center justify-center': centered,
          'items-start justify-center pt-16': !centered,
          'p-4': scrollBehavior === 'outside',
        }
      )}
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-white dark:bg-neutral-800 rounded-lg shadow-xl',
          'w-full',
          sizeStyles[size],
          {
            'max-h-full overflow-y-auto': scrollBehavior === 'inside',
            'max-h-[90vh] overflow-y-auto': scrollBehavior === 'outside',
          },
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        data-testid={testId}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={cn(
          'p-6',
          {
            'pt-6': !title && !showCloseButton,
            'overflow-y-auto': scrollBehavior === 'inside',
          }
        )}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Modal sub-components
export interface ModalHeaderProps extends BaseComponentProps {
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className,
  testId,
  onClose,
  showCloseButton = true,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700',
      className
    )}
    data-testid={testId}
    {...props}
  >
    <div className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
      {children}
    </div>
    {showCloseButton && onClose && (
      <button
        onClick={onClose}
        className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        aria-label="Close modal"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

export interface ModalBodyProps extends BaseComponentProps {}

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
  testId,
  ...props
}) => (
  <div
    className={cn('p-6', className)}
    data-testid={testId}
    {...props}
  >
    {children}
  </div>
);

export interface ModalFooterProps extends BaseComponentProps {}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
  testId,
  ...props
}) => (
  <div
    className={cn(
      'flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700',
      className
    )}
    data-testid={testId}
    {...props}
  >
    {children}
  </div>
);

export default Modal;