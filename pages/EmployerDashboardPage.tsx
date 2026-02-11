import React, { useState, useEffect } from 'react';
import { User, Job, Page } from '../types';
import EmployerSidebar from '../components/employer-dashboard/EmployerSidebar';
import EmployerOverview from '../components/employer-dashboard/EmployerOverview';
import MyJobs from '../components/employer-dashboard/MyJobs';
import EmployerApplications from '../components/employer-dashboard/EmployerApplications';
import CandidateManagement from '../components/employer-dashboard/CandidateManagement';
import PostJobForm from '../components/employer/PostJobForm';
import { getEmployerJobs } from '../src/api/jobsApi';
import { getUserApplications } from '../src/api/applicationApi';

interface EmployerDashboardPageProps {
  user: User;
  onNavigate: (page: Page) => void;
}

export type EmployerDashboardTab = 'overview' | 'my_jobs' | 'post_job' | 'candidates' | 'applications' | 'analytics' | 'messages';

const EmployerDashboardPage: React.FC<EmployerDashboardPageProps> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<EmployerDashboardTab>('overview');
  const [employerJobs, setEmployerJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (activeTab === 'my_jobs' || activeTab === 'overview') {
      loadJobs();
    }
  }, [activeTab]);
  
  useEffect(() => {
    if (selectedJobId) {
      loadApplications(selectedJobId);
    }
  }, [selectedJobId]);
  
  const loadJobs = async () => {
    setLoading(true);
    try {
      const result = await getEmployerJobs(user.id);
      setEmployerJobs(result.jobs);
      console.log('✅ Loaded employer jobs:', result.jobs.length);
    } catch (error) {
      console.error('❌ Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadApplications = async (jobId: number) => {
    setLoading(true);
    try {
      const result = await getUserApplications(jobId);
      setApplications(result.applications);
      console.log('✅ Loaded applications:', result.applications.length);
    } catch (error) {
      console.error('❌ Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleJobPosted = () => {
    setActiveTab('my_jobs');
    loadJobs();
  };

  const handleCandidateAction = (candidateId: string, action: string, data?: any) => {
    console.log(`Candidate ${candidateId} action: ${action}`, data);
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'overview':
            return <EmployerOverview 
                      user={user} 
                      jobs={employerJobs}
                      setActiveTab={setActiveTab} 
                   />;
        case 'my_jobs':
            return <MyJobs 
                      jobs={employerJobs} 
                      onNavigate={onNavigate}
                      onViewApplications={(jobId) => {
                        setSelectedJobId(jobId);
                        setActiveTab('applications');
                      }}
                   />;
        case 'post_job':
            return <PostJobForm 
                      onJobPosted={handleJobPosted}
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
            return <EmployerApplications 
                      applications={applications}
                      selectedJobId={selectedJobId}
                      jobs={employerJobs}
                      onBack={() => setActiveTab('my_jobs')}
                   />;
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
            <EmployerSidebar 
              user={user} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onNavigate={onNavigate}
              jobsCount={employerJobs.length}
            />
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
