import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';

export interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  initializeNotifications: (userType: 'job_seeker' | 'employer' | 'admin') => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,

      // Actions
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      },

      addNotification: (notificationData) => {
        const { notifications } = get();
        const newNotification: Notification = {
          ...notificationData,
          id: `notification-${Date.now()}`,
        };

        const updatedNotifications = [newNotification, ...notifications];
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;

        set({
          notifications: updatedNotifications,
          unreadCount,
        });
      },

      markAsRead: (notificationId) => {
        const { notifications } = get();
        const updatedNotifications = notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;

        set({
          notifications: updatedNotifications,
          unreadCount,
        });
      },

      markAllAsRead: () => {
        const { notifications } = get();
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));

        set({
          notifications: updatedNotifications,
          unreadCount: 0,
        });
      },

      removeNotification: (notificationId) => {
        const { notifications } = get();
        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;

        set({
          notifications: updatedNotifications,
          unreadCount,
        });
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadCount: 0,
        });
      },

      initializeNotifications: (userType) => {
        let notifications: Notification[] = [];
        
        switch (userType) {
          case 'job_seeker':
            notifications = MOCK_NOTIFICATIONS;
            break;
          case 'employer':
            notifications = MOCK_NOTIFICATIONS.slice(0, 1); // Simpler notifications
            break;
          case 'admin':
            notifications = [];
            break;
        }

        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      },
    }),
    {
      name: 'notification-store',
    }
  )
);