import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { XMarkIcon } from './icons/XMarkIcon';

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  // Use `any` for the ref type, as the GoogleGenAI type will be loaded dynamically.
  const aiRef = useRef<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: "Hello! I'm JobHub Assistant. How can I help you find your dream job today?",
      sender: 'bot',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = { text: userInput, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      let ai = aiRef.current;
      if (!ai) {
        // Dynamically import the Google AI library on first use.
        const { GoogleGenAI } = await import('@google/genai');
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
          throw new Error("API Key is missing.");
        }
        ai = new GoogleGenAI({ apiKey });
        aiRef.current = ai;
      }
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: currentInput,
        config: {
            systemInstruction: "You are the JobHub Assistant, a friendly and helpful AI designed to assist users in finding jobs on the JobHub platform. Your goal is to understand user queries about job searching, company information, resume tips, and career advice, and provide concise, relevant, and encouraging answers. When asked about specific job types or locations, suggest that the user use the search and filter tools on the Job Search page.",
        }
      });
      
      const botMessage: ChatMessage = { text: response.text, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
       const errorMessageText = error instanceof Error && error.message.includes("API Key is missing")
        ? "I can't seem to connect to the AI service. The API key is missing."
        : "Sorry, I'm having trouble connecting right now. Please try again later.";
      const errorMessage: ChatMessage = {
        text: errorMessageText,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed bottom-24 right-6 w-full max-w-sm bg-white rounded-xl shadow-2xl flex flex-col transition-opacity duration-300 ease-in-out z-50 animate-fade-in-up"
      style={{ height: '70vh' }}
    >
      <header className="bg-primary text-white p-4 flex justify-between items-center rounded-t-xl">
        <h3 className="font-bold text-lg">JobHub Assistant</h3>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </header>

      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                J
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-neutral-light text-neutral-dark rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start">
             <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">J</div>
            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-neutral-light text-neutral-dark rounded-bl-none">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about jobs, companies..."
          className="flex-1 w-full px-4 py-2 bg-neutral-light border border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="p-3 bg-primary text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          disabled={isLoading || !userInput.trim()}
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;