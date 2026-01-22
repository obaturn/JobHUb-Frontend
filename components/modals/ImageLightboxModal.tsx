import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '../icons/XMarkIcon';

interface ImageLightboxModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({ imageUrl, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 bg-white/20 text-white p-2 rounded-full shadow-lg hover:bg-white/30 transition-colors"
            aria-label="Close image view"
        >
            <XMarkIcon className="w-8 h-8" />
        </button>
      <div ref={modalRef} className="relative w-full h-full flex items-center justify-center">
        <img
            src={imageUrl}
            alt="Enlarged gallery view"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-zoom-in"
        />
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        
        @keyframes zoom-in {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in { animation: zoom-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ImageLightboxModal;