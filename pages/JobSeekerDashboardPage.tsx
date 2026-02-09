

import React, { useState, useEffect } from 'react';
import { User, Application, Job, SavedSearch, Resume, JobSeekerDashboardTab, CompletedAssessment, UserPost, ConnectionRequest } from '../types';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import MyApplications from '../components/dashboard/MyApplications';
import SavedJobs from '../components/dashboard/SavedJobs';
import MyProfile from '../components/dashboard/MyProfile';
import Settings from '../components/dashboard/Settings';
import SavedSearches from '../components/dashboard/SavedSearches';
import ResumeManagement from '../components/dashboard/ResumeManagement';
import { EyeIcon } from '../components/icons/EyeIcon';
import { DocumentTextIcon } from '../components/icons/DocumentTextIcon';
import { BookmarkIcon } from '../components/icons/BookmarkIcon';
import { BellIcon } from '../components/icons/BellIcon';
import { UserCircleIcon } from '../components/icons/UserCircleIcon';
import { DocumentDuplicateIcon } from '../components/icons/DocumentDuplicateIcon';
import { EnvelopeIcon, BriefcaseIcon } from '../constants';
import SkillAssessments from '../components/dashboard/SkillAssessments';
import { AcademicCapIcon } from '../components/icons/AcademicCapIcon';
import CareerPathExplorer from '../components/dashboard/CareerPathExplorer';
import { ArrowTrendingUpIcon } from '../components/icons/ArrowTrendingUpIcon';
import Referrals from '../components/dashboard/Referrals';
import { GiftIcon } from '../components/icons/GiftIcon';
import InterviewPractice from '../components/dashboard/InterviewPractice';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import MyNetwork from '../components/dashboard/MyNetwork';
import CompanyFollowing from '../components/dashboard/CompanyFollowing';
import { BehaviorAnalyzer, BehaviorInsights } from '../src/utils/behaviorAnalytics';
import { useBehaviorTracking } from '../src/hooks/useBehaviorTracking';
import { motion, AnimatePresence } from 'framer-motion';

interface JobSeekerDashboardPageProps {
  user: User;
  applications: Application[];
  savedJobs: Job[];
  savedSearches: SavedSearch[];
  resumes: Resume[];
  completedAssessments: CompletedAssessment[];
  posts: UserPost[];
  connectionRequests: ConnectionRequest[];
  jobToPractice: Job | null;
  onNavigate: (page: 'job_search' | 'messaging') => void;
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
  onDeleteSearch: (searchId: string) => void;
  onUploadResume: (fileName: string, fileContent: string) => void;
  onDeleteResume: (resumeId: string) => void;
  onSetPrimaryResume: (resumeId: string) => void;
  onCompleteAssessment: (assessment: CompletedAssessment) => void;
  onCreatePost: (content: string) => void;
  onConnectionRequestAction: (requestId: string, action: 'accept' | 'ignore') => void;
  onPracticeHandled: () => void;
  // Add missing critical handlers
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onFollowCompany: (companyId: string) => void;
  onUnfollowCompany: (companyId: string) => void;
}

