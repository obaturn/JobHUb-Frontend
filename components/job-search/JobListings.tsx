import React, { useState, useEffect } from 'react';
import { useSharedJobsStore } from '../../stores/useSharedJobsStore';
import JobCard from '../JobCard';
import { Job } from '../../types';
import { BellIcon } from '../icons/BellIcon';
import Toast from '../Toast';

interface JobListingsProps {
    onViewJobDetails: (job: Job) => void;
    onViewCompanyProfile: (companyId: string) => void;
    onSaveSearch: () => void;
}

const JobListings: React.FC<JobListingsProps> = ({ onViewJobDetails, onViewCompanyProfile, onSaveSearch }) => {
  const { allJobs, loading, error, fetchAllJobs } = useSharedJobsStore();
  const [showSaveSearchToast, setShowSaveSearchToast] = useState(false);
  const [sortBy, setSortBy] = useState('Most Recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch jobs on component mount
  useEffect(() => {
    console.log('🔍 [JobListings] Fetching jobs from shared store...');
    fetchAllJobs();
  }, [fetchAllJobs]);

  const handleSaveSearchClick = () => {
    onSaveSearch();
    setShowSaveSearchToast(true);
  };

  const sortedJobs = [...allJobs].sort((a, b) => {
    switch (sortBy) {
      case 'Salary: High to Low':
        const aSalary = a.salary ? parseInt(a.salary.replace(/[^0-9]/g, '')) : 0;
        const bSalary = b.salary ? parseInt(b.salary.replace(/[^0-9]/g, '')) : 0;
        return bSalary - aSalary;
      case 'Salary: Low to High':
        const aSalaryLow = a.salary ? parseInt(a.salary.replace(/[^0-9]/g, '')) : 0;
        const bSalaryLow = b.salary ? parseInt(b.salary.replace(/[^0-9]/g, '')) : 0;
        return aSalaryLow - bSalaryLow;
      case 'Most Recent':
      default:
        return b.id - a.id; // Assuming higher ID means more recent
    }
  });

  return (
    <div className="space-y-6">
      {showSaveSearchToast && (
        <Toast
          message="Search Saved! You will now receive alerts for new jobs."
          type="success"
          onClose={() => setShowSaveSearchToast(false)}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 font-medium">❌ {error}</p>
          <button
            onClick={() => fetchAllJobs()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Header with stats and actions */}
      {!loading && !error && (
        <>
          <div className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark mb-2">
                  All Jobs
                  <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {allJobs.length} opportunities
                  </span>
                </h2>
                <p className="text-gray-600">Discover your next career opportunity</p>
              </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* View mode toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            <button
              onClick={handleSaveSearchClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <BellIcon className="w-4 h-4" />
              Save Search
            </button>
          </div>
        </div>
      </div>

      {/* Filters and sorting */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <p className="text-gray-600 font-medium">
              Showing <span className="text-primary font-semibold">{sortedJobs.length}</span> results
            </p>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Live updates</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-sm font-medium text-gray-600">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            >
              <option>Most Recent</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>
        </div>

        {/* Job listings */}
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }`}>
          {sortedJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onViewJobDetails={onViewJobDetails}
              onViewCompanyProfile={onViewCompanyProfile}
            />
          ))}
        </div>
        
        <nav className="mt-8 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
          <div className="-mt-px flex w-0 flex-1">
            <a href="#" className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z" clipRule="evenodd" />
              </svg>
              Previous
            </a>
          </div>
          <div className="hidden md:-mt-px md:flex">
            <a href="#" className="inline-flex items-center border-t-2 border-primary px-4 pt-4 text-sm font-medium text-primary" aria-current="page">1</a>
            <a href="#" className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">2</a>
            <a href="#" className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">3</a>
            <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">...</span>
            <a href="#" className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">10</a>
          </div>
          <div className="-mt-px flex w-0 flex-1 justify-end">
            <a href="#" className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
              Next
               <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 11-1.02 1.1l2.1 1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </nav>
      </div>
      </>
      )}
    </div>
  );
};

export default JobListings;