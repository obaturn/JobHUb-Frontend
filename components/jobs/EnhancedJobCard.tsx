import React, { useState } from 'react';
import { Job, User, Resume } from '../../types';
import JobApplicationModal from '../application/JobApplicationModal';

interface EnhancedJobCardProps {
  job: Job;
  user: User;
  resumes: Resume[];
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
  onApplyJob: (job: Job) => void;
  onSaveJob: (job: Job) => void;
  showApplicationModal?: boolean;
}

interface JobPostingDetails {
  postedVia: 'company_website' | 'linkedin' | 'recruiter' | 'job_board';
  applicationMethod: 'easy_apply' | 'external_website' | 'email' | 'recruiter_contact';
  applicantCount: number;
  viewCount: number;
  isPromoted: boolean;
  hiringUrgency: 'urgent' | 'normal' | 'not_urgent';
  remotePolicy: 'fully_remote' | 'hybrid' | 'on_site' | 'flexible';
}

const EnhancedJobCard: React.FC<EnhancedJobCardProps> = ({
  job,
  user,
  resumes,
  onViewJobDetails,
  onViewCompanyProfile,
  onApplyJob,
  onSaveJob,
  showApplicationModal = true
}) => {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock enhanced job details (in real app, this would come from API)
  const jobDetails: JobPostingDetails = {
    postedVia: 'company_website',
    applicationMethod: 'easy_apply',
    applicantCount: Math.floor(Math.random() * 200) + 50,
    viewCount: Math.floor(Math.random() * 1000) + 200,
    isPromoted: Math.random() > 0.7,
    hiringUrgency: Math.random() > 0.8 ? 'urgent' : 'normal',
    remotePolicy: job.location.toLowerCase().includes('remote') ? 'fully_remote' : 
                  Math.random() > 0.5 ? 'hybrid' : 'on_site'
  };

  const handleApplyClick = () => {
    if (showApplicationModal && jobDetails.applicationMethod === 'easy_apply') {
      setIsApplicationModalOpen(true);
    } else {
      // For external applications, just call the handler
      onApplyJob(job);
    }
  };

  const handleSubmitApplication = async (applicationData: {
    jobId: number;
    resumeId: string;
    coverLetter: string;
    additionalInfo?: string;
  }) => {
    onApplyJob(job);
    setIsApplicationModalOpen(false);
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    onSaveJob(job);
  };

  const getPostedViaText = () => {
    switch (jobDetails.postedVia) {
      case 'company_website':
        return 'Posted directly by company';
      case 'linkedin':
        return 'Posted on LinkedIn';
      case 'recruiter':
        return 'Posted by recruiter';
      case 'job_board':
        return 'Posted on job board';
      default:
        return 'Posted online';
    }
  };

  const getApplicationMethodText = () => {
    switch (jobDetails.applicationMethod) {
      case 'easy_apply':
        return 'Easy Apply available';
      case 'external_website':
        return 'Apply on company website';
      case 'email':
        return 'Apply via email';
      case 'recruiter_contact':
        return 'Contact recruiter to apply';
      default:
        return 'Apply now';
    }
  };

  const getRemotePolicyIcon = () => {
    switch (jobDetails.remotePolicy) {
      case 'fully_remote':
        return '🏠';
      case 'hybrid':
        return '🏢🏠';
      case 'on_site':
        return '🏢';
      case 'flexible':
        return '🔄';
      default:
        return '📍';
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6 hover:shadow-md transition-all duration-200">
        {/* Promoted Badge */}
        {jobDetails.isPromoted && (
          <div className="mb-3">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              ⭐ Promoted
            </span>
          </div>
        )}

        {/* Job Header */}
        <div className="flex items-start gap-3 lg:gap-4 mb-4">
          <img
            src={job.logo}
            alt={job.company}
            className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200"
          />
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg lg:text-xl font-semibold text-gray-900 hover:text-primary cursor-pointer line-clamp-2 mb-1"
              onClick={() => onViewJobDetails(job)}
            >
              {job.title}
            </h3>
            <button
              onClick={() => onViewCompanyProfile(job.companyId)}
              className="text-base lg:text-lg text-gray-600 hover:text-primary hover:underline font-medium mb-1"
            >
              {job.company}
            </button>
            
            {/* Location and Remote Policy */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                {getRemotePolicyIcon()} {job.location}
              </span>
              <span>•</span>
              <span>{job.type}</span>
              {jobDetails.hiringUrgency === 'urgent' && (
                <>
                  <span>•</span>
                  <span className="text-red-600 font-medium">Urgently hiring</span>
                </>
              )}
            </div>

            {/* Salary */}
            {job.salary && (
              <p className="text-base lg:text-lg text-gray-700 font-semibold mb-2">{job.salary}</p>
            )}

            {/* Posting Details - LinkedIn Style */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {job.posted}
              </span>
              <span>•</span>
              <span>{jobDetails.applicantCount} applicants</span>
              <span>•</span>
              <span>{getPostedViaText()}</span>
            </div>

            {/* Application Method Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">How to apply</span>
              </div>
              <p className="text-sm text-blue-700">{getApplicationMethodText()}</p>
              {jobDetails.applicationMethod === 'easy_apply' && (
                <p className="text-xs text-blue-600 mt-1">
                  Use your profile and resume to apply in seconds
                </p>
              )}
            </div>

            {/* Skills (if available) */}
            {job.skills && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.skills?.includes(skill)
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                      {user.skills?.includes(skill) && ' ✓'}
                    </span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{job.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveJob}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? 'text-primary bg-primary/10' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleApplyClick}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors text-sm lg:text-base ${
              jobDetails.applicationMethod === 'easy_apply'
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {jobDetails.applicationMethod === 'easy_apply' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Easy Apply
              </span>
            ) : (
              'Apply Now'
            )}
          </button>
          
          <button
            onClick={() => onViewCompanyProfile(job.companyId)}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm lg:text-base"
          >
            View Company
          </button>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <span>{jobDetails.viewCount} people viewed this job</span>
          <div className="flex items-center gap-4">
            <button className="hover:text-primary transition-colors">Share</button>
            <button className="hover:text-primary transition-colors">Report</button>
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      {showApplicationModal && (
        <JobApplicationModal
          job={job}
          user={user}
          resumes={resumes}
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
          onSubmitApplication={handleSubmitApplication}
        />
      )}
    </>
  );
};

export default EnhancedJobCard;