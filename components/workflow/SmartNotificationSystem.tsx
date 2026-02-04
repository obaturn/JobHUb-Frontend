import React, { useState, useEffect } from 'react';
import { User, Job, Company } from '../../types';
import JobApplicationModal from '../application/JobApplicationModal';

interface SmartNotificationSystemProps {
  user: User;
  resumes?: any[];
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
  onApplyJob: (job: Job) => void;
  onFollowCompany: (companyId: string) => void;
}

interface SmartNotification {
  id: string;
  type: 'job_match' | 'company_update' | 'network_activity' | 'application_update' | 'skill_recommendation';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  actionable: boolean;
  actions: NotificationAction[];
  data: any;
  read: boolean;
}

interface NotificationAction {
  label: string;
  type: 'primary' | 'secondary';
  action: () => void;
}

const SmartNotificationSystem: React.FC<SmartNotificationSystemProps> = ({
  user,
  resumes = [],
  onViewJobDetails,
  onViewCompanyProfile,
  onApplyJob,
  onFollowCompany
}) => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState<'all' | 'actionable' | 'updates'>('actionable');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Generate smart notifications based on user activity
  useEffect(() => {
    const generateSmartNotifications = (): SmartNotification[] => {
      const mockJob = {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        companyId: 'techcorp',
        logo: 'https://picsum.photos/seed/techcorp/100/100',
        location: 'San Francisco, CA',
        type: 'Full-time' as const,
        salary: '$140k - $180k',
        posted: '2 hours ago'
      };

      return [
        {
          id: '1',
          type: 'job_match',
          priority: 'high',
          title: 'Perfect Job Match Found!',
          message: 'A new Senior Frontend Developer role at TechCorp matches 95% of your skills and preferences.',
          timestamp: '5 minutes ago',
          actionable: true,
          actions: [
            {
              label: 'Apply Now',
              type: 'primary',
              action: () => {
                if (resumes.length > 0) {
                  setSelectedJob(mockJob);
                  setIsApplicationModalOpen(true);
                } else {
                  onApplyJob(mockJob);
                }
              }
            },
            {
              label: 'View Details',
              type: 'secondary',
              action: () => onViewJobDetails(mockJob)
            }
          ],
          data: { job: mockJob },
          read: false
        },
        {
          id: '2',
          type: 'company_update',
          priority: 'medium',
          title: 'TechCorp Posted an Update',
          message: 'The company you\'re following just announced they\'re expanding their engineering team.',
          timestamp: '2 hours ago',
          actionable: true,
          actions: [
            {
              label: 'View Update',
              type: 'primary',
              action: () => onViewCompanyProfile('techcorp')
            },
            {
              label: 'See Jobs',
              type: 'secondary',
              action: () => onViewJobDetails(mockJob)
            }
          ],
          data: { companyId: 'techcorp' },
          read: false
        },
        {
          id: '3',
          type: 'network_activity',
          priority: 'low',
          title: 'Network Update',
          message: 'Sarah Johnson from your network just got a new job at Google. Consider reaching out to congratulate her.',
          timestamp: '1 day ago',
          actionable: true,
          actions: [
            {
              label: 'Send Message',
              type: 'primary',
              action: () => console.log('Send congratulations message')
            }
          ],
          data: { userId: 'sarah-johnson' },
          read: false
        },
        {
          id: '4',
          type: 'application_update',
          priority: 'high',
          title: 'Application Status Update',
          message: 'Your application for Frontend Developer at InnovateCorp has been viewed by the hiring manager.',
          timestamp: '3 hours ago',
          actionable: false,
          actions: [],
          data: { applicationId: 'app-123' },
          read: true
        },
        {
          id: '5',
          type: 'skill_recommendation',
          priority: 'medium',
          title: 'Skill Recommendation',
          message: 'Based on your recent job searches, consider adding "Next.js" to your profile. 78% of similar roles require this skill.',
          timestamp: '1 day ago',
          actionable: true,
          actions: [
            {
              label: 'Add Skill',
              type: 'primary',
              action: () => console.log('Add Next.js skill')
            },
            {
              label: 'Take Assessment',
              type: 'secondary',
              action: () => console.log('Take Next.js assessment')
            }
          ],
          data: { skill: 'Next.js' },
          read: false
        }
      ];
    };

    setNotifications(generateSmartNotifications());
  }, [user, onApplyJob, onViewJobDetails, onViewCompanyProfile]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'actionable') return notif.actionable && !notif.read;
    if (filter === 'updates') return !notif.actionable;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionableCount = notifications.filter(n => n.actionable && !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'company_update':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      case 'network_activity':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'application_update':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'skill_recommendation':
        return (
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3h5v5h-5V3zM4 3h6v6H4V3z" />
            </svg>
          </div>
        );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-primary transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM16 3h5v5h-5V3zM4 3h6v6H4V3z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Smart Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-1">
              {[
                { key: 'actionable', label: 'Actionable', count: actionableCount },
                { key: 'all', label: 'All', count: unreadCount },
                { key: 'updates', label: 'Updates', count: notifications.filter(n => !n.actionable).length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    filter === key
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">No notifications to show</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                        
                        {/* Actions */}
                        {notification.actions.length > 0 && (
                          <div className="flex gap-2">
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  action.action();
                                  handleMarkAsRead(notification.id);
                                }}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  action.type === 'primary'
                                    ? 'bg-primary text-white hover:bg-primary-dark'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-primary hover:text-primary-dark text-xs font-medium"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {unreadCount > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button
                onClick={handleMarkAllAsRead}
                className="w-full text-center text-sm text-primary hover:text-primary-dark font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}

      {/* Job Application Modal */}
      {selectedJob && resumes.length > 0 && (
        <JobApplicationModal
          job={selectedJob}
          user={user}
          resumes={resumes}
          isOpen={isApplicationModalOpen}
          onClose={() => {
            setIsApplicationModalOpen(false);
            setSelectedJob(null);
          }}
          onSubmitApplication={async (applicationData) => {
            onApplyJob(selectedJob);
            setIsApplicationModalOpen(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default SmartNotificationSystem;