
import React from 'react';
import { Job } from '../types';
import { ShareIcon } from './icons/ShareIcon';

interface JobCardProps {
  job: Job;
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewJobDetails, onViewCompanyProfile }) => {
  const getJobTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time': return 'bg-green-100 text-green-800 border-green-200';
      case 'part-time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contract': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'freelance': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimeAgo = (posted: string) => {
    if (posted === 'Just now') return posted;
    if (posted.includes('day')) return posted;
    if (posted.includes('week')) return posted;
    return posted;
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-6 flex flex-col h-full shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
      {/* Featured badge */}
      {job.id <= 2 && (
        <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
          Featured
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

      <div className="relative z-10 flex items-start mb-4">
        <div className="relative">
          <img
            src={job.logo}
            alt={`${job.company} logo`}
            className="w-16 h-16 rounded-xl mr-4 ring-2 ring-gray-100 group-hover:ring-primary/30 transition-all duration-300"
          />
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-grow min-w-0">
          <button
            onClick={() => onViewJobDetails(job)}
            className="text-left block group-hover:text-primary transition-colors duration-300"
          >
            <h3 className="text-lg font-bold text-neutral-dark hover:text-primary transition-colors line-clamp-2 leading-tight">
              {job.title}
            </h3>
          </button>
          <button
            onClick={() => onViewCompanyProfile(job.companyId)}
            className="text-gray-600 hover:text-primary hover:underline transition-colors text-sm mt-1 block"
          >
            {job.company}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-grow space-y-3 text-sm">
        <div className="flex items-center text-gray-600">
          <svg className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{job.location}</span>
        </div>

        <div className="flex items-center">
          <svg className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getJobTypeColor(job.type)}`}>
            {job.type}
          </span>
        </div>

        {job.salary && (
          <div className="flex items-center text-gray-600">
            <svg className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" />
            </svg>
            <span className="font-medium text-green-700">{job.salary}</span>
          </div>
        )}

        {/* Skills preview */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-xs text-gray-400">+{job.skills.length - 3} more</span>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{getTimeAgo(job.posted)}</span>
          {job.applicationsCount && (
            <span className="text-xs text-gray-400">• {job.applicationsCount} applicants</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality would be implemented here
              if (navigator.share) {
                navigator.share({
                  title: job.title,
                  text: `Check out this job: ${job.title} at ${job.company}`,
                  url: window.location.href,
                });
              } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(`${job.title} at ${job.company} - ${window.location.href}`);
              }
            }}
            className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-primary/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Share job"
            title="Share job"
          >
            <ShareIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewJobDetails(job)}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
