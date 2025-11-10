import React, { useState } from 'react';
import { User } from '../../types';

interface CreatePostProps {
  user: User;
  onCreatePost: (content: string) => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ user, onCreatePost }) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onCreatePost(content);
      setContent('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-start gap-4">
        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update or ask a question..."
            className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary resize-none"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!content.trim()}
              className="px-5 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
