
import React, { useRef, useEffect } from 'react';
import { Conversation, User, DirectMessage } from '../../types';
import { PaperAirplaneIcon } from '../icons/PaperAirplaneIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';

interface ChatPaneProps {
  currentUser: User;
  conversation: Conversation;
  onBack: () => void;
}

const MessageBubble: React.FC<{ message: DirectMessage; isSent: boolean }> = ({ message, isSent }) => (
    <div className={`flex items-end gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
        <div
            className={`max-w-md p-3 rounded-2xl ${
            isSent
                ? 'bg-primary text-white rounded-br-none'
                : 'bg-white text-neutral-dark rounded-bl-none'
            }`}
        >
            <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
    </div>
);

const ChatPane: React.FC<ChatPaneProps> = ({ currentUser, conversation, onBack }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { participant, messages } = conversation;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
  return (
    <div className="h-full flex flex-col bg-neutral-light">
      <header className="bg-white p-4 border-b flex items-center gap-4">
        <button onClick={onBack} className="md:hidden p-2 -ml-2 text-gray-500 hover:text-primary">
            <ArrowLeftIcon className="w-5 h-5"/>
        </button>
        <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="font-bold text-neutral-dark">{participant.name}</h2>
          <p className="text-xs text-gray-500">{participant.headline}</p>
        </div>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isSent={msg.senderId === currentUser.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t">
        <form className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 w-full px-4 py-2 bg-neutral-light border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="p-3 bg-primary text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPane;
