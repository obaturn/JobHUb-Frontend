
import React, { useState, useEffect } from 'react';
import { BriefcaseIcon, EnvelopeIcon } from '../constants';
import { User, Notification, Page } from '../types';
import { BellIcon } from './icons/BellIcon';
import NotificationPanel from './notifications/NotificationPanel';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    isAuthenticated: boolean;
    onLogout: () => void;
    user: User | null;
    userType: 'new_user' | 'job_seeker' | 'employer' | 'admin' | null;
    notifications: Notification[];
    onMarkAllRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isAuthenticated, onLogout, user, userType, notifications, onMarkAllRead }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
    applyTheme(savedTheme || 'dark');
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
    } else {
      root.classList.add(newTheme);
      root.style.colorScheme = newTheme;
    }
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navLinks = [
      { name: 'Home', page: 'landing' as Page },
      { name: 'Find Jobs', page: 'job_search' as Page },
      { name: 'Companies', page: 'job_search' as Page },
      { name: 'About', page: 'about' as Page },
  ];

  const handleDashboardClick = () => {
    if (userType === 'employer') {
        onNavigate('employer_dashboard');
    } else if (userType === 'admin') {
        onNavigate('admin_dashboard');
    } else {
        onNavigate('job_seeker_dashboard');
    }
  };
  
  const handleNotificationsToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsNotificationsOpen(prev => !prev);
  }

  // Defensive display name (some user objects may be missing `name` at runtime)
  const displayName = user ? ((user.name || user.email || 'User').split(' ')[0]) : 'User';

  return (
    <header className="bg-white/95 dark:bg-neutral-dark/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => onNavigate('landing')} className="flex items-center space-x-2 text-primary">
              <BriefcaseIcon className="w-8 h-8" />
              <span className="text-2xl font-bold">JobHub</span>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-8">
             {navLinks.map((link) => (
               <button key={link.name} onClick={() => onNavigate(link.page)} className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200 font-medium">
                 {link.name}
               </button>
             ))}
           </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-5">
                <button onClick={() => onNavigate('messaging')} className="relative text-gray-500 hover:text-primary transition-colors">
                  <EnvelopeIcon className="w-6 h-6" />
                </button>
                <div className="relative">
                    <button onClick={handleNotificationsToggle} className="relative text-gray-500 hover:text-primary transition-colors">
                      <BellIcon className="w-6 h-6" />
                      {unreadCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
                    </button>
                    {isNotificationsOpen && <NotificationPanel notifications={notifications} onMarkAllRead={onMarkAllRead} onClose={() => setIsNotificationsOpen(false)} />}
                </div>

                <div className="h-8 w-px bg-gray-200" />

                 <button onClick={handleDashboardClick} className="flex items-center space-x-2 group">
                   <img src={user.avatar} alt="User avatar" className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-primary transition-colors"/>
                   <span className="font-medium text-gray-600 group-hover:text-primary">{displayName}</span>
                 </button>
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-primary font-medium transition-colors duration-200"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors duration-200 mr-4">
                  {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🖥️'}
                </button>
                <button onClick={() => onNavigate('login')} className="text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors duration-200">
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 bg-primary text-white rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all duration-200"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isMenuOpen ? 'M4 6h16M4 12h16M4 18h16' : 'M6 18L18 6M6 6l12 12'} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
               <button key={link.name} onClick={() => { onNavigate(link.page); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                {link.name}
              </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="px-5 flex flex-col space-y-3">
               {isAuthenticated && user ? (
                 <>
                    <button onClick={() => { handleDashboardClick(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                        My Dashboard
                    </button>
                    <button onClick={() => { onNavigate('messaging'); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                        Messages
                    </button>
                    <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                        Log Out
                    </button>
                 </>
               ) : (
                 <>
                    <button onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} className="w-full text-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-primary font-medium transition-colors duration-200">
                        Log In
                    </button>
                    <button onClick={() => { onNavigate('signup'); setIsMenuOpen(false); }} className="w-full text-center px-4 py-2 bg-primary text-white rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all duration-200">
                        Sign Up
                    </button>
                 </>
               )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;