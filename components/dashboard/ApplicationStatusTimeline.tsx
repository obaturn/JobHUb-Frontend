
import React from 'react';
import { Application } from '../../types';

interface ApplicationStatusTimelineProps {
  status: Application['status'];
}

// Defines the positive progression of an application
const steps: Exclude<Application['status'], 'Rejected'>[] = ['Applied', 'Resume Viewed', 'In Review', 'Shortlisted', 'Interview', 'Offered'];

const CheckIcon: React.FC = () => (
    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
);

const ApplicationStatusTimeline: React.FC<ApplicationStatusTimelineProps> = ({ status }) => {
  const currentStepIndex = steps.indexOf(status as any);

  // We don't render a timeline for rejected applications; the colored badge is clearer.
  if (status === 'Rejected' || currentStepIndex === -1) {
    return null;
  }

  return (
    <div className="w-full pt-8 pb-4" aria-label={`Application status: ${status}`}>
        <div className="flex items-center">
            {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            return (
                <React.Fragment key={step}>
                {/* Step Circle & Label */}
                <div className="flex flex-col items-center relative">
                    <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted ? 'bg-primary border-primary' : 'bg-white border-gray-300'
                    }`}
                    >
                    {isCompleted && <CheckIcon />}
                    </div>
                    <p
                    className={`absolute top-8 text-xs text-center w-20 leading-tight transition-colors duration-300 ${
                        isCompleted ? 'text-neutral-dark font-semibold' : 'text-gray-500'
                    }`}
                    >
                    {step}
                    </p>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                    <div
                    className={`flex-1 h-1 transition-colors duration-300 ${
                        index < currentStepIndex ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    ></div>
                )}
                </React.Fragment>
            );
            })}
        </div>
    </div>
  );
};

export default ApplicationStatusTimeline;
