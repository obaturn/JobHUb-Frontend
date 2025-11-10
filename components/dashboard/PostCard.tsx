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
    <div className="bg-white p-4 rounded-lg shadow-md border">
      {/* Post Header */}
      <div className="flex items-start gap-4 mb-4">
        <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full" />
        <div>
          <h3 className="font-bold text-neutral-dark">{post.author.name}</h3>
          <p className="text-xs text-gray-500">{post.author.headline}</p>
          <p className="text-xs text-gray-400">{post.timestamp}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>

      {/* Engagement Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
        <span>{post.likes} Likes</span>
        <span>{post.comments} Comments</span>
      </div>

      {/* Action Buttons */}
      <div className="border-t mt-2 pt-1 flex justify-around">
        <PostActionButton icon={<HandThumbUpIcon className="w-5 h-5"/>} label="Like" />
        <PostActionButton icon={<ChatBubbleLeftIcon className="w-5 h-5"/>} label="Comment" />
        <PostActionButton icon={<ArrowUpOnSquareIcon className="w-5 h-5"/>} label="Share" />
      </div>
    </div>
  );
};

export default PostCard;
