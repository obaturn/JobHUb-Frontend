

import React, { useState } from 'react';
import { Job, Resume } from '../../types';
import { XMarkIcon } from '../icons/XMarkIcon';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface ApplyJobModalProps {
  job: Job;
  onClose: () => void;
  onSubmit: (applicationData: ApplicationData) => void;
  onPractice: (job: Job) => void;
  userResumes?: Resume[];
  userEmail?: string;
  userPhone?: string;
}

interface ApplicationData {
  resumeId?: string;
  resumeFile?: File;
  coverLetter: string;
  email: string;
  phone: string;
  answers: Record<string, string>;
}

const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ 
  job, 
  onClose, 
  onSubmit, 
  onPractice,
  userResumes = [],
  userEmail = '',
  userPhone = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<ApplicationData>({
    email: userEmail,
    phone: userPhone,
    coverLetter: '',
    answers: {}
  });
  
  const [selectedResumeId, setSelectedResumeId] = useState<string>(
    userResumes.find(r => r.isPrimary)?.id || ''
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const totalSteps = 4;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSelectedResumeId(''); // Clear selected resume if uploading new
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const applicationData: ApplicationData = {
      ...formData,
      resumeId: selectedResumeId,
      resumeFile: uploadedFile || undefined
    };
    
    onSubmit(applicationData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };
  
  const handlePracticeClick = () => {
    onPractice(job);
    onClose();
  };

  // Step validation
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.phone;
      case 2:
        return selectedResumeId || uploadedFile;
      case 3:
        return true; // Cover letter is optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative transform transition-all animate-slide-up max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1 hover:bg-gray-100"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {isSubmitted ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-once">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
            <p className="text-gray-600 text-lg mb-2">
              Your application for <span className="font-semibold text-gray-900">{job.title}</span> at <span className="font-semibold text-gray-900">{job.company}</span> has been successfully submitted.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              We'll notify you when the employer reviews your application.
            </p>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <SparklesIcon className="w-6 h-6 text-blue-600"/>
                <h3 className="text-xl font-bold text-gray-900">
                  Prepare for Success
                </h3>
              </div>
              <p className="text-gray-700 mb-6">
                Stand out from other candidates! Practice your interview skills with our AI-powered mock interview tool.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button 
                  onClick={handlePracticeClick} 
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="w-5 h-5"/>
                  Start Practice Interview
                </button>
                <button 
                  onClick={onClose} 
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">Apply to {job.company}</h2>
              <p className="text-blue-100">{job.title}</p>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-100">Step {currentStep} of {totalSteps}</span>
                  <span className="text-sm text-blue-100">{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-8">
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Contact Information</h3>
                    <p className="text-gray-600 text-sm mb-6">Confirm your contact details</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">💡 Tip:</span> Make sure your contact information is up to date so employers can reach you easily.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Resume */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Resume</h3>
                    <p className="text-gray-600 text-sm mb-6">Select a resume or upload a new one</p>
                  </div>
                  
                  {/* Saved Resumes */}
                  {userResumes.length > 0 && (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">
                        Your Saved Resumes
                      </label>
                      {userResumes.map((resume) => (
                        <div
                          key={resume.id}
                          onClick={() => {
                            setSelectedResumeId(resume.id);
                            setUploadedFile(null);
                          }}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedResumeId === resume.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedResumeId === resume.id ? 'bg-blue-600' : 'bg-gray-200'
                            }`}>
                              <DocumentTextIcon className={`w-6 h-6 ${
                                selectedResumeId === resume.id ? 'text-white' : 'text-gray-600'
                              }`}/>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{resume.fileName}</p>
                                {resume.isPrimary && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">Uploaded {resume.uploadDate}</p>
                            </div>
                            {selectedResumeId === resume.id && (
                              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Upload New Resume */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Or Upload New Resume
                    </label>
                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all ${
                      uploadedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <div className="space-y-1 text-center">
                        {uploadedFile ? (
                          <>
                            <svg className="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-sm font-semibold text-green-700">{uploadedFile.name}</p>
                            <button
                              type="button"
                              onClick={() => setUploadedFile(null)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400"/>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none">
                                <span>Upload a file</span>
                                <input 
                                  id="file-upload" 
                                  name="file-upload" 
                                  type="file" 
                                  className="sr-only"
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileUpload}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PDF, DOCX, DOC up to 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Cover Letter */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Cover Letter</h3>
                    <p className="text-gray-600 text-sm mb-6">Tell the employer why you're a great fit (optional)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                      rows={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Dear Hiring Manager,&#10;&#10;I am excited to apply for the position of [Job Title] at [Company]. With my background in...&#10;&#10;I look forward to the opportunity to discuss how I can contribute to your team.&#10;&#10;Best regards,&#10;[Your Name]"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.coverLetter.length} characters
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <span className="font-semibold">💡 Tip:</span> A personalized cover letter can increase your chances by up to 40%. Mention specific skills from the job description.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Review Your Application</h3>
                    <p className="text-gray-600 text-sm mb-6">Make sure everything looks good before submitting</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    {/* Job Info */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Applying for</p>
                      <p className="font-semibold text-gray-900 text-lg">{job.title}</p>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                    </div>
                    
                    {/* Contact */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Contact Information</p>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">📧 {formData.email}</p>
                        <p className="text-sm text-gray-600">📱 {formData.phone}</p>
                      </div>
                    </div>
                    
                    {/* Resume */}
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Resume</p>
                      <div className="flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-gray-600"/>
                        <p className="text-sm text-gray-600">
                          {uploadedFile 
                            ? uploadedFile.name 
                            : userResumes.find(r => r.id === selectedResumeId)?.fileName || 'No resume selected'
                          }
                        </p>
                      </div>
                    </div>
                    
                    {/* Cover Letter */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Cover Letter</p>
                      {formData.coverLetter ? (
                        <div className="bg-white p-4 rounded border border-gray-200 max-h-40 overflow-y-auto">
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{formData.coverLetter}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No cover letter provided</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">✓ Ready to submit!</span> Your application will be sent to {job.company}.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-all ${
                      step === currentStep 
                        ? 'bg-blue-600 w-8' 
                        : step < currentStep 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmitApplication}
                  disabled={!canProceed() || isSubmitting}
                  className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
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
        
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-bounce-once { animation: bounce-once 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default ApplyJobModal;
