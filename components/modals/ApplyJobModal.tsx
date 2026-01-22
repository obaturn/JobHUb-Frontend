

import React, { useState } from 'react';
import { Job } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface ApplyJobModalProps {
  job: Job;
  onClose: () => void;
  onSubmit: () => void;
  onPractice: (job: Job) => void;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ job, onClose, onSubmit, onPractice }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
    setIsSubmitted(true);
  };
  
  const handlePracticeClick = () => {
    onPractice(job);
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg relative transform transition-all animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
        </button>

        {isSubmitted ? (
            <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                     <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-neutral-dark">Application Sent!</h2>
                <p className="text-gray-600 mt-2 max-w-md mx-auto">
                    Your application for the {job.title} position has been successfully submitted. We wish you the best of luck!
                </p>
                
                <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-bold text-neutral-dark flex items-center justify-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-primary"/>
                        Ready for the Next Step?
                    </h3>
                    <p className="text-gray-600 mt-2">Get a competitive edge. Practice for this interview now with our AI-powered tool.</p>
                    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                        <button onClick={handlePracticeClick} className="px-6 py-3 bg-primary text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-all duration-200">
                            Practice Interview
                        </button>
                         <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 font-medium hover:underline">
                            Maybe Later
                        </button>
                    </div>
                </div>

            </div>
        ) : (
            <>
                <div className="p-8 border-b">
                    <h2 className="text-2xl font-bold text-neutral-dark">Apply for {job.title}</h2>
                    <p className="text-gray-500">at {job.company}</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400"/>
                                <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-700 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, DOCX, DOC up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="cover-letter" className="block text-sm font-medium text-gray-700">Cover Letter (Optional)</label>
                        <textarea
                            id="cover-letter"
                            rows={6}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm p-2"
                            placeholder="Tell us why you're a great fit for this role..."
                        />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Submit Application
                        </button>
                    </div>
                </form>
            </>
        )}
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ApplyJobModal;