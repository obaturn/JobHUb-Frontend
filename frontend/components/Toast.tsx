import React, { useEffect } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-dismiss after 4 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-accent' : 'bg-alert';
  const icon = type === 'success' ? <CheckCircleIcon className="w-6 h-6 text-white" /> : null; // Add error icon if needed

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down-fade">
      <div className={`${bgColor} text-white rounded-lg shadow-2xl flex items-center justify-between p-4 min-w-[350px] max-w-md`}>
        <div className="flex items-center gap-3">
          {icon}
          <p className="font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
      <style>{`
        @keyframes slide-down-fade {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slide-down-fade { animation: slide-down-fade 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Toast;
