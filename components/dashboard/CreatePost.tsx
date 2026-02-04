import React, { useState } from 'react';
import { User } from '../../types';

interface CreatePostProps {
  user: User;
  onCreatePost: (content: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'achievement' | 'learning' | 'question' | 'update'>('update');

  const handleSubmit = () => {
    if (content.trim()) {
      onCreatePost(content);
      setContent('');
    }
  };

  const postTypeOptions = [
    { value: 'achievement', label: '🏆 Achievement', placeholder: 'Share a professional milestone or accomplishment...' },
    { value: 'learning', label: '📚 Learning', placeholder: 'Share what you\'re learning or a new skill you\'ve acquired...' },
    { value: 'question', label: '❓ Question', placeholder: 'Ask for career advice or industry insights...' },
    { value: 'update', label: '💼 Update', placeholder: 'Share a professional update or career news...' }
  ];

  const selectedOption = postTypeOptions.find(option => option.value === postType);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
      <div className="flex items-start gap-3 lg:gap-4">
        <img 
          src={user?.avatar || 'https://picsum.photos/seed/default/200/200'} 
          alt={user?.name || 'User'} 
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gray-200" 
        />
        <div className="flex-1">
          {/* Post Type Selector */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {postTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPostType(option.value as any)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    postType === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={selectedOption?.placeholder}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-sm lg:text-base"
            rows={3}
          />
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Photo
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Document
              </button>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm lg:text-base"
            >
              Share Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
