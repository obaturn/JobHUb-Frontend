import React from 'react';
import { UserPost } from '../../types';
import { HandThumbUpIcon } from '../icons/HandThumbUpIcon';
import { ChatBubbleLeftIcon } from '../icons/ChatBubbleLeftIcon';
import { ArrowUpOnSquareIcon } from '../icons/ArrowUpOnSquareIcon';

interface PostCardProps {
  post: UserPost;
}

const PostActionButton: React.FC<{ icon: React.ReactNode; label: string; count?: number }> = ({ icon, label, count }) => (
    <button className="flex items-center gap-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-md px-3 py-2 transition-colors text-sm font-medium">
        {icon}
        <span>{label}</span>
        {count !== undefined && <span className="text-xs">{count}</span>}
    </button>
);

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Post Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full ring-2 ring-gray-100"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-neutral-dark hover:text-primary transition-colors cursor-pointer">
            {post.author.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{post.author.headline}</p>
          <p className="text-xs text-gray-400 mt-1">{post.timestamp}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <HandThumbUpIcon className="w-4 h-4 text-blue-500" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChatBubbleLeftIcon className="w-4 h-4 text-gray-400" />
            <span>{post.comments}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-sm">
          Share
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around">
        <PostActionButton
          icon={<HandThumbUpIcon className="w-5 h-5"/>}
          label="Like"
          count={post.likes}
        />
        <PostActionButton
          icon={<ChatBubbleLeftIcon className="w-5 h-5"/>}
          label="Comment"
          count={post.comments}
        />
        <PostActionButton
          icon={<ArrowUpOnSquareIcon className="w-5 h-5"/>}
          label="Share"
        />
      </div>
    </div>
  );
};

export default PostCard;
