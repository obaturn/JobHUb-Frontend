import React from 'react';
import { User } from '../../types';
import { AdminDashboardTab } from '../../pages/AdminDashboardPage';
import { BriefcaseIcon, ChartBarIcon } from '../../constants';
import { UsersIcon } from '../icons/UsersIcon';

interface AdminSidebarProps {
  user: User;
  activeTab: AdminDashboardTab;
  setActiveTab: (tab: AdminDashboardTab) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ user, activeTab, setActiveTab }) => {
  const navItems: { id: AdminDashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'analytics', label: 'Analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'user_management', label: 'User Management', icon: <UsersIcon className="w-5 h-5" /> },
    { id: 'job_moderation', label: 'Job Moderation', icon: <BriefcaseIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
      <div className="text-center py-4 border-b border-gray-200">
        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-2 border-4 border-alert" />
        <h2 className="font-bold text-xl text-neutral-dark">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.headline}</p>
      </div>
      <nav className="mt-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === item.id
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

export default AdminSidebar;