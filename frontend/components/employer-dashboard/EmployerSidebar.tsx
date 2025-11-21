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
    { id: 'applications', label: 'Applications', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <EnvelopeIcon className="w-5 h-5" />, page: 'messaging' },
    { id: 'referrals', label: 'Referrals', icon: <GiftIcon className="w-5 h-5" /> },
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
      <div className="my-4">
        <button 
            onClick={() => onNavigate('create_job')}
            className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <MegaphoneIcon className="w-5 h-5" />
          Post a New Job
        </button>
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