
import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '../icons/XMarkIcon';

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside the video player to close the modal
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
      <div ref={modalRef} className="bg-black rounded-lg shadow-2xl w-full max-w-4xl relative aspect-video animate-slide-up">
        <button 
          onClick={onClose} 
          className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-10 bg-white text-neutral-dark p-2 rounded-full shadow-lg hover:bg-gray-200 transition-colors"
          aria-label="Close video player"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <video
          className="w-full h-full rounded-lg"
          src={videoUrl}
          controls
          autoPlay
          playsInline
        />
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        
        @keyframes slide-up {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default VideoModal;
