import React, { useState } from 'react';
import { User, Job, Page } from '../types';
import EmployerSidebar from '../components/employer-dashboard/EmployerSidebar';
import EmployerOverview from '../components/employer-dashboard/EmployerOverview';
import MyJobs from '../components/employer-dashboard/MyJobs';
import EmployerApplications from '../components/employer-dashboard/EmployerApplications';
import Referrals from '../components/dashboard/Referrals';


interface EmployerDashboardPageProps {
  user: User;
  employerJobs: Job[];
  onViewJobDetails: (job: Job) => void;
  onNavigate: (page: Page) => void;
}

export type EmployerDashboardTab = 'overview' | 'my_jobs' | 'applications' | 'messages' | 'referrals';

const EmployerDashboardPage: React.FC<EmployerDashboardPageProps> = ({ user, employerJobs, onViewJobDetails, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<EmployerDashboardTab>('overview');

  const renderContent = () => {
    switch(activeTab) {
        case 'overview':
            return <EmployerOverview user={user} onViewJobDetails={onViewJobDetails} setActiveTab={setActiveTab} />;
        case 'my_jobs':
            return <MyJobs jobs={employerJobs} onViewJobDetails={onViewJobDetails} onNavigate={onNavigate} />;
        case 'applications':
            return <EmployerApplications />;
        case 'referrals':
            return <Referrals user={user} />;
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