/**
 * Live Activity Feed Component
 * Shows real-time platform activity to build trust and engagement
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  type: 'hire' | 'job_posted' | 'profile_completed' | 'application' | 'salary_update';
  user: string;
  company?: string;
  position?: string;
  location?: string;
  salary?: string;
  timestamp: Date;
  avatar?: string;
}

interface LiveActivityFeedProps {
  maxItems?: number;
  updateInterval?: number;
  className?: string;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({
  maxItems = 5,
  updateInterval = 3000,
  className = ''
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Mock activity data
  const mockActivities: Omit<Activity, 'id' | 'timestamp'>[] = [
    {
      type: 'hire',
      user: 'Sarah Chen',
      company: 'Google',
      position: 'Senior Software Engineer',
      location: 'San Francisco',
      avatar: '👩‍💻'
    },
    {
      type: 'job_posted',
      user: 'Tech Startup Inc.',
      position: 'Full Stack Developer',
      location: 'Remote',
      salary: '$120k-$150k',
      avatar: '🚀'
    },
    {
      type: 'hire',
      user: 'Michael Rodriguez',
      company: 'Microsoft',
      position: 'Product Manager',
      location: 'Seattle',
      avatar: '👨‍💼'
    },
    {
      type: 'profile_completed',
      user: 'Emma Thompson',
      avatar: '👩‍🎨'
    },
    {
      type: 'application',
      user: 'David Kim',
      company: 'Meta',
      position: 'Data Scientist',
      avatar: '👨‍🔬'
    },
    {
      type: 'salary_update',
      user: 'Tech Industry',
      salary: '+15%',
      location: 'Nationwide'
    },
    {
      type: 'hire',
      user: 'Lisa Wang',
      company: 'Apple',
      position: 'UX Designer',
      location: 'Cupertino',
      avatar: '👩‍🎨'
    },
    {
      type: 'job_posted',
      user: 'Innovative Corp',
      position: 'DevOps Engineer',
      location: 'Austin',
      salary: '$110k-$140k',
      avatar: '⚙️'
    }
  ];

  // Generate random activity
  const generateActivity = (): Activity => {
    const template = mockActivities[Math.floor(Math.random() * mockActivities.length)];
    return {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
  };

  // Add new activity
  useEffect(() => {
    // Initial activities
    const initialActivities = Array.from({ length: maxItems }, generateActivity);
    setActivities(initialActivities);

    // Set up interval for new activities
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, maxItems - 1)]);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [maxItems, updateInterval]);

  // Format activity message
  const formatActivity = (activity: Activity) => {
    switch (activity.type) {
      case 'hire':
        return {
          icon: '🎉',
          message: `${activity.user} just got hired at ${activity.company}!`,
          subtitle: `${activity.position} • ${activity.location}`,
          color: 'text-green-600'
        };
      case 'job_posted':
        return {
          icon: '📢',
          message: `New job posted: ${activity.position}`,
          subtitle: `${activity.user} • ${activity.location} • ${activity.salary}`,
          color: 'text-blue-600'
        };
      case 'profile_completed':
        return {
          icon: '✅',
          message: `${activity.user} completed their profile`,
          subtitle: 'Ready to find their dream job',
          color: 'text-purple-600'
        };
      case 'application':
        return {
          icon: '📝',
          message: `${activity.user} applied to ${activity.company}`,
          subtitle: `${activity.position} position`,
          color: 'text-orange-600'
        };
      case 'salary_update':
        return {
          icon: '📈',
          message: `Tech salaries up ${activity.salary} this month`,
          subtitle: `${activity.location} market trends`,
          color: 'text-emerald-600'
        };
      default:
        return {
          icon: '💼',
          message: 'New activity on JobHub',
          subtitle: '',
          color: 'text-gray-600'
        };
    }
  };

  // Time ago formatter
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-900">Live Activity</h3>
            <p className="text-sm text-gray-500">Real-time platform updates</p>
          </div>
        </div>
        
        <motion.button
          onClick={() => setIsVisible(!isVisible)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isVisible ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
          </svg>
        </motion.button>
      </div>

      {/* Activity List */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {activities.map((activity, index) => {
                const formatted = formatActivity(activity);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
                  >
                    {/* Avatar/Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg">
                        {activity.avatar || formatted.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${formatted.color} group-hover:text-opacity-80 transition-colors`}>
                        {formatted.message}
                      </p>
                      {formatted.subtitle && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatted.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex-shrink-0 text-xs text-gray-400">
                      {timeAgo(activity.timestamp)}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-4 border-t border-gray-100 text-center"
      >
        <p className="text-xs text-gray-500">
          Join {(Math.random() * 1000 + 5000).toFixed(0)} professionals active today
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LiveActivityFeed;