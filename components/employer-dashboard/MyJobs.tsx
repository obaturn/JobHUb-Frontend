
import React from 'react';
import { Job, Page } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';

interface MyJobsProps {
  jobs: Job[];
  onViewJobDetails: (job: Job) => void;
  onNavigate: (page: Page) => void;
}

const statusColors: { [key: string]: string } = {
    Published: 'bg-green-100 text-green-800',
    Closed: 'bg-red-100 text-red-800',
    Draft: 'bg-yellow-100 text-yellow-800',
};

const MyJobs: React.FC<MyJobsProps> = ({ jobs, onViewJobDetails, onNavigate }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-neutral-dark">My Job Postings</h1>
            <p className="text-gray-500 mt-1">Manage your active, closed, and draft jobs.</p>
        </div>
        <button 
            onClick={() => onNavigate('create_job')}
            className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
        >
            <PlusIcon className="w-5 h-5" />
            Create New Job
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Job Title</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Applications</th>
              <th scope="col" className="px-6 py-3 text-center">Views</th>
              <th scope="col" className="px-6 py-3">Posted Date</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{job.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[job.status || 'Draft']}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">{job.applicationsCount}</td>
                <td className="px-6 py-4 text-center">{job.viewsCount}</td>
                <td className="px-6 py-4">{job.posted}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <button onClick={() => onViewJobDetails(job)} className="font-medium text-primary hover:underline">View</button>
                        <span className="text-gray-300">|</span>
                        <button className="font-medium text-primary hover:underline">Edit</button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyJobs;