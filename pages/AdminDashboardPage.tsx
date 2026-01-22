import React, { useState } from 'react';
import { User } from '../types';
import AdminSidebar from '../components/admin-dashboard/AdminSidebar';
import JobModeration from '../components/admin-dashboard/JobModeration';
import UserManagement from '../components/admin-dashboard/UserManagement';
import AdminAnalytics from '../components/admin-dashboard/AdminAnalytics';

export type AdminDashboardTab = 'job_moderation' | 'user_management' | 'analytics';

interface AdminDashboardPageProps {
  user: User;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminDashboardTab>('analytics');

  const renderContent = () => {
    switch(activeTab) {
        case 'analytics':
            return <AdminAnalytics />;
        case 'user_management':
            return <UserManagement />;
        case 'job_moderation':
            return <JobModeration />;
        default:
            return <AdminAnalytics />;
    }
  };

  return (
    <div className="bg-neutral-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <AdminSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
          </aside>
          <section className="lg:col-span-3">
            {renderContent()}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;