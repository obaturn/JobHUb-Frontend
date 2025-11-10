
import React from 'react';
import { Conversation } from '../../types';
import { MagnifyingGlassIcon } from '../icons/MagnifyingGlassIcon';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationListItem: React.FC<{ conversation: Conversation; isSelected: boolean; onSelect: () => void; }> = ({ conversation, isSelected, onSelect }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return (
        <button 
            onClick={onSelect}
            className={`w-full text-left p-4 flex items-center gap-4 transition-colors duration-150 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
        >
            <div className="relative flex-shrink-0">
                <img src={conversation.participant.avatar} alt={conversation.participant.name} className="w-12 h-12 rounded-full" />
                {conversation.unreadCount > 0 && 
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-primary ring-2 ring-white" />
                }
            </div>
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-neutral-dark truncate">{conversation.participant.name}</h3>
                    <p className="text-xs text-gray-400 flex-shrink-0">{lastMessage?.timestamp}</p>
                </div>
                <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-800 font-semibold' : 'text-gray-500'}`}>
                    {lastMessage?.text}
                </p>
            </div>
        </button>
    );
};


const ConversationList: React.FC<ConversationListProps> = ({ conversations, selectedConversationId, onSelectConversation }) => {
  return (
    <div className="h-full flex flex-col">
        <div className="p-4 border-b">
             <div className="relative">
                <input 
                    type="text"
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 bg-neutral-light border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             </div>
        </div>
      <div className="flex-grow overflow-y-auto divide-y">
        {conversations.map(convo => (
          <ConversationListItem
            key={convo.id}
            conversation={convo}
            isSelected={convo.id === selectedConversationId}
            onSelect={() => onSelectConversation(convo.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
