import React, { useState } from 'react';
import { Company, Job } from '../types';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import JobCard from '../components/JobCard';
import { ALL_JOBS, MOCK_REVIEWS } from '../constants';
import CompanyReviews from '../components/company-profile/CompanyReviews';
import LifeAtCompany from '../components/company-profile/LifeAtCompany';
import VideoModal from '../components/modals/VideoModal';

interface CompanyProfilePageProps {
  company: Company;
  onBack: () => void;
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
}

type CompanyProfileTab = 'about' | 'life' | 'jobs' | 'reviews';

const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({ company, onBack, onViewJobDetails, onViewCompanyProfile }) => {
  const [activeTab, setActiveTab] = useState<CompanyProfileTab>('about');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  const companyJobs = ALL_JOBS.filter(job => job.companyId === company.id);
  const companyReviews = MOCK_REVIEWS.filter(review => review.companyId === company.id);
  
  const tabs: { id: CompanyProfileTab, label: string, count?: number }[] = [
      { id: 'about', label: 'About' },
      { id: 'life', label: `Life at ${company.name.split(' ')[0]}` },
      { id: 'jobs', label: 'Jobs', count: companyJobs.length },
      { id: 'reviews', label: 'Reviews', count: companyReviews.length },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-neutral-dark mb-4">About {company.name}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{company.about}</p>
            </div>
            <aside>
              <div className="bg-neutral-light rounded-lg p-6 sticky top-24">
                <dl className="space-y-4">
                  <div>
                    <dt className="font-semibold text-gray-800">Website</dt>
                    <dd><a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.website}</a></dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Industry</dt>
                    <dd className="text-gray-600">{company.industry}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-800">Company Size</dt>
                    <dd className="text-gray-600">{company.size}</dd>
                  </div>
                   <div>
                    <dt className="font-semibold text-gray-800">Headquarters</dt>
                    <dd className="text-gray-600">{company.location}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        );
      case 'life':
        return <LifeAtCompany company={company} onPlayVideo={(url) => setSelectedVideoUrl(url)} />;
      case 'jobs':
         return (
             <div>
                <h2 className="text-xl font-bold text-neutral-dark mb-4">Jobs at {company.name} ({companyJobs.length})</h2>
                {companyJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companyJobs.map(job => (
                            <JobCard key={job.id} job={job} onViewJobDetails={onViewJobDetails} onViewCompanyProfile={onViewCompanyProfile} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-12">No open positions at the moment. Check back soon!</p>
                )}
             </div>
         );
      case 'reviews':
        return <CompanyReviews initialReviews={companyReviews} companyId={company.id} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-neutral-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary font-medium">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="h-48 bg-gradient-to-r from-primary to-secondary relative">
                <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="px-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end sm:justify-between -mt-20 sm:-mt-16">
                <div className="flex items-end">
                    <img src={company.logo} alt={`${company.name} logo`} className="w-32 h-32 rounded-lg bg-white p-2 border-4 border-white shadow-lg" />
                    <div className="ml-6 pb-2">
                        <h1 className="text-3xl font-bold text-neutral-dark">{company.name}</h1>
                        <p className="text-gray-500">{company.tagline}</p>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0 sm:pb-2">
                  <button className="px-5 py-2 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors">
                    + Follow
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mt-6">
                <nav className="-mb-px flex space-x-6 px-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                            {tab.count !== undefined && <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}>{tab.count}</span>}
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Content */}
            <div className="p-8">
                {renderContent()}
            </div>
          </div>
        </div>
      </div>
       {selectedVideoUrl && (
        <VideoModal videoUrl={selectedVideoUrl} onClose={() => setSelectedVideoUrl(null)} />
      )}
    </>
  );
};

export default CompanyProfilePage;