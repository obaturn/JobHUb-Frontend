
import React from 'react';
import { Notification } from '../../types';
import { EnvelopeIcon } from '../../constants';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  // Check if this is a congratulation notification
  const isCongratulation = notification.type === 'application' && 
    (notification.text.includes('Congratulations') || notification.text.includes('Congrats'));

  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <EnvelopeIcon className="w-5 h-5 text-primary" />;
      case 'application':
        if (isCongratulation) {
          return <SparklesIcon className="w-6 h-6 text-green-500" />;
        }
        return <DocumentTextIcon className="w-5 h-5 text-secondary" />;
      case 'system':
        return <CheckCircleIcon className="w-5 h-5 text-accent" />;
      default:
        return null;
    }
  };

  // Render congratulation card for application success
  if (isCongratulation) {
    return (
      <div className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-green-50/50' : ''}`}>
        {/* Header with logo */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/demo/image/upload/v1312461200/sample.jpg" 
              alt="JobHub Logo" 
              className="w-8 h-8 rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">JobHub</p>
            <p className="text-xs text-gray-400">Just now</p>
          </div>
          {getIcon()}
        </div>
        
        {/* Congratulation message */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 mb-3">
          <p className="text-white font-semibold text-sm">🎉 Congratulations!</p>
        </div>
        
        {/* Personalized message */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {notification.text}
        </p>
        
        {/* Footer info */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            📩 Awaiting Review
          </span>
          <span>•</span>
          <span>The company will be in touch soon!</span>
        </div>
      </div>
    );
  }

  // Default notification render
  return (
    <div className={`p-4 flex gap-4 items-start border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}>
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>
      <div>
        <p className="text-sm text-gray-700">{notification.text}</p>
        <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
      </div>
      {!notification.isRead && (
        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" aria-label="Unread"></div>
      )}
    </div>
  );
};

export default NotificationItem;
