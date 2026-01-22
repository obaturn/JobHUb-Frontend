
import React from 'react';
import { Notification } from '../../types';
import { EnvelopeIcon } from '../../constants';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <EnvelopeIcon className="w-5 h-5 text-primary" />;
      case 'application':
        return <DocumentTextIcon className="w-5 h-5 text-secondary" />;
      case 'system':
        return <CheckCircleIcon className="w-5 h-5 text-accent" />;
      default:
        return null;
    }
  };

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
