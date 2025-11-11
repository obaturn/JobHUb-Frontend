

import React, { useState, useEffect } from 'react';
import { User, Application, Job, SavedSearch, Resume, JobSeekerDashboardTab, CompletedAssessment, UserPost, ConnectionRequest } from '../types';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import MyApplications from '../components/dashboard/MyApplications';
import SavedJobs from '../components/dashboard/SavedJobs';
import MyProfile from '../components/dashboard/MyProfile';
import SavedSearches from '../components/dashboard/SavedSearches';
import ResumeManagement from '../components/dashboard/ResumeManagement';
import { EyeIcon } from '../components/icons/EyeIcon';
import { DocumentTextIcon } from '../components/icons/DocumentTextIcon';
import { BookmarkIcon } from '../components/icons/BookmarkIcon';
import { BellIcon } from '../components/icons/BellIcon';
import { UserCircleIcon } from '../components/icons/UserCircleIcon';
import { DocumentDuplicateIcon } from '../components/icons/DocumentDuplicateIcon';
import { EnvelopeIcon } from '../constants';
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
}

const JobSeekerDashboardPage: React.FC<JobSeekerDashboardPageProps> = ({ user, applications, savedJobs, savedSearches, resumes, completedAssessments, posts, connectionRequests, jobToPractice, onNavigate, onViewJobDetails, onViewCompanyProfile, onDeleteSearch, onUploadResume, onDeleteResume, onSetPrimaryResume, onCompleteAssessment, onCreatePost, onConnectionRequestAction, onPracticeHandled }) => {
  const [activeTab, setActiveTab] = useState<JobSeekerDashboardTab>('overview');

  useEffect(() => {
    if (jobToPractice) {
      setActiveTab('interview_practice');
    }
  }, [jobToPractice]);

  const handleNavClick = (tab: JobSeekerDashboardTab, page?: 'messaging') => {
      if (page) {
          onNavigate(page);
      } else {
          setActiveTab(tab);
      }
  };

  const navItems: { id: JobSeekerDashboardTab; label: string; count?: number; icon: React.ReactElement<{ className?: string }>, page?: 'messaging' }[] = [
    { id: 'overview', label: 'For You', icon: <EyeIcon /> },
    { id: 'my_network', label: 'My Network', count: connectionRequests.length, icon: <UsersIcon /> },
    { id: 'applications', label: 'My Applications', count: applications.length, icon: <DocumentTextIcon /> },
    { id: 'saved_jobs', label: 'Saved Jobs', count: savedJobs.length, icon: <BookmarkIcon /> },
    { id: 'messages', label: 'Messages', icon: <EnvelopeIcon />, page: 'messaging' },
    { id: 'interview_practice', label: 'Interview Practice', icon: <MicrophoneIcon /> },
    { id: 'skill_assessments', label: 'Skill Assessments', icon: <AcademicCapIcon /> },
    { id: 'career_explorer', label: 'Career Path Explorer', icon: <ArrowTrendingUpIcon /> },
    { id: 'referrals', label: 'Referrals', icon: <GiftIcon /> },
    { id: 'saved_searches', label: 'Saved Searches', count: savedSearches.length, icon: <BellIcon /> },
    { id: 'resume_management', label: 'Resume Management', icon: <DocumentDuplicateIcon /> },
    { id: 'profile', label: 'My Profile', icon: <UserCircleIcon /> },
  ];
  
  const renderContent = () => {
    switch(activeTab) {
        case 'overview':
            return <DashboardOverview 
                        user={user} 
                        posts={posts}
                        onCreatePost={onCreatePost}
                        applications={applications}
                        savedJobs={savedJobs}
                        setActiveTab={setActiveTab} 
                    />;
        case 'my_network':
            return <MyNetwork requests={connectionRequests} onAction={onConnectionRequestAction} />;
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
        default:
            return null;
    }
  };

  return (
    <div className="bg-neutral-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
              <div className="text-center py-4 border-b border-gray-200">
                <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-primary" />
                <h2 className="font-bold text-xl text-neutral-dark">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.headline}</p>
              </div>
              <nav className="mt-4 space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.page)}
                    className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id && !item.page
                        ? 'bg-blue-100 text-primary'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-neutral-dark'
                    }`}
                  >
                    {React.cloneElement(item.icon, { className: 'w-5 h-5 flex-shrink-0' })}
                    <span className="flex-grow">{item.label}</span>
                    {item.count !== undefined && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            activeTab === item.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                            {item.count}
                        </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Right Content */}
          <section className="lg:col-span-3">
            {renderContent()}
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboardPage;