import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import MFASettings from './MFASettings';
import { getProfile, updateProfile, deleteAccount, changePassword, ProfileUpdateRequest } from '../../src/api/profileApi';
import { testApiConnection, testAuthenticatedEndpoint } from '../../src/utils/apiTest';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'security' | 'notifications' | 'privacy' | 'account'>('security');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState({
    job_alerts: true,
    application_updates: true,
    company_news: false,
    network_activity: true,
    security_alerts: true,
  });

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the real password change endpoint
      await changePassword({
        currentPassword,
        newPassword
      });
      
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Note: You'll need to add notification preferences to your backend
      console.log('Notification preferences updated:', emailNotifications);
      setSuccess('Notification preferences saved');
    } catch (err) {
      setError('Failed to save notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteAccount();
      // Redirect to home page after successful deletion
      window.location.href = '/';
    } catch (err) {
      setError('Failed to delete account');
      setLoading(false);
    }
  };

  const handleApiTest = async () => {
    console.log('=== API Connection Test ===');
    
    // Test basic connection
    const basicTest = await testApiConnection();
    console.log('Basic connection test:', basicTest);
    
    // Test authenticated endpoint
    const authTest = await testAuthenticatedEndpoint();
    console.log('Authenticated endpoint test:', authTest);
    
    if (authTest.success) {
      setSuccess('API connection successful! Check console for details.');
    } else {
      setError(`API connection failed: ${authTest.error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security settings</p>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'security', label: 'Security & Privacy', icon: '🔒' },
              { id: 'notifications', label: 'Notifications', icon: '🔔' },
              { id: 'privacy', label: 'Privacy', icon: '👁️' },
              { id: 'account', label: 'Account', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{tab.icon}</span>
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Security & Privacy Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* MFA Settings */}
              <MFASettings />

              {/* Password Settings */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Keep your account secure with a strong password
                </p>
                
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                      minLength={8}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                      minLength={8}
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Login Activity */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Login Activity</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Current Session</p>
                        <p className="text-sm text-gray-600">Today at {new Date().toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Previous Session</p>
                        <p className="text-sm text-gray-600">Yesterday at 3:45 PM</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">Ended</span>
                  </div>
                </div>
              </div>
              {/* API Debug Section */}
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Debug</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Test connection to your backend server
                </p>
                
                <button 
                  onClick={handleApiTest}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Test API Connection
                </button>
                
                <div className="mt-4 text-xs text-gray-500">
                  <p>Backend URL: {process.env.REACT_APP_API_URL || 'http://localhost:8084/api/v1'}</p>
                  <p>Token: {localStorage.getItem('accessToken') ? 'Present' : 'Missing'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose what email notifications you'd like to receive
                </p>
                
                <div className="space-y-4">
                  {[
                    { id: 'job_alerts', label: 'Job Recommendations', description: 'Get notified about jobs that match your profile' },
                    { id: 'application_updates', label: 'Application Updates', description: 'Updates on your job applications' },
                    { id: 'company_news', label: 'Company Updates', description: 'News from companies you follow' },
                    { id: 'network_activity', label: 'Network Activity', description: 'Updates from your professional network' },
                    { id: 'security_alerts', label: 'Security Alerts', description: 'Important security notifications' }
                  ].map((notification) => (
                    <label key={notification.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        checked={emailNotifications[notification.id as keyof typeof emailNotifications]}
                        onChange={(e) => setEmailNotifications(prev => ({
                          ...prev,
                          [notification.id]: e.target.checked
                        }))}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{notification.label}</p>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                
                <button 
                  onClick={handleNotificationUpdate}
                  disabled={loading}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Notification Preferences'}
                </button>
              </div>

              {/* Push Notifications */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Notifications</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get instant notifications in your browser
                </p>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                    <span className="text-gray-700">Enable browser notifications</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                    <span className="text-gray-700">New message notifications</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                    <span className="text-gray-700">Job match notifications</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* Profile Visibility */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Visibility</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Control who can see your profile and information
                </p>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Show profile in search results</p>
                      <p className="text-sm text-gray-600">Allow recruiters and employers to find your profile</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Allow recruiter contact</p>
                      <p className="text-sm text-gray-600">Let recruiters send you messages about opportunities</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Public profile</p>
                      <p className="text-sm text-gray-600">Make your profile visible to anyone on the internet</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Data & Privacy */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Privacy</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-900 mb-1">Download your data</p>
                    <p className="text-sm text-gray-600 mb-3">Get a copy of all your data including profile, applications, and activity</p>
                    <button className="text-primary hover:text-primary-dark font-medium text-sm">
                      Request data export
                    </button>
                  </div>
                  
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-900 mb-1">Delete account</p>
                    <p className="text-sm text-gray-600 mb-3">Permanently delete your account and all associated data</p>
                    <button 
                      onClick={handleAccountDeletion}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Deleting...' : 'Delete account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="email"
                        value={user.email || 'user@example.com'}
                        disabled
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                      <button className="px-4 py-2 text-primary hover:text-primary-dark font-medium text-sm">
                        Change
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <input
                      type="text"
                      value="Job Seeker"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={new Date().toLocaleDateString()}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Subscription & Billing */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
                
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">Free Plan</p>
                      <p className="text-sm text-gray-600">Basic job search features</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ Job search and applications</p>
                    <p>✓ Basic profile features</p>
                    <p>✓ Company following</p>
                  </div>
                  
                  <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;