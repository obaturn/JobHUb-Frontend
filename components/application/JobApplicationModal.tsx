import React, { useState } from 'react';
import { Job, User, Resume } from '../../types';

interface JobApplicationModalProps {
  job: Job;
  user: User;
  resumes: Resume[];
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (applicationData: {
    jobId: number;
    resumeId: string;
    coverLetter: string;
    additionalInfo?: string;
  }) => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  user,
  resumes,
  isOpen,
  onClose,
  onSubmitApplication
}) => {
  const [selectedResumeId, setSelectedResumeId] = useState(
    resumes.find(r => r.isPrimary)?.id || resumes[0]?.id || ''
  );
  const [coverLetter, setCoverLetter] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) return;

    setIsSubmitting(true);
    
    try {
      await onSubmitApplication({
        jobId: job.id,
        resumeId: selectedResumeId,
        coverLetter,
        additionalInfo
      });
      
      // Close modal after successful submission
      onClose();
    } catch (error) {
      console.error('Application submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Apply to {job.company}</h2>
              <p className="text-gray-600">{job.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <img
                src={job.logo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
                {job.salary && (
                  <p className="text-sm text-gray-700 font-medium">{job.salary}</p>
                )}
              </div>
            </div>
          </div>

          {/* Resume Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Resume *
            </label>
            <div className="space-y-3">
              {resumes.map((resume) => (
                <label
                  key={resume.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedResumeId === resume.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="resume"
                    value={resume.id}
                    checked={selectedResumeId === resume.id}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{resume.fileName}</span>
                      {resume.isPrimary && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Uploaded {resume.uploadDate}</p>
                  </div>
                </label>
              ))}
            </div>
            
            {resumes.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-600 mb-2">No resumes uploaded</p>
                <button
                  type="button"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Upload Resume First
                </button>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder={`Dear ${job.company} Hiring Team,

I am excited to apply for the ${job.title} position. With my experience in ${user.skills?.slice(0, 2).join(' and ')}, I believe I would be a great fit for your team...`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional but recommended. Personalize your application to stand out.
            </p>
          </div>

          {/* Additional Information */}
          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Any additional information you'd like to share (portfolio links, availability, etc.)"
            />
          </div>

          {/* Application Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Application Summary</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Resume: {resumes.find(r => r.id === selectedResumeId)?.fileName || 'None selected'}</p>
              <p>• Cover letter: {coverLetter ? 'Included' : 'Not included'}</p>
              <p>• Additional info: {additionalInfo ? 'Included' : 'Not included'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedResumeId || isSubmitting}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;