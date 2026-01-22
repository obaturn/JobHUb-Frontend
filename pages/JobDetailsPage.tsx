

import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { BookmarkIcon } from '../components/icons/BookmarkIcon';
import { ShareIcon } from '../components/icons/ShareIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { BookmarkSlashIcon } from '../components/icons/BookmarkSlashIcon';
import ApplyJobModal from '../components/modals/ApplyJobModal';
import { BehaviorTracker } from '@/src/utils/behaviorTracking';

interface JobDetailsPageProps {
  job: Job;
  onBack: () => void;
  onApply: (job: Job) => void;
  onToggleSave: (job: Job) => void;
  isSaved: boolean;
  isAuthenticated: boolean;
  onLoginRedirect: () => void;
  onViewCompanyProfile: (companyId: string) => void;
  onStartPracticeInterview: (job: Job) => void;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ job, onBack, onApply, onToggleSave, isSaved, isAuthenticated, onLoginRedirect, onViewCompanyProfile, onStartPracticeInterview }) => {
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    // Track job view when component mounts
    useEffect(() => {
        BehaviorTracker.trackJobView(job.id);
    }, [job.id]);

    const handleApplyClick = () => {
        if (isAuthenticated) {
            BehaviorTracker.trackJobApply(job.id);
            setIsApplyModalOpen(true);
        } else {
            onLoginRedirect();
        }
    };
    
    const handleSaveClick = () => {
        if (isAuthenticated) {
            if (!isSaved) {
                BehaviorTracker.trackJobSave(job.id);
            }
            onToggleSave(job);
        } else {
            onLoginRedirect();
        }
    };

    return (
    <>
        <div className="bg-neutral-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary font-medium">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Jobs
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start border-b pb-6 mb-6">
                        <div className="flex items-start">
                            <img src={job.logo} alt={`${job.company} logo`} className="w-20 h-20 rounded-lg mr-6" />
                            <div>
                                <span className="text-sm bg-blue-100 text-primary font-semibold px-3 py-1 rounded-full">{job.type}</span>
                                <h1 className="text-3xl font-bold text-neutral-dark mt-2">{job.title}</h1>
                                <p className="text-lg text-gray-600 font-medium">
                                    <button onClick={() => onViewCompanyProfile(job.companyId)} className="hover:underline">{job.company}</button>
                                     &middot; {job.location}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">Posted {job.posted}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
                            <button onClick={handleSaveClick} className={`p-3 rounded-full transition-colors ${isSaved ? 'bg-blue-100 text-primary' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                {isSaved ? <BookmarkSlashIcon className="w-6 h-6"/> : <BookmarkIcon className="w-6 h-6"/>}
                            </button>
                            <button className="p-3 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200">
                                <ShareIcon className="w-6 h-6"/>
                            </button>
                            <button onClick={handleApplyClick} className="px-6 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all duration-200 ml-2">
                                Apply Now
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="prose max-w-none text-gray-700">
                               <h2 className="font-bold text-xl text-neutral-dark">Job Description</h2>
                               <p>{job.description}</p>
                               
                               <h2 className="font-bold text-xl text-neutral-dark mt-6">Responsibilities</h2>
                               <ul className="list-disc pl-5 space-y-1">
                                    {job.responsibilities?.map((resp, index) => <li key={index}>{resp}</li>)}
                               </ul>
                            </div>
                        </div>
                        <div>
                             <div className="bg-neutral-light rounded-lg p-6">
                                <h3 className="font-bold text-lg text-neutral-dark mb-4">Skills Required</h3>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {job.skills?.map(skill => (
                                        <span key={skill} className="bg-blue-100 text-primary text-sm font-medium px-3 py-1 rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                
                                {job.salary && (
                                    <>
                                        <h3 className="font-bold text-lg text-neutral-dark mb-2">Salary</h3>
                                        <p className="text-gray-600 mb-6">{job.salary}</p>
                                    </>
                                )}

                                {job.benefits && job.benefits.length > 0 && (
                                    <>
                                    <h3 className="font-bold text-lg text-neutral-dark mb-4">Benefits</h3>
                                    <ul className="space-y-2">
                                        {job.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-center text-gray-600 text-sm">
                                                <CheckCircleIcon className="w-5 h-5 text-accent mr-2 flex-shrink-0" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                    </>
                                )}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {isApplyModalOpen && (
            <ApplyJobModal 
                job={job}
                onClose={() => setIsApplyModalOpen(false)}
                onSubmit={() => {
                    onApply(job);
                }}
                onPractice={onStartPracticeInterview}
            />
        )}
    </>
    );
};

export default JobDetailsPage;