const JobSeekerDashboardPage: React.FC<JobSeekerDashboardPageProps> = ({ 
  user, 
  applications, 
  savedJobs, 
  savedSearches, 
  resumes, 
  completedAssessments, 
  posts, 
  connectionRequests, 
  jobToPractice, 
  onNavigate, 
  onViewJobDetails, 
  onViewCompanyProfile, 
  onDeleteSearch, 
  onUploadResume, 
  onDeleteResume, 
  onSetPrimaryResume, 
  onCompleteAssessment, 
  onCreatePost, 
  onConnectionRequestAction, 
  onPracticeHandled,
  onApplyJob,
  onSaveJob,
  onFollowCompany,
  onUnfollowCompany
}) => {
  const [activeTab, setActiveTab] = useState<JobSeekerDashboardTab>('overview');
  const [behaviorInsights, setBehaviorInsights] = useState<BehaviorInsights | null>(null);
  const [contextMode, setContextMode] = useState<'job_seeking' | 'networking' | 'skill_building'>('job_seeking');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Initialize behavior tracking
  const behaviorTracker = useBehaviorTracking(user.id);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 8;
    
    if (user.name && user.name !== 'User') completed++;
    if (user.headline) completed++;
    if (user.about) completed++;
    if (user.location) completed++;
    if (user.avatar && user.avatar !== 'https://picsum.photos/seed/default/200/200') completed++;
    if (user.skills && user.skills.length > 0) completed++;
    if (user.experience && user.experience.length > 0) completed++;
    if (user.education && user.education.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // Determine which navigation items need user attention
  const getNeedsAttention = (itemId: string): boolean => {
    switch (itemId) {
      case 'profile':
        return calculateProfileCompletion() < 70;
      case 'my_network':
        return connectionRequests.length > 0;
      case 'saved_jobs':
        return savedJobs.length > 0 && applications.length < savedJobs.length;
      case 'applications':
        return applications.some(app => app.status === 'interview_scheduled');
      default:
        return false;
    }
  };

  // Get contextual quick actions based on profile completion and user behavior
  const getQuickActions = () => {
    const actions = [];
    const completion = calculateProfileCompletion();
    
    if (completion < 70) {
      actions.push({
        label: 'Complete Profile',
        icon: <UserCircleIcon className="w-4 h-4" />,
        onClick: () => setActiveTab('profile')
      });
    }
    
    if (applications.length === 0) {
      actions.push({
        label: 'Find Jobs',
        icon: <BriefcaseIcon className="w-4 h-4" />,
        onClick: () => onNavigate('job_search')
      });
    }
    
    if (savedJobs.length > 0 && applications.length < savedJobs.length) {
      actions.push({
        label: 'Apply to Saved Jobs',
        icon: <DocumentTextIcon className="w-4 h-4" />,
        onClick: () => setActiveTab('saved_jobs')
      });
    }
    
    if (connectionRequests.length > 0) {
      actions.push({
        label: 'Review Connections',
        icon: <UsersIcon className="w-4 h-4" />,
        onClick: () => setActiveTab('my_network')
      });
    }
    
    return actions.slice(0, 3); // Limit to 3 actions to avoid clutter
  };

  useEffect(() => {
    if (jobToPractice) {
      setActiveTab('interview_practice');
    }
  }, [jobToPractice]);

  const handleNavClick = (tab: JobSeekerDashboardTab, page?: 'messaging') => {
      // Track navigation behavior
      behaviorTracker.trackAction('navigate_dashboard', { tab, page });
      
      if (page) {
          onNavigate(page);
      } else {
          setActiveTab(tab);
      }
  };

  // Enhanced navigation items with behavioral intelligence
  const getNavItems = () => {
    const baseItems = [
      { id: 'overview', label: 'For You', icon: <EyeIcon />, priority: 1 },
      { id: 'my_network', label: 'My Network', count: connectionRequests.length, icon: <UsersIcon />, priority: contextMode === 'networking' ? 2 : 5 },
      { id: 'companies', label: 'Companies', icon: <BriefcaseIcon />, priority: contextMode === 'job_seeking' ? 3 : 6 },
      { id: 'applications', label: 'My Applications', count: applications.length, icon: <DocumentTextIcon />, priority: contextMode === 'job_seeking' ? 2 : 4 },
      { id: 'saved_jobs', label: 'Saved Jobs', count: savedJobs.length, icon: <BookmarkIcon />, priority: contextMode === 'job_seeking' ? 3 : 6 },
      { id: 'messages', label: 'Messages', icon: <EnvelopeIcon />, page: 'messaging' as const, priority: contextMode === 'networking' ? 3 : 7 },
      { id: 'interview_practice', label: 'Interview Practice', icon: <MicrophoneIcon />, priority: contextMode === 'job_seeking' ? 4 : 8 },
      { id: 'skill_assessments', label: 'Skill Assessments', icon: <AcademicCapIcon />, priority: contextMode === 'skill_building' ? 2 : 9 },
      { id: 'career_explorer', label: 'Career Path Explorer', icon: <ArrowTrendingUpIcon />, priority: contextMode === 'skill_building' ? 3 : 10 },
      { id: 'referrals', label: 'Referrals', icon: <GiftIcon />, priority: 11 },
      { id: 'saved_searches', label: 'Saved Searches', count: savedSearches.length, icon: <BellIcon />, priority: 12 },
      { id: 'resume_management', label: 'Resume Management', icon: <DocumentDuplicateIcon />, priority: contextMode === 'job_seeking' ? 5 : 13 },
      { id: 'profile', label: 'My Profile', icon: <UserCircleIcon />, priority: 14 },
      { id: 'settings', label: 'Settings', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, priority: 15 },
    ];

    // Sort by priority and show most relevant items first
    return baseItems.sort((a, b) => a.priority - b.priority);
  };

  // Get personalized welcome message based on behavior
  const getWelcomeMessage = () => {
    if (!behaviorInsights) return `Welcome back, ${user.name?.split(' ')[0] || 'User'}!`;
    
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                     new Date().getHours() < 18 ? 'afternoon' : 'evening';
    
    switch (behaviorInsights.primaryIntent) {
      case 'job_seeking':
        return `Good ${timeOfDay}, ${user.name?.split(' ')[0] || 'User'}! Ready to find your next opportunity?`;
      case 'networking':
        return `Good ${timeOfDay}, ${user.name?.split(' ')[0] || 'User'}! Let's grow your professional network.`;
      case 'mixed':
        return `Good ${timeOfDay}, ${user.name?.split(' ')[0] || 'User'}! What would you like to focus on today?`;
      default:
        return `Good ${timeOfDay}, ${user.name?.split(' ')[0] || 'User'}! Let's advance your career.`;
    }
  };

  const navItems = getNavItems();
  
  const renderContent = () => {
    switch(activeTab) {
        case 'overview':
            return <DashboardOverview 
                        user={user} 
                        posts={posts}
                        resumes={resumes}
                        onCreatePost={onCreatePost}
                        applications={applications}
                        savedJobs={savedJobs}
                        setActiveTab={setActiveTab}
                        onViewJobDetails={onViewJobDetails}
                        onViewCompanyProfile={onViewCompanyProfile}
                        onViewProfile={(userId) => {
                            // For now, just log - in real app would navigate to user profile
                            console.log('View profile:', userId);
                        }}
                        onApplyJob={(job) => {
                            // Track job application behavior
                            behaviorTracker.trackJobApplication(job.id);
                            // Actually apply for the job
                            onApplyJob(job);
                        }}
                        onSaveJob={(job) => {
                            // Track job save behavior  
                            behaviorTracker.trackAction('save_job_from_feed', { jobId: job.id });
                            // Actually save the job
                            onSaveJob(job);
                        }}
                        onFollowCompany={(companyId) => {
                            // Track company follow behavior
                            behaviorTracker.trackAction('follow_company', { companyId });
                            // Actually follow the company
                            onFollowCompany(companyId);
                        }}
                    />;
        case 'my_network':
            return <MyNetwork requests={connectionRequests} onAction={onConnectionRequestAction} />;
        case 'companies':
            return <CompanyFollowing 
                        user={user}
                        onViewCompanyProfile={onViewCompanyProfile}
                        onFollowCompany={(companyId) => {
                            behaviorTracker.trackAction('follow_company', { companyId });
                            onFollowCompany(companyId);
                        }}
                        onUnfollowCompany={(companyId) => {
                            behaviorTracker.trackAction('unfollow_company', { companyId });
                            onUnfollowCompany(companyId);
                        }}
                    />;
        case 'applications':
            return <MyApplications applications={applications} onViewJobDetails={onViewJobDetails} onViewCompanyProfile={onViewCompanyProfile} />;
        case 'saved_jobs':
            return <SavedJobs savedJobs={savedJobs} onViewJobDetails={onViewJobDetails} onViewCompanyProfile={onViewCompanyProfile} />;
        case 'saved_searches':
            return <SavedSearches savedSearches={savedSearches} onDelete={onDeleteSearch} onNavigate={onNavigate} />;
        case 'resume_management':
            return <ResumeManagement resumes={resumes} onUpload={onUploadResume} onDelete={onDeleteResume} onSetPrimary={onSetPrimaryResume} />;
        case 'skill_assessments':
            return <SkillAssessments completedAssessments={completedAssessments} onCompleteAssessment={onCompleteAssessment} />;
        case 'interview_practice':
            return <InterviewPractice appliedJobs={applications.map(a => a.job)} savedJobs={savedJobs} jobToPractice={jobToPractice} onPracticeHandled={onPracticeHandled} />;
        case 'career_explorer':
            return <CareerPathExplorer />;
        case 'referrals':
            return <Referrals user={user} />;
        case 'profile':
            return <MyProfile initialUser={user} />;
        case 'settings':
            return <Settings user={user} />;
        default:
            return null;
    }
  };

  return (
    <div className="bg-neutral-light min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Enhanced Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 lg:mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {getWelcomeMessage()}
              </h1>
              
              {/* Profile Completion Progress */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${calculateProfileCompletion()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {calculateProfileCompletion()}% complete
                </span>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                {getQuickActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Activity Summary */}
            <div className="flex lg:flex-col gap-4 lg:gap-2 text-center lg:text-right">
              <div className="flex-1 lg:flex-none">
                <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                <div className="text-xs text-gray-500">Applications</div>
              </div>
              <div className="flex-1 lg:flex-none">
                <div className="text-2xl font-bold text-green-600">{savedJobs.length}</div>
                <div className="text-xs text-gray-500">Saved Jobs</div>
              </div>
              <div className="flex-1 lg:flex-none">
                <div className="text-2xl font-bold text-purple-600">{connectionRequests.length}</div>
                <div className="text-xs text-gray-500">Connections</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile-First Layout - With Left Sidebar Restored */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Mobile: Main Content First */}
          <div className="lg:col-span-3 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left Sidebar - Profile & Navigation (RESTORED) */}
          <aside className="lg:col-span-1 lg:order-1">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatar || 'https://picsum.photos/seed/default/200/200'} 
                    alt={user.name || 'User'} 
                    className="w-10 h-10 rounded-full border-2 border-primary" 
                  />
                  <div>
                    <h2 className="font-bold text-sm text-neutral-dark">{user.name || 'User'}</h2>
                    <p className="text-xs text-gray-500 line-clamp-1">{user.headline || 'Professional'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Sidebar / Mobile Menu */}
            <div className={`bg-white rounded-lg shadow-md p-4 sticky top-20 ${isMenuOpen ? 'block' : 'hidden lg:block'}`}>
              {/* Desktop Profile Section */}
              <div className="hidden lg:block text-center py-4 border-b border-gray-200 mb-4">
                <div className="relative inline-block">
                  <img 
                    src={user.avatar || 'https://picsum.photos/seed/default/200/200'} 
                    alt={user.name || 'User'} 
                    className="w-20 h-20 rounded-full mx-auto mb-3 border-3 border-gray-200" 
                  />
                  {/* Profile completion ring */}
                  <div className="absolute -inset-1">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - calculateProfileCompletion() / 100)}`}
                        className="text-blue-500 transition-all duration-500"
                      />
                    </svg>
                  </div>
                </div>
                
                <h2 className="font-bold text-lg text-neutral-dark mb-1">{user.name || 'User'}</h2>
                <p className="text-sm text-gray-500 mb-2">{user.headline || 'Complete your profile to get started'}</p>
                
                {/* Profile completion status */}
                <div className="text-xs text-gray-600 mb-3">
                  Profile {calculateProfileCompletion()}% complete
                  {calculateProfileCompletion() < 100 && (
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="block w-full mt-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Complete your profile →
                    </button>
                  )}
                </div>
                
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-blue-600">{applications.length}</div>
                    <div className="text-xs text-blue-500">Applied</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-green-600">{savedJobs.length}</div>
                    <div className="text-xs text-green-500">Saved</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-purple-600">{user.skills?.length || 0}</div>
                    <div className="text-xs text-purple-500">Skills</div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-1">
                <AnimatePresence>
                  {navItems.map((item, index) => {
                    const isActive = activeTab === item.id && !item.page;
                    const needsAttention = getNeedsAttention(item.id);
                    
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          handleNavClick(item.id, item.page);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 text-left px-3 lg:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        } ${needsAttention ? 'ring-1 ring-orange-200 bg-orange-50' : ''}`}
                      >
                        <div className="relative">
                          {React.cloneElement(item.icon, { 
                            className: `w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : ''}` 
                          })}
                          {needsAttention && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                          )}
                        </div>
                        
                        <span className="flex-grow text-xs lg:text-sm">{item.label}</span>
                        
                        <div className="flex items-center gap-1">
                          {item.count !== undefined && item.count > 0 && (
                            <span className={`px-1.5 lg:px-2 py-0.5 rounded-full text-xs font-semibold ${
                              isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {item.count}
                            </span>
                          )}
                          
                          {item.priority <= 3 && !isActive && (
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-60"></div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboardPage;