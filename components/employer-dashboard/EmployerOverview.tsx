import React from 'react';
import { User, Job } from '../../types';
import { EMPLOYER_APPLICATIONS, EMPLOYER_JOBS } from '../../constants';
import { BriefcaseIcon } from '../../constants';
import { UsersIcon } from '../icons/UsersIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EmployerDashboardTab } from '../../pages/EmployerDashboardPage';

interface EmployerOverviewProps {
  user: User;
  onViewJobDetails: (job: Job) => void;
  setActiveTab: (tab: EmployerDashboardTab) => void;
}

const StatCard: React.FC<{ value: string | number; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-neutral-dark">{value}</p>
            <p className="text-gray-500">{label}</p>
        </div>
    </div>
);

const EmployerOverview: React.FC<EmployerOverviewProps> = ({ user, onViewJobDetails, setActiveTab }) => {
    const totalViews = EMPLOYER_JOBS.reduce((acc, job) => acc + (job.viewsCount || 0), 0);
    const totalApplications = EMPLOYER_APPLICATIONS.length;
    const activeJobs = EMPLOYER_JOBS.filter(job => job.status === 'Published').length;
    
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-neutral-dark">Welcome, {user.name.split(' ')[0]}!</h1>
                <p className="text-gray-600 mt-2">Here's what's happening with your job postings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard value={activeJobs} label="Active Jobs" icon={<BriefcaseIcon className="w-6 h-6 text-primary" />} />
                <StatCard value={totalApplications} label="Applications Received" icon={<UsersIcon className="w-6 h-6 text-primary" />} />
                <StatCard value={`${(totalViews / 1000).toFixed(1)}k`} label="Total Job Views" icon={<EyeIcon className="w-6 h-6 text-primary" />} />
            </div>

             <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-neutral-dark">Recent Applications</h2>
                    <button onClick={() => setActiveTab('applications')} className="text-sm text-primary font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Candidate</th>
                                <th scope="col" className="px-6 py-3">Applied For</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {EMPLOYER_APPLICATIONS.slice(0, 4).map(app => (
                                <tr key={app.applicant.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <img src={app.applicant.avatar} alt={app.applicant.name} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="font-bold">{app.applicant.name}</p>
                                                <p className="text-xs text-gray-500">{app.applicant.headline}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{app.job.title}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            app.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                            app.status === 'Reviewing' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-indigo-100 text-indigo-800'
                                        }`}>{app.status}</span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(app.appliedDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployerOverview;