
import React, { useState } from 'react';
import { Conversation, User } from '../types';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import ConversationList from '../components/messaging/ConversationList';
import ChatPane from '../components/messaging/ChatPane';

interface MessagingPageProps {
  currentUser: User;
  conversations: Conversation[];
  onBack: () => void;
}

const MessagingPage: React.FC<MessagingPageProps> = ({ currentUser, conversations, onBack }) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(conversations[0]?.id || null);

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="bg-white">
      <div className="container mx-auto h-[calc(100vh-112px)] flex flex-col">
        <div className="p-4 border-b">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary font-medium">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        <div className="flex-grow flex border rounded-lg m-4 shadow-inner bg-neutral-light overflow-hidden">
          <aside className={`w-full md:w-1/3 lg:w-1/4 border-r bg-white flex-col ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
          </aside>
          <section className={`w-full md:flex-grow flex-col ${selectedConversationId ? 'flex' : 'hidden md:flex'}`}>
            {selectedConversation ? (
              <ChatPane
                key={selectedConversation.id}
                currentUser={currentUser}
                conversation={selectedConversation}
                onBack={() => setSelectedConversationId(null)}
              />
            ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                    <div>
                        <h2 className="text-xl font-semibold">Select a conversation</h2>
                        <p>Choose a conversation from the list to start chatting.</p>
                    </div>
                </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
