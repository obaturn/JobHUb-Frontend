import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import analytics from '../src/utils/analytics';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp: string;
  page: string;
  userAgent: string;
  sessionId: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const storedEvents = analytics.getStoredEvents();
    setEvents(storedEvents.reverse()); // Show newest first
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.category === filter;
  });

  const eventCategories = [...new Set(events.map(e => e.category))];

  const getEventStats = () => {
    const stats = {
      totalEvents: events.length,
      uniqueUsers: new Set(events.filter(e => e.userId).map(e => e.userId)).size,
      uniqueSessions: new Set(events.map(e => e.sessionId)).size,
      topEvents: {} as Record<string, number>
    };

    events.forEach(event => {
      stats.topEvents[event.event] = (stats.topEvents[event.event] || 0) + 1;
    });

    return stats;
  };

  const stats = getEventStats();

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm"
        >
          📊 Analytics
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-4 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <p className="text-blue-100">Real-time user interaction tracking</p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <div className="text-sm text-blue-100">Total Events</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
              <div className="text-sm text-blue-100">Unique Users</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{stats.uniqueSessions}</div>
              <div className="text-sm text-blue-100">Sessions</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{eventCategories.length}</div>
              <div className="text-sm text-blue-100">Categories</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({events.length})
            </button>
            {eventCategories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  filter === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category} ({events.filter(e => e.category === category).length})
              </button>
            ))}
            <button
              onClick={() => {
                analytics.clearStoredEvents();
                loadEvents();
              }}
              className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-auto p-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-4">📊</div>
              <p>No events tracked yet.</p>
              <p className="text-sm">Start interacting with the app to see analytics data.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {event.event}
                        </span>
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                          {event.category}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {event.action}
                        </span>
                      </div>
                      {event.label && (
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>Label:</strong> {event.label}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Page: {event.page}</span>
                        {event.userId && <span>User: {event.userId.slice(0, 8)}...</span>}
                        <span>Session: {event.sessionId.slice(-8)}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;