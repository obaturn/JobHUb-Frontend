/**
 * Employer Applications View
 * Displays job applications for employers to review
 */

import React, { useState, useEffect } from 'react';
import { ApplicationResponse, ApplicationDetailsResponse, getApplicationDetails, downloadResume } from '../../src/api/applicationApi';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { EnvelopeIcon } from '../icons/EnvelopeIcon';
import { ClockIcon } from '../icons/ClockIcon';
import { Job } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

interface EmployerApplicationsProps {
  applications: ApplicationResponse[];
  selectedJobId: number | null;
  jobs: Job[];
  onBack: () => void;
}

const EmployerApplications: React.FC<EmployerApplicationsProps> = ({ applications, selectedJobId, jobs, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDetailsResponse | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Get selected job details
  const selectedJob = jobs.find(j => j.id === selectedJobId);
  
  // Fetch applications on mount if not provided
  useEffect(() => {
    if (applications.length === 0 && selectedJobId) {
      fetchApplications();
    }
  }, [selectedJobId]);

  const fetchApplications = async () => {
    if (!selectedJobId) return;
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Fetching applications for job:', selectedJobId);
      // Applications are already loaded from parent component
    } catch (err: any) {
      console.error('❌ Failed to fetch applications:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (application: ApplicationResponse) => {
    try {
      const details = await getApplicationDetails(application.id);
      setSelectedApplication(details);
      setShowDetails(true);
    } catch (err: any) {
      console.error('Failed to fetch application details:', err);
      alert('Failed to load application details');
    }
  };

  const handleDownloadResume = async (application: ApplicationResponse) => {
    try {
      await downloadResume(application.id);
    } catch (err: any) {
      console.error('Failed to download resume:', err);
      alert('Failed to download resume. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-700';
      case 'RESUME_VIEWED': return 'bg-yellow-100 text-yellow-700';
      case 'IN_REVIEW': return 'bg-purple-100 text-purple-700';
      case 'SHORTLISTED': return 'bg-green-100 text-green-700';
      case 'INTERVIEW': return 'bg-indigo-100 text-indigo-700';
      case 'OFFERED': return 'bg-emerald-100 text-emerald-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'WITHDRAWN': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchApplications}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Job Applications</h2>
            <p className="text-blue-100 text-sm mt-1">{selectedJob?.title || 'Applications'}</p>
          </div>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-lg">
          <span className="text-white font-semibold">{applications.length}</span>
          <span className="text-blue-100 ml-1">applications</span>
        </div>
      </div>

      {/* Applications List */}
      <div className="p-6">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentTextIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-500">When candidates apply for this job, their applications will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div 
                key={application.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCircleIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    {/* Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {application.applicantName || 'Unknown Applicant'}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <EnvelopeIcon className="w-4 h-4" />
                        {application.applicantEmail || 'No email'}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <ClockIcon className="w-4 h-4" />
                        Applied on {formatDate(application.appliedDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.replace(/_/g, ' ')}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadResume(application)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download Resume"
                      >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Resume Info */}
                {application.resumeFileName && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>{application.resumeFileName}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Application Details</h3>
                <p className="text-blue-100 text-sm">{selectedApplication.applicantName}</p>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-gray-900">Contact Information</h4>
                <div className="flex items-center gap-3">
                  <UserCircleIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{selectedApplication.applicantName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${selectedApplication.applicantEmail}`} className="text-blue-600 hover:underline">
                    {selectedApplication.applicantEmail}
                  </a>
                </div>
              </div>

              {/* Job Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Applied For</h4>
                <p className="text-gray-700">{selectedApplication.jobTitle}</p>
                <p className="text-sm text-gray-500">{selectedApplication.companyName}</p>
              </div>

              {/* Resume */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedApplication.resumeFileName || 'Resume'}</p>
                    <p className="text-sm text-gray-500">Click to download</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadResume(selectedApplication)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>

              {/* Applied Date */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Applied on</span>
                <span className="text-gray-900 font-medium">{formatDate(selectedApplication.appliedDate)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleDownloadResume(selectedApplication)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Resume
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  Shortlist
                </button>
                <button
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
