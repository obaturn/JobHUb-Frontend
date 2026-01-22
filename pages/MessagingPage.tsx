
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
    <div className="bg-neutral-light min-h-screen">
      <div className="container mx-auto h-[calc(100vh-80px)] flex flex-col pt-16">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-primary font-medium transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="text-sm text-gray-500">
              {conversations.length} conversations
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-grow flex bg-white m-4 rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Conversations Sidebar */}
          <aside className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-gray-50 flex-col ${selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-lg font-semibold text-neutral-dark">Messages</h2>
              <p className="text-sm text-gray-500 mt-1">Connect with recruiters and professionals</p>
            </div>
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
          </aside>

          {/* Chat Pane */}
          <section className={`w-full md:flex-grow flex-col ${selectedConversationId ? 'flex' : 'hidden md:flex'}`}>
            {selectedConversation ? (
              <ChatPane
                key={selectedConversation.id}
                currentUser={currentUser}
                conversation={selectedConversation}
                onBack={() => setSelectedConversationId(null)}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-center text-gray-500 bg-gray-50">
                <div className="max-w-md">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">No conversation selected</h2>
                  <p className="text-gray-600">Choose a conversation from the sidebar to start messaging, or wait for recruiters to reach out to you.</p>
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
