
import React, { useState } from 'react';
import { EmployerApplication } from '../../types';
import { EMPLOYER_APPLICATIONS } from '../../constants';

type ApplicationStatus = 'All' | 'New' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Hired';

const EmployerApplications: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ApplicationStatus>('All');

    const tabs: ApplicationStatus[] = ['All', 'New', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired'];

    const filteredApplications = activeTab === 'All'
        ? EMPLOYER_APPLICATIONS
        : EMPLOYER_APPLICATIONS.filter(app => app.status === activeTab);

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-neutral-dark">Applications</h1>
                <p className="text-gray-500 mt-1">Review and manage candidates for your job postings.</p>
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
            
            <div className="divide-y divide-gray-200">
                {filteredApplications.length > 0 ? (
                    filteredApplications.map(app => (
                        <div key={app.applicant.id + app.job.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start flex-grow">
                                    <img src={app.applicant.avatar} alt={app.applicant.name} className="w-14 h-14 rounded-full mr-4"/>
                                    <div>
                                        <h3 className="font-bold text-lg text-neutral-dark">{app.applicant.name}</h3>
                                        <p className="text-sm text-gray-600">Applied for: <span className="font-semibold">{app.job.title}</span></p>
                                        <p className="text-xs text-gray-400 mt-1">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                                     <div>
                                        <p className="text-sm font-semibold text-gray-700">Skills Match</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                <div className="bg-accent h-1.5 rounded-full" style={{ width: `${app.matchPercentage}%`}}></div>
                                            </div>
                                            <span className="text-sm font-bold text-accent">{app.matchPercentage}%</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100">Shortlist</button>
                                        <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100">Reject</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>No applications found for this status.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerApplications;
