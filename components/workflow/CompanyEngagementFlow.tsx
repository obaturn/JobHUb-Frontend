import React, { useState, useEffect } from 'react';
import { User, Job, Company } from '../../types';

interface CompanyEngagementFlowProps {
  user: User;
  companyId: string;
  onViewJobDetails: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  onFollowCompany: (companyId: string) => void;
  onViewCompanyProfile: (companyId: string) => void;
}

interface EngagementStep {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  optional: boolean;
}

const CompanyEngagementFlow: React.FC<CompanyEngagementFlowProps> = ({
  user,
  companyId,
  onViewJobDetails,
  onApplyJob,
  onFollowCompany,
  onViewCompanyProfile
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFlow, setShowFlow] = useState(true);

  // Mock company data and jobs
  const company = {
    id: companyId,
    name: 'TechCorp',
    logo: 'https://picsum.photos/seed/techcorp/100/100',
    industry: 'Technology',
    size: '1,000-5,000 employees',
    description: 'Leading technology company building the future'
  };

  const companyJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      companyId: 'techcorp',
      logo: 'https://picsum.photos/seed/techcorp/100/100',
      location: 'San Francisco, CA',
      type: 'Full-time' as const,
      salary: '$140k - $180k',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'TechCorp',
      companyId: 'techcorp',
      logo: 'https://picsum.photos/seed/techcorp/100/100',
      location: 'Remote',
      type: 'Full-time' as const,
      salary: '$160k - $200k',
      posted: '1 week ago'
    }
  ];

  const engagementSteps: EngagementStep[] = [
    {
      id: 'discover',
      title: 'Discover Company',
      description: 'Learn about TechCorp\'s mission, culture, and values',
      action: 'View Company Profile',
      completed: false,
      optional: false
    },
    {
      id: 'follow',
      title: 'Follow for Updates',
      description: 'Stay updated with company news and job postings',
      action: 'Follow Company',
      completed: isFollowing,
      optional: false
    },
    {
      id: 'explore_jobs',
      title: 'Explore Open Positions',
      description: 'Browse current job openings that match your skills',
      action: 'View Jobs',
      completed: false,
      optional: false
    },
    {
      id: 'apply',
      title: 'Apply to Relevant Roles',
      description: 'Submit applications for positions that interest you',
      action: 'Apply Now',
      completed: false,
      optional: true
    }
  ];

  const handleStepAction = (step: EngagementStep) => {
    switch (step.id) {
      case 'discover':
        onViewCompanyProfile(companyId);
        setCurrentStep(1);
        break;
      case 'follow':
        onFollowCompany(companyId);
        setIsFollowing(true);
        setCurrentStep(2);
        break;
      case 'explore_jobs':
        setCurrentStep(3);
        break;
      case 'apply':
        // Show job application options
        break;
    }
  };

  const handleQuickApply = (job: Job) => {
    onApplyJob(job);
    // Mark apply step as completed
    setCurrentStep(4);
  };

  if (!showFlow) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img
            src={company.logo}
            alt={company.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Engage with {company.name}</h3>
            <p className="text-sm text-gray-600">Complete these steps to maximize your opportunities</p>
          </div>
        </div>
        <button
          onClick={() => setShowFlow(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{currentStep}/4 steps</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        {engagementSteps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
              index === currentStep
                ? 'border-primary bg-primary/5'
                : step.completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {/* Step Icon */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed
                ? 'bg-green-500 text-white'
                : index === currentStep
                ? 'bg-primary text-white'
                : 'bg-gray-300 text-gray-600'
            }`}>
              {step.completed ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-sm font-bold">{index + 1}</span>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>

            {/* Step Action */}
            {!step.completed && index <= currentStep && (
              <button
                onClick={() => handleStepAction(step)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  index === currentStep
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {step.action}
              </button>
            )}

            {step.completed && (
              <span className="text-green-600 font-medium text-sm">✓ Completed</span>
            )}
          </div>
        ))}
      </div>

      {/* Quick Apply Section (shown when at apply step) */}
      {currentStep >= 3 && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Quick Apply to Open Positions</h4>
          <div className="space-y-3">
            {companyJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">{job.title}</h5>
                  <p className="text-sm text-gray-600">{job.location} • {job.salary}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewJobDetails(job)}
                    className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleQuickApply(job)}
                    className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Quick Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {currentStep >= 4 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Great job!</h4>
                <p className="text-sm text-green-700">
                  You've successfully engaged with {company.name}. You'll now receive updates about their company and new job postings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyEngagementFlow;