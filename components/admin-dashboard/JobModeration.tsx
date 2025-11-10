import React, { useState } from 'react';
import { Job } from '../../types';
import { MODERATION_JOBS } from '../../constants';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';
import { FlagIcon } from '../icons/FlagIcon';
import { TrashIcon } from '../icons/TrashIcon';

type ModerationStatus = 'Pending Approval' | 'Published' | 'Flagged' | 'Removed';

const statusColors: { [key in Job['status'] & string]: string } = {
    'Published': 'bg-green-100 text-green-800',
    'Pending Approval': 'bg-yellow-100 text-yellow-800',
    'Flagged': 'bg-orange-100 text-orange-800',
    'Removed': 'bg-red-100 text-red-800',
    'Closed': 'bg-gray-100 text-gray-800',
    'Draft': 'bg-blue-100 text-blue-800',
};

const JobModeration: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>(MODERATION_JOBS);
    const [activeTab, setActiveTab] = useState<ModerationStatus>('Pending Approval');

    const tabs: ModerationStatus[] = ['Pending Approval', 'Flagged', 'Published', 'Removed'];

    const filteredJobs = jobs.filter(job => job.status === activeTab);
    
    const handleApprove = (jobId: number) => {
        setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'Published' } : job));
    };

    const handleRemove = (jobId: number) => {
        setJobs(jobs.map(job => job.id === jobId ? { ...job, status: 'Removed' } : job));
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-neutral-dark">Job Moderation</h1>
                <p className="text-gray-500 mt-1">Review, approve, or remove job postings to maintain platform quality.</p>
            </div>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Job Title</th>
                            <th scope="col" className="px-6 py-3">Employer</th>
                            <th scope="col" className="px-6 py-3">Date Posted</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredJobs.length > 0 ? filteredJobs.map(job => (
                            <tr key={job.id} className={`bg-white border-b hover:bg-gray-50 ${job.status === 'Flagged' ? 'bg-orange-50' : ''}`}>
                                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        {job.status === 'Flagged' && <FlagIcon className="w-5 h-5 text-orange-500" />}
                                        {job.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{job.company}</td>
                                <td className="px-6 py-4">{job.posted}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[job.status || 'Draft']}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-sm">
                                        <button className="font-medium text-primary hover:underline">View</button>
                                        {job.status === 'Pending Approval' || job.status === 'Flagged' ? (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <button onClick={() => handleApprove(job.id)} className="font-medium text-accent hover:underline flex items-center gap-1">
                                                    <CheckBadgeIcon className="w-4 h-4" /> Approve
                                                </button>
                                            </>
                                        ) : null}
                                         {job.status !== 'Removed' ? (
                                            <>
                                                <span className="text-gray-300">|</span>
                                                <button onClick={() => handleRemove(job.id)} className="font-medium text-alert hover:underline flex items-center gap-1">
                                                    <TrashIcon className="w-4 h-4" /> Remove
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-gray-500">
                                    No jobs found with status: {activeTab}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobModeration;