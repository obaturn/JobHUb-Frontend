import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Job } from '../types';
import { BehaviorAnalyzer, BehaviorInsights } from '../src/utils/behaviorAnalytics';

interface LinkedInStyleDashboardProps {
  user: User;
  onNavigate: (page: any) => void;
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
}

const LinkedInStyleDashboard: React.FC<LinkedInStyleDashboardProps> = ({
  user,
  onNavigate,
  onViewJobDetails,
  onViewCompanyProfile
}) => {
  const [insights, setInsights] = useState<BehaviorInsights | null>(null);
  const [contextMode, setContextMode] = useState<'networking' | 'job_seeking' | 'hiring'>('networking');

  useEffect(() => {
    const behaviorData = BehaviorAnalyzer.getUserBehavior(user.id);
    const behaviorInsights = BehaviorAnalyzer.analyzeBehavior(behaviorData);
    setInsights(behaviorInsights);
    
    // Auto-set context based on behavior
    if (behaviorInsights.primaryIntent === 'job_seeking') {
      setContextMode('job_seeking');
    } else if (behaviorInsights.primaryIntent === 'hiring') {
      setContextMode('hiring');
    } else {
      setContextMode('networking');
    }
  }, [user.id]);

  // LinkedIn-style sidebar content based on context
  const getSidebarContent = () => {
    switch (contextMode) {
      case 'networking':
        return {
          title: 'Manage my network',
          items: [
            { icon: '👥', label: 'Connections', count: 311, action: () => {} },
            { icon: '👁️', label: 'Following & followers', count: null, action: () => {} },
            { icon: '🏢', label: 'Groups', count: null, action: () => {} },
            { icon: '📅', label: 'Events', count: null, action: () => {} },
            { icon: '📄', label: 'Pages', count: 338, action: () => {} },
            { icon: '📧', label: 'Newsletters', count: 13, action: () => {} }
          ]
        };
      
      case 'job_seeking':
        return {
          title: 'Job seeker tools',
          items: [
            { icon: '⚙️', label: 'Preferences', count: null, action: () => {} },
            { icon: '📊', label: 'Job tracker', count: null, action: () => {} },
            { icon: '💡', label: 'My Career Insights', count: null, action: () => {} },
            { icon: '✏️', label: 'Post a job', count: null, action: () => onNavigate('create_job') },
            { icon: '📋', label: 'Manage job posts', count: null, action: () => {} }
          ]
        };
      
      case 'hiring':
        return {
          title: 'Hiring tools',
          items: [
            { icon: '✏️', label: 'Post a job', count: null, action: () => onNavigate('create_job') },
            { icon: '📋', label: 'Manage job posts', count: null, action: () => {} },
            { icon: '👥', label: 'Candidate search', count: null, action: () => {} },
            { icon: '📊', label: 'Hiring insights', count: null, action: () => {} },
            { icon: '💼', label: 'Company page', count: null, action: () => onNavigate('companies_directory') }
          ]
        };
    }
  };

  // LinkedIn-style main content based on context
  const getMainContent = () => {
    switch (contextMode) {
      case 'networking':
        return (
          <div className="space-y-6">
            {/* Post creation */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-4">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                <button className="flex-1 text-left px-4 py-2 border border-gray-300 rounded-full text-gray-500 hover:bg-gray-50">
                  Start a post
                </button>
              </div>
              <div className="flex justify-between">
                <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                  <span>📹</span>
                  <span>Video</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded">
                  <span>📷</span>
                  <span>Photo</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded">
                  <span>📝</span>
                  <span>Write article</span>
                </button>
              </div>
            </div>

            {/* Feed */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your professional network</h3>
                <p className="text-gray-600">Connect and engage with professionals in your industry</p>
              </div>
            </div>
          </div>
        );

      case 'job_seeking':
        return (
          <div className="space-y-6">
            {/* Job recommendations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Top job picks for you</h2>
                <button className="text-blue-600 hover:underline text-sm">Show all →</button>
              </div>
              <p className="text-gray-600 text-sm mb-6">Based on your profile, preferences, and activity like applies, searches, and saves</p>
              
              <div className="space-y-4">
                {[
                  { title: 'Senior Back End Engineer', company: 'ELife', location: 'Nigeria (Remote)', promoted: true },
                  { title: 'AI Backend Engineer', company: 'Sproxil', location: 'Lagos (Hybrid)', promoted: false },
                  { title: 'DevOps Engineer', company: 'Odixcity Consulting', location: 'Nigeria (Remote)', salary: '$11.4k/yr - $12k/yr', promoted: false }
                ].map((job, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🏢</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                        {job.salary && <p className="text-gray-600 text-sm">{job.salary}</p>}
                        {job.promoted && <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1">Promoted</span>}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent searches */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent job searches</h3>
                <button className="text-blue-600 hover:underline text-sm">Clear</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">💼</span>
                  <div>
                    <p className="font-medium text-gray-900">Software Engineer</p>
                    <p className="text-gray-600 text-sm">Garki I, Federal Capital Territory, Nigeria</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">⚙️</span>
                  <div>
                    <p className="font-medium text-gray-900">backend developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hiring':
        return (
          <div className="space-y-6">
            {/* Hiring dashboard */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Hiring Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
                  <div className="text-gray-600">Active Job Posts</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">45</div>
                  <div className="text-gray-600">New Applications</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
                  <div className="text-gray-600">Interviews Scheduled</div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => onNavigate('create_job')}
                  className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-2xl">✏️</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Post a New Job</div>
                    <div className="text-gray-600 text-sm">Reach qualified candidates</div>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl">🔍</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Search Candidates</div>
                    <div className="text-gray-600 text-sm">Find talent proactively</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  // LinkedIn-style right sidebar
  const getRightSidebar = () => {
    return (
      <div className="space-y-6">
        {/* Context switcher */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Switch Context</h3>
          <div className="space-y-2">
            {[
              { id: 'networking', label: 'Networking', icon: '🤝' },
              { id: 'job_seeking', label: 'Job Seeking', icon: '💼' },
              { id: 'hiring', label: 'Hiring', icon: '👥' }
            ].map((context) => (
              <button
                key={context.id}
                onClick={() => setContextMode(context.id as any)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded text-sm ${
                  contextMode === context.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{context.icon}</span>
                <span>{context.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's puzzle (LinkedIn-style engagement) */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Today's puzzle</h3>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-xl">🧩</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">2 in - a quick brain teaser</p>
              <p className="text-gray-600 text-sm">Solve in 60s or less!</p>
            </div>
          </div>
        </div>

        {/* Add to your feed */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Add to your feed</h3>
          <div className="space-y-3">
            {[
              { name: 'Kevin Ray', title: 'Software Engineer, DevOps Learning', followers: '56k+' },
              { name: 'The Assembly City', title: 'Company • Technology, Information and Internet', followers: '12k+' },
              { name: 'Nagaraju Ramavath', title: 'Design Verification Engineer | RTL Design', followers: '8k+' }
            ].map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{suggestion.name}</p>
                    <p className="text-gray-600 text-xs">{suggestion.title}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-medium">
                  + Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!insights) {
    return <div>Loading...</div>;
  }

  const sidebarContent = getSidebarContent();

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* LinkedIn-style header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-6">
              <div className="text-blue-600 font-bold text-xl">JobHub</div>
              <div className="hidden md:flex items-center space-x-6">
                <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
                  <span className="text-xl">🏠</span>
                  <span className="text-xs">Home</span>
                </button>
                <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
                  <span className="text-xl">👥</span>
                  <span className="text-xs">My Network</span>
                </button>
                <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
                  <span className="text-xl">💼</span>
                  <span className="text-xs">Jobs</span>
                </button>
                <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900">
                  <span className="text-xl">💬</span>
                  <span className="text-xs">Messaging</span>
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">{sidebarContent.title}</h3>
              <div className="space-y-2">
                {sidebarContent.items.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span>{item.icon}</span>
                      <span className="text-gray-700 text-sm">{item.label}</span>
                    </div>
                    {item.count && (
                      <span className="text-gray-500 text-sm">{item.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={contextMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {getMainContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            {getRightSidebar()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInStyleDashboard;