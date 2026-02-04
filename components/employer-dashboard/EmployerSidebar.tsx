import React from 'react';
import { User, Page } from '../../types';
import { EmployerDashboardTab } from '../../pages/EmployerDashboardPage';
import { BriefcaseIcon } from '../../constants';
import { ChartBarIcon, MegaphoneIcon, EnvelopeIcon } from '../../constants';
import { UsersIcon } from '../icons/UsersIcon';
import { GiftIcon } from '../icons/GiftIcon';

interface EmployerSidebarProps {
  user: User;
  activeTab: EmployerDashboardTab;
  setActiveTab: (tab: EmployerDashboardTab) => void;
  onNavigate: (page: Page) => void;
}

const EmployerSidebar: React.FC<EmployerSidebarProps> = ({ user, activeTab, setActiveTab, onNavigate }) => {
  const navItems: { id: EmployerDashboardTab; label: string; icon: React.ReactNode, page?: Page }[] = [
    { id: 'overview', label: 'Dashboard', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'my_jobs', label: 'My Jobs', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { id: 'post_job', label: 'Post New Job', icon: <MegaphoneIcon className="w-5 h-5" /> },
    { id: 'candidates', label: 'Candidates', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'applications', label: 'Applications', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: 'analytics', label: 'Analytics', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: 'messages', label: 'Messages', icon: <EnvelopeIcon className="w-5 h-5" />, page: 'messaging' },
  ];
  
  const handleNavClick = (tab: EmployerDashboardTab, page?: Page) => {
      if (page) {
          onNavigate(page);
      } else {
          setActiveTab(tab);
      }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
      <div className="text-center py-4 border-b border-gray-200">
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-secondary" />
        <h2 className="font-bold text-xl text-neutral-dark">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.headline}</p>
      </div>
      <nav className="space-y-1">
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
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default EmployerSidebar;