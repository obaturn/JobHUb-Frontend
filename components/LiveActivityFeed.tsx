import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  id: string;
  type: 'job_posted' | 'hire_made' | 'company_joined' | 'skill_trending';
  message: string;
  company?: string;
  location?: string;
  salary?: string;
  timestamp: Date;
  icon: string;
  color: string;
}

const LiveActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  // Sample activities pool
  const activityPool: Omit<Activity, 'id' | 'timestamp'>[] = [
    {
      type: 'job_posted',
      message: 'New Senior React Developer position at TechCorp',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      salary: '$120k-160k',
      icon: '💼',
      color: 'bg-blue-500'
    },
    {
      type: 'hire_made',
      message: 'Sarah M. just got hired as Product Manager at InnovateLab',
      company: 'InnovateLab',
      location: 'New York, NY',
      icon: '🎉',
      color: 'bg-green-500'
    },
    {
      type: 'company_joined',
      message: 'DataFlow Inc. joined JobHub with 15 open positions',
      company: 'DataFlow Inc.',
      icon: '🏢',
      color: 'bg-purple-500'
    },
    {
      type: 'skill_trending',
      message: 'AI/Machine Learning skills are trending +25% this week',
      icon: '📈',
      color: 'bg-orange-500'
    },
    {
      type: 'job_posted',
      message: 'UX Designer role available at DesignStudio',
      company: 'DesignStudio',
      location: 'Remote',
      salary: '$90k-130k',
      icon: '🎨',
      color: 'bg-pink-500'
    },
    {
      type: 'hire_made',
      message: 'Michael K. landed a DevOps Engineer role at CloudTech',
      company: 'CloudTech',
      location: 'Austin, TX',
      icon: '⚡',
      color: 'bg-yellow-500'
    }
  ];

  // Generate new activities
  useEffect(() => {
    const generateActivity = () => {
      const randomActivity = activityPool[Math.floor(Math.random() * activityPool.length)];
      const newActivity: Activity = {
        ...randomActivity,
        id: `activity-${Date.now()}-${Math.random()}`,
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 4)]); // Keep only 5 activities
    };

    // Initial activities
    generateActivity();
    generateActivity();
    generateActivity();

    // Generate new activity every 3-8 seconds
    const interval = setInterval(() => {
      generateActivity();
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const }
    },
    exit: { 
      opacity: 0, 
      x: 50, 
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <section className="bg-white py-16 md:py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark">
              Live Activity Feed
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what's happening right now on JobHub - new jobs, successful hires, and trending opportunities.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
                <span className="font-semibold text-gray-700">Real-time Updates</span>
              </div>
              <motion.button
                onClick={() => setIsVisible(!isVisible)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {isVisible ? 'Hide' : 'Show'} Feed
              </motion.button>
            </div>

            {/* Activity List */}
            <AnimatePresence>
              {isVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <AnimatePresence mode="popLayout">
                    {activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
                          >
                            {activity.icon}
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-medium mb-1">
                              {activity.message}
                            </p>
                            
                            {/* Additional info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              {activity.location && (
                                <span className="flex items-center gap-1">
                                  📍 {activity.location}
                                </span>
                              )}
                              {activity.salary && (
                                <span className="flex items-center gap-1">
                                  💰 {activity.salary}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                🕒 {formatTimeAgo(activity.timestamp)}
                              </span>
                            </div>
                          </div>

                          {/* Action button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                          >
                            {activity.type === 'job_posted' ? 'View Job' : 
                             activity.type === 'company_joined' ? 'View Company' : 
                             'Learn More'}
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {[
                  { label: 'Jobs Today', value: '1,247', icon: '💼' },
                  { label: 'Hires Today', value: '89', icon: '🎉' },
                  { label: 'New Companies', value: '23', icon: '🏢' },
                  { label: 'Active Users', value: '12.5k', icon: '👥' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveActivityFeed;