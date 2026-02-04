import React, { useState } from 'react';
import { User, Job, Page } from '../types';
import EmployerSidebar from '../components/employer-dashboard/EmployerSidebar';
import EmployerOverview from '../components/employer-dashboard/EmployerOverview';
import MyJobs from '../components/employer-dashboard/MyJobs';
import EmployerApplications from '../components/employer-dashboard/EmployerApplications';
import CandidateManagement from '../components/employer-dashboard/CandidateManagement';
import JobPostingForm from '../components/employer-dashboard/JobPostingForm';

interface EmployerDashboardPageProps {
  user: User;
  employerJobs: Job[];
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  onNavigate: (page: Page) => void;
}

export type EmployerDashboardTab = 'overview' | 'my_jobs' | 'post_job' | 'candidates' | 'applications' | 'analytics' | 'messages';

const EmployerDashboardPage: React.FC<EmployerDashboardPageProps> = ({ 
  user, 
  employerJobs, 
  onViewJobDetails, 
  onViewCompanyProfile,
  onApplyJob,
  onSaveJob,
  onNavigate 
}) => {
  const [activeTab, setActiveTab] = useState<EmployerDashboardTab>('overview');

  const handleJobPost = (jobData: Partial<Job>) => {
    // In real app, this would call an API to create the job
    console.log('Creating job:', jobData);
    setActiveTab('my_jobs');
  };

  const handleCandidateAction = (candidateId: string, action: string, data?: any) => {
    // In real app, this would call appropriate APIs
    console.log(`Candidate ${candidateId} action: ${action}`, data);
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'overview':
            return <EmployerOverview 
                      user={user} 
                      onViewJobDetails={onViewJobDetails} 
                      onViewCompanyProfile={onViewCompanyProfile}
                      onApplyJob={onApplyJob}
                      onSaveJob={onSaveJob}
                      setActiveTab={setActiveTab} 
                   />;
        case 'my_jobs':
            return <MyJobs jobs={employerJobs} onViewJobDetails={onViewJobDetails} onNavigate={onNavigate} />;
        case 'post_job':
            return <JobPostingForm 
                      onSubmit={handleJobPost}
                      onCancel={() => setActiveTab('my_jobs')}
                   />;
        case 'candidates':
            return <CandidateManagement 
                      jobs={employerJobs}
                      onViewCandidate={(id) => handleCandidateAction(id, 'view')}
                      onUpdateCandidateStatus={(id, status) => handleCandidateAction(id, 'update_status', { status })}
                      onScheduleInterview={(id) => handleCandidateAction(id, 'schedule_interview')}
                      onSendMessage={(id) => handleCandidateAction(id, 'send_message')}
                   />;
        case 'applications':
            return <EmployerApplications />;
        case 'analytics':
            return <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                     <h2 className="text-xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                     <p className="text-gray-600">Coming soon - Track your hiring metrics and job performance</p>
                   </div>;
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
            <EmployerSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onNavigate={onNavigate} />
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

export default EmployerDashboardPage;