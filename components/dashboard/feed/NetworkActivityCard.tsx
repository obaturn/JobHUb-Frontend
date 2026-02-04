import React from 'react';
import { motion } from 'framer-motion';

interface NetworkActivityCardProps {
  activity: {
    type: 'connection_hired' | 'connection_promoted' | 'connection_posted' | 'new_connection';
    user: {
      name: string;
      avatar: string;
      title: string;
    };
    company?: string;
    message: string;
  };
  timestamp: Date;
}

const NetworkActivityCard: React.FC<NetworkActivityCardProps> = ({
  activity,
  timestamp
}) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'connection_hired':
        return '🎉';
      case 'connection_promoted':
        return '📈';
      case 'connection_posted':
        return '✍️';
      case 'new_connection':
        return '🤝';
      default:
        return '👥';
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case 'connection_hired':
        return 'text-green-600';
      case 'connection_promoted':
        return 'text-blue-600';
      case 'connection_posted':
        return 'text-purple-600';
      case 'new_connection':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getActivityIcon()}</span>
          <span className={`text-sm font-medium ${getActivityColor()}`}>
            Network Activity
          </span>
        </div>
        <span className="text-sm text-gray-500">{formatTimeAgo(timestamp)}</span>
      </div>

      {/* Activity Content */}
      <div className="flex items-start space-x-4">
        <img
          src={activity.user.avatar}
          alt={activity.user.name}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <p className="text-gray-800 leading-relaxed">
              {activity.message}
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{activity.user.name}</p>
                <p className="text-sm text-gray-600">{activity.user.title}</p>
                {activity.company && (
                  <p className="text-sm text-gray-500">at {activity.company}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">Congratulate</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">Comment</span>
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View Profile →
        </motion.button>
      </div>
    </div>
  );
};

export default NetworkActivityCard;