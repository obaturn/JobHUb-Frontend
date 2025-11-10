
import React from 'react';
import FiltersSidebar from '../components/job-search/FiltersSidebar';
import JobListings from '../components/job-search/JobListings';
import { Job } from '../types';

interface JobSearchPageProps {
    onViewJobDetails: (job: Job) => void;
    onViewCompanyProfile: (companyId: string) => void;
    onSaveSearch: () => void;
}

const JobSearchPage: React.FC<JobSearchPageProps> = ({ onViewJobDetails, onViewCompanyProfile, onSaveSearch }) => {
  return (
    <div className="bg-neutral-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <aside className="lg:col-span-1">
            <FiltersSidebar />
          </aside>
          <section className="lg:col-span-3 mt-8 lg:mt-0">
            <JobListings onViewJobDetails={onViewJobDetails} onViewCompanyProfile={onViewCompanyProfile} onSaveSearch={onSaveSearch} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;
