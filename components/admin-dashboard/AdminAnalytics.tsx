import React from 'react';
import AdminStatCard from './AdminStatCard';
import { UsersIcon } from '../icons/UsersIcon';
import { BriefcaseIcon } from '../../constants';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { FlagIcon } from '../icons/FlagIcon';
import { MOCK_ALL_USERS, MODERATION_JOBS, EMPLOYER_APPLICATIONS } from '../../constants';

const AdminAnalytics: React.FC = () => {
    const totalUsers = MOCK_ALL_USERS.length;
    const activeJobs = MODERATION_JOBS.filter(j => j.status === 'Published').length;
    const totalApplications = EMPLOYER_APPLICATIONS.length;
    const pendingReports = MODERATION_JOBS.filter(j => j.status === 'Pending Approval' || j.status === 'Flagged').length;
    const recentUsers = MOCK_ALL_USERS.slice(-5).reverse();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-neutral-dark">Platform Analytics</h1>
                <p className="text-gray-500 mt-1">An overview of your platform's health and activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard icon={<UsersIcon className="w-6 h-6 text-primary"/>} value={totalUsers} label="Total Users" />
                <AdminStatCard icon={<BriefcaseIcon className="w-6 h-6 text-green-600"/>} value={activeJobs} label="Active Jobs" />
                <AdminStatCard icon={<DocumentTextIcon className="w-6 h-6 text-indigo-600"/>} value={totalApplications} label="Total Applications" />
                <AdminStatCard icon={<FlagIcon className="w-6 h-6 text-orange-600"/>} value={pendingReports} label="Pending Reports" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-bold text-lg text-neutral-dark mb-4">User Growth</h3>
                    <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        Line Chart Placeholder
                    </div>
                </div>
                 <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-bold text-lg text-neutral-dark mb-4">Job Postings by Category</h3>
                     <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        Bar Chart Placeholder
                    </div>
                </div>
            </div>
            
             {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                     <h3 className="font-bold text-lg text-neutral-dark">Recent Activity</h3>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Activity</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map(user => (
                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                            <p className="font-bold">{user.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-green-600 font-semibold">New User Registration</span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.createdDate || Date.now()).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
