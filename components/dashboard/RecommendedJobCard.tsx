
import React from 'react';
import { Job } from '../../types';
import { ShareIcon } from '../icons/ShareIcon';

interface RecommendedJobCardProps {
  job: Job;
  onViewJobDetails: (job: Job) => void;
}

const RecommendedJobCard: React.FC<RecommendedJobCardProps> = ({ job, onViewJobDetails }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col h-full shadow-sm hover:shadow-lg hover:border-primary transition-all duration-300 w-64 flex-shrink-0">
      <div className="flex items-center mb-3">
        <img src={job.logo} alt={`${job.company} logo`} className="w-10 h-10 rounded-lg mr-3 flex-shrink-0" />
        <div className="flex-grow min-w-0">
          <h4 className="text-sm font-bold text-neutral-dark leading-tight line-clamp-2" title={job.title}>{job.title}</h4>
          <p className="text-xs text-gray-500 truncate">{job.company}</p>
        </div>
      </div>
      <div className="flex-grow space-y-2 text-xs text-gray-500">
        <p className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="truncate">{job.location}</span>
        </p>
         <p className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span className="truncate">{job.type}</span>
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => onViewJobDetails(job)} className="flex-grow px-3 py-1.5 text-sm bg-primary/90 text-white rounded-md font-semibold hover:bg-primary transition-colors duration-200">
          View Job
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert(`Share functionality for "${job.title}" would be implemented here.`);
          }}
          className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-blue-100 transition-colors flex-shrink-0"
          aria-label="Share job"
          title="Share job"
        >
          <ShareIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
export default RecommendedJobCard;
