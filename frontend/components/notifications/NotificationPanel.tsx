
import React, { useEffect, useRef } from 'react';
import { Notification } from '../../types';
import NotificationItem from './NotificationItem';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onMarkAllRead, onClose }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

  return (
    <div ref={panelRef} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-fade-in-down">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold text-neutral-dark">Notifications</h3>
        {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="text-xs text-primary font-medium hover:underline">
                Mark all as read
            </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-8 px-4">You have no new notifications.</p>
        )}
      </div>
       <div className="p-2 bg-gray-50 rounded-b-lg text-center">
            <button className="text-sm font-medium text-primary hover:underline">View All Notifications</button>
      </div>
      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationPanel;
