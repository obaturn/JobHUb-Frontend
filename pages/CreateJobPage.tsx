import React, { useState } from 'react';
import { Job, User } from '../types';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { BehaviorTracker } from '@/src/utils/behaviorTracking';

interface CreateJobPageProps {
  user: User;
  onBack: () => void;
  onPublish: (jobData: Partial<Job>) => void;
}

const ProgressStepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ["Basic Info", "Details", "Compensation", "Location", "Review"];
    return (
        <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((name, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = currentStep > stepNumber;
                    const isCurrent = currentStep === stepNumber;
                    return (
                        <li key={name} className="md:flex-1">
                            <div className={`group flex flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                                isCompleted ? 'border-primary' : isCurrent ? 'border-primary' : 'border-gray-200'
                            }`}>
                                <span className={`text-sm font-medium transition-colors ${
                                    isCompleted ? 'text-primary' : isCurrent ? 'text-primary' : 'text-gray-500'
                                }`}>Step {stepNumber}</span>
                                <span className="text-sm font-medium">{name}</span>
                            </div>
                        </li>
                    )
                })}
            </ol>
        </nav>
    );
};


const CreateJobPage: React.FC<CreateJobPageProps> = ({ user, onBack, onPublish }) => {
  const [step, setStep] = useState(1);
  const [jobData, setJobData] = useState<Partial<Job>>({
    title: '',
    description: '',
    responsibilities: [],
    skills: [],
    benefits: [],
    type: 'Full-time',
    seniority: 'Mid'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const goToStep = (stepNumber: number) => setStep(stepNumber);

  const renderStepContent = () => {
    switch(step) {
      case 1: // Basic Information
        return (
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input type="text" name="title" id="title" value={jobData.title} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
                    <select name="type" id="type" value={jobData.type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Freelance</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="seniority" className="block text-sm font-medium text-gray-700">Seniority Level</label>
                    <select name="seniority" id="seniority" value={jobData.seniority} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option>Entry</option>
                        <option>Mid</option>
                        <option>Senior</option>
                        <option>Lead</option>
                        <option>Executive</option>
                    </select>
                </div>
            </div>
        );
      case 2: // Job Details
        return (
             <div className="space-y-4">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
                    <textarea name="description" id="description" value={jobData.description} onChange={handleChange} rows={6} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
             </div>
        );
      case 3: // Compensation & Skills
         return (
             <div className="space-y-4">
                 <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary Range (e.g., $100k - $120k)</label>
                    <input type="text" name="salary" id="salary" value={jobData.salary} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                    <input type="text" name="skills" id="skills" value={jobData.skills?.join(', ')} onChange={e => setJobData(p => ({...p, skills: e.target.value.split(',').map(s => s.trim())}))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
             </div>
         );
      case 4: // Location & Deadline
         return (
             <div className="space-y-4">
                 <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Job Location (e.g., San Francisco, CA or Remote)</label>
                    <input type="text" name="location" id="location" value={jobData.location} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                </div>
             </div>
         );
      case 5: // Review & Publish
          return (
              <div className="space-y-6">
                  {Object.entries(jobData).map(([key, value]) => (
                      <div key={key}>
                          <h4 className="font-semibold capitalize text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</h4>
                          <p className="text-gray-600 whitespace-pre-wrap">{Array.isArray(value) ? value.join(', ') : value}</p>
                      </div>
                  ))}
              </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="bg-neutral-light min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-primary font-medium">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                 <h1 className="text-3xl font-bold text-neutral-dark mb-2">Post a New Job</h1>
                 <p className="text-gray-500 mb-8">Follow the steps below to create your job posting.</p>
                 <ProgressStepper currentStep={step} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
                {renderStepContent()}
            </div>

            <div className="mt-6 flex justify-between items-center">
                <button 
                    onClick={prevStep} 
                    disabled={step === 1}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                 {step < 5 ? (
                    <button 
                        onClick={nextStep}
                        className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-blue-700"
                    >
                        Next
                    </button>
                 ) : (
                    <button 
                        onClick={() => {
                            // Create a temporary ID for tracking if needed
                            const tempJobId = `job_${Date.now()}`;
                            BehaviorTracker.trackJobPosted(tempJobId);
                            onPublish(jobData);
                        }}
                        className="px-6 py-2 bg-accent text-white font-semibold rounded-md hover:bg-green-600 flex items-center gap-2"
                    >
                        <CheckCircleIcon className="w-5 h-5"/>
                        Publish Job
                    </button>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage;