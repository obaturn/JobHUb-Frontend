import React, { useState } from 'react';
import { User } from '../../types';

interface PostEngagement {
  likes: number;
  comments: number;
  shares: number;
  hasLiked: boolean;
  hasCommented: boolean;
  hasShared: boolean;
}

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    company?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  hasLiked: boolean;
}

interface SocialPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    company?: string;
    isVerified?: boolean;
  };
  type: 'achievement' | 'learning' | 'question' | 'update' | 'job_posting' | 'company_news';
  content: string;
  timestamp: string;
  engagement: PostEngagement;
  comments: Comment[];
  media?: {
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
  };
  hashtags?: string[];
  mentions?: string[];
}

interface SocialFeedPostProps {
  post: SocialPost;
  currentUser: User;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
  onShare: (postId: string) => void;
  onViewProfile: (userId: string) => void;
}

const SocialFeedPost: React.FC<SocialFeedPostProps> = ({
  post,
  currentUser,
  onLike,
  onComment,
  onShare,
  onViewProfile
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLike = () => {
    onLike(post.id);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const handleShare = () => {
    onShare(post.id);
    setShowShareModal(false);
  };

  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'achievement':
        return '🏆';
      case 'learning':
        return '📚';
      case 'question':
        return '❓';
      case 'job_posting':
        return '💼';
      case 'company_news':
        return '📢';
      default:
        return '💭';
    }
  };

  const getPostTypeLabel = () => {
    switch (post.type) {
      case 'achievement':
        return 'shared an achievement';
      case 'learning':
        return 'is learning something new';
      case 'question':
        return 'asked a question';
      case 'job_posting':
        return 'posted a job';
      case 'company_news':
        return 'shared company news';
      default:
        return 'posted an update';
    }
  };

  const formatContent = (content: string) => {
    // Simple hashtag and mention formatting
    return content
      .replace(/#(\w+)/g, '<span class="text-primary font-medium">#$1</span>')
      .replace(/@(\w+)/g, '<span class="text-primary font-medium">@$1</span>');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <button
          onClick={() => onViewProfile(post.author.id)}
          className="flex-shrink-0"
        >
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-primary transition-colors"
          />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onViewProfile(post.author.id)}
              className="font-semibold text-gray-900 hover:text-primary transition-colors"
            >
              {post.author.name}
            </button>
            {post.author.isVerified && (
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{getPostTypeIcon()} {getPostTypeLabel()}</span>
          </div>
          
          <div className="text-sm text-gray-600">
            <span>{post.author.title}</span>
            {post.author.company && (
              <>
                <span className="mx-1">at</span>
                <span className="font-medium">{post.author.company}</span>
              </>
            )}
          </div>
          
          <div className="text-xs text-gray-500 mt-1">{post.timestamp}</div>
        </div>

        {/* Post Menu */}
        <div className="relative">
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <div 
          className="text-gray-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
        />
        
        {/* Media */}
        {post.media && (
          <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
            {post.media.type === 'image' && (
              <img
                src={post.media.url}
                alt="Post media"
                className="w-full h-auto max-h-96 object-cover"
              />
            )}
            {post.media.type === 'video' && (
              <video
                src={post.media.url}
                poster={post.media.thumbnail}
                controls
                className="w-full h-auto max-h-96"
              />
            )}
            {post.media.type === 'document' && (
              <div className="p-4 bg-gray-50 flex items-center gap-3">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Document</div>
                  <div className="text-sm text-gray-600">Click to view</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.hashtags.map((hashtag, index) => (
              <button
                key={index}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                #{hashtag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          {post.engagement.likes > 0 && (
            <span className="flex items-center gap-1">
              <span className="text-blue-500">👍</span>
              {post.engagement.likes}
            </span>
          )}
          {post.engagement.comments > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:text-primary transition-colors"
            >
              {post.engagement.comments} comments
            </button>
          )}
          {post.engagement.shares > 0 && (
            <span>{post.engagement.shares} shares</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          {post.engagement.likes + post.engagement.comments + post.engagement.shares} total engagements
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around py-2">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            post.engagement.hasLiked
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill={post.engagement.hasLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          <span className="font-medium">Like</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">Comment</span>
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Add Comment */}
          <div className="flex gap-3 mb-4">
            <img
              src={currentUser.avatar || 'https://picsum.photos/seed/default/200/200'}
              alt={currentUser.name || 'You'}
              className="w-8 h-8 rounded-full border border-gray-200"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => onViewProfile(comment.author.id)}
                        className="font-medium text-gray-900 hover:text-primary transition-colors"
                      >
                        {comment.author.name}
                      </button>
                      <span className="text-xs text-gray-500">{comment.author.title}</span>
                    </div>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{comment.timestamp}</span>
                    <button className="hover:text-primary transition-colors">
                      Like ({comment.likes})
                    </button>
                    <button className="hover:text-primary transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share this post</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share to your network</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Send in a message</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy link</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeedPost;