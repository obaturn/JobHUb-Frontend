
import React from 'react';
import { Application, Job } from '../../types';
import ApplicationStatusTimeline from './ApplicationStatusTimeline';

interface MyApplicationsProps {
  applications: Application[];
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
}

const statusColors: { [key in Application['status']]: string } = {
    Applied: 'bg-blue-100 text-blue-800',
    'Resume Viewed': 'bg-cyan-100 text-cyan-800',
    'In Review': 'bg-yellow-100 text-yellow-800',
    Shortlisted: 'bg-indigo-100 text-indigo-800',
    Interview: 'bg-purple-100 text-purple-800',
    Offered: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};

const MyApplications: React.FC<MyApplicationsProps> = ({ applications, onViewJobDetails, onViewCompanyProfile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-neutral-dark">My Applications</h1>
            <p className="text-gray-500 mt-1">Track the status of your job applications here.</p>
        </div>
        <div className="divide-y divide-gray-200">
            {applications.length > 0 ? (
                applications.map((app, index) => (
                    <div key={index} className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start flex-grow">
                                <img src={app.job.logo} alt={app.job.company} className="w-14 h-14 rounded-lg mr-4" />
                                <div>
                                    <button onClick={() => onViewJobDetails(app.job)} className="text-left">
                                        <h2 className="text-lg font-bold text-neutral-dark hover:text-primary transition-colors">{app.job.title}</h2>
                                    </button>
                                    <p className="text-gray-600">
                                        <button onClick={() => onViewCompanyProfile(app.job.companyId)} className="hover:underline">{app.job.company}</button>
                                         &middot; {app.job.location}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">Applied on: {new Date(app.appliedDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0 flex-shrink-0">
                               <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[app.status]}`}>
                                    {app.status}
                               </span>
                               <button onClick={() => onViewJobDetails(app.job)} className="text-sm text-primary font-medium hover:underline">View</button>
                            </div>
                        </div>
                        {app.status !== 'Rejected' && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <ApplicationStatusTimeline status={app.status} />
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-gray-500">
                    <p>You haven't applied to any jobs yet.</p>
                    <p className="mt-1">Start your search and find your dream job!</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MyApplications;
