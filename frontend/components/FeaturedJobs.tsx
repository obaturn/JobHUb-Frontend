
import React from 'react';
import { FEATURED_JOBS } from '../constants';
import JobCard from './JobCard';
import { Job } from '../types';

interface FeaturedJobsProps {
    onViewJobDetails: (job: Job) => void;
    onViewCompanyProfile: (companyId: string) => void;
    onNavigate: (page: 'job_search') => void;
}

const FeaturedJobs: React.FC<FeaturedJobsProps> = ({ onViewJobDetails, onViewCompanyProfile, onNavigate }) => {
  return (
    <section className="bg-gradient-to-b from-neutral-light to-white py-16 md:py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Featured Opportunities
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-dark mb-6">
            Discover Your Next Career Move
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Handpicked opportunities from industry-leading companies. Find roles that match your skills and aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {FEATURED_JOBS.map((job, index) => (
            <div key={job.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <JobCard job={job} onViewJobDetails={onViewJobDetails} onViewCompanyProfile={onViewCompanyProfile} />
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => onNavigate('job_search')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span>Explore All Jobs</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <p className="text-gray-500 text-sm mt-4">Join 1M+ professionals already on JobHub</p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default FeaturedJobs;