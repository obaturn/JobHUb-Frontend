
import React from 'react';
import { Job } from '../../types';
import JobCard from '../JobCard';

interface SavedJobsProps {
  savedJobs: Job[];
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
}

const SavedJobs: React.FC<SavedJobsProps> = ({ savedJobs, onViewJobDetails, onViewCompanyProfile }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className=" border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-neutral-dark">Saved Jobs</h1>
            <p className="text-gray-500 mt-1">Keep track of jobs you're interested in.</p>
        </div>
        {savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedJobs.map(job => (
                    <JobCard key={job.id} job={job} onViewJobDetails={onViewJobDetails} onViewCompanyProfile={onViewCompanyProfile}/>
                ))}
            </div>
        ) : (
            <div className="py-8 text-center text-gray-500">
                <p>You haven't saved any jobs yet.</p>
                <p className="mt-1">Click the bookmark icon on a job to save it for later.</p>
            </div>
        )}
    </div>
  );
};

export default SavedJobs;