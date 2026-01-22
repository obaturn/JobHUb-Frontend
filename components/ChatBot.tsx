import React, { useState } from 'react';
import { ChatBubbleOvalLeftEllipsisIcon } from './icons/ChatBubbleOvalLeftEllipsisIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import ChatWindow from './ChatWindow';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary z-50"
        aria-label="Toggle chatbot"
      >
        {isOpen ? <XMarkIcon className="w-8 h-8" /> : <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />}
      </button>

      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatBot;
