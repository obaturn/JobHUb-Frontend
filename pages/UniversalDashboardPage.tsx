import React, { useState } from 'react';
import { Page } from '../types';
import { FEATURED_JOBS } from '../constants';

interface UniversalDashboardPageProps {
  onNavigate: (page: Page) => void;
  onViewJobDetails: (job: any) => void;
  onViewCompanyProfile: (companyId: string) => void;
}

const UniversalDashboardPage: React.FC<UniversalDashboardPageProps> = ({
  onNavigate,
  onViewJobDetails,
  onViewCompanyProfile
}) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'job_seeker' | 'employer'>('explore');
  const [showJobSeekerModal, setShowJobSeekerModal] = useState(false);
  const [showEmployerModal, setShowEmployerModal] = useState(false);

  const featuredJobs = FEATURED_JOBS.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to JobHub!</h1>
              <p className="text-gray-600 mt-1">Explore what you can do on our platform</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'explore'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Explore
              </button>
              <button
                onClick={() => setActiveTab('job_seeker')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'job_seeker'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Find Jobs
              </button>
              <button
                onClick={() => setActiveTab('employer')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'employer'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hire Talent
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'explore' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What would you like to do?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Whether you're looking for your dream job or hiring top talent,
                JobHub connects professionals worldwide.
              </p>
            </div>

            {/* Choice Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Job Seeker Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Find Your Dream Job</h3>
                  <p className="text-gray-600 mb-6">
                    Discover opportunities from top companies, track applications,
                    and advance your career with personalized recommendations.
                  </p>
                  <button
                    onClick={() => setActiveTab('job_seeker')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Explore Job Search
                  </button>
                </div>
              </div>

              {/* Employer Card */}
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Hire Top Talent</h3>
                  <p className="text-gray-600 mb-6">
                    Post jobs, review applications, and connect with qualified
                    candidates to build your dream team.
                  </p>
                  <button
                    onClick={() => setActiveTab('employer')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Explore Hiring
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Join Our Community</h3>
                <p className="text-gray-600 mt-2">Trusted by professionals worldwide</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-gray-600">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <div className="text-gray-600">Job Seekers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">5K+</div>
                  <div className="text-gray-600">Companies</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'job_seeker' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Discover Your Next Opportunity</h2>
              <p className="text-xl text-gray-600">Explore jobs and see how our platform works for job seekers</p>
            </div>

            {/* Featured Jobs Preview */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Jobs</h3>
              <div className="grid gap-6">
                {featuredJobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h4>
                        <p className="text-gray-600 mb-2">{job.company} • {job.location}</p>
                        <p className="text-gray-700 mb-4">{job.description.substring(0, 150)}...</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-primary mb-2">{job.salary}</div>
                        <button
                          onClick={() => onViewJobDetails(job)}
                          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">Like what you see? Complete your profile to unlock personalized job recommendations!</p>
                <button
                  onClick={() => setShowJobSeekerModal(true)}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Job Search
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employer' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Great Hire</h2>
              <p className="text-xl text-gray-600">See how easy it is to post jobs and connect with talent</p>
            </div>

            {/* Employer Features Preview */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Post a Job</h3>
                  <p className="text-gray-600 mb-6">
                    Create compelling job postings that attract top talent.
                    Our platform reaches thousands of qualified candidates.
                  </p>
                  <button
                    onClick={() => setShowEmployerModal(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Start Hiring
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Applications</h3>
                  <p className="text-gray-600 mb-6">
                    Review applications, schedule interviews, and manage your
                    hiring pipeline all in one place.
                  </p>
                  <button
                    onClick={() => setShowEmployerModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Hiring
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Hire?</h3>
              <p className="text-gray-600 mb-6">
                Set up your company profile and start posting jobs to reach thousands of qualified candidates.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => onNavigate('signup')}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Seeker Commitment Modal */}
      {showJobSeekerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Find Your Dream Job?</h3>
              <p className="text-gray-600 mb-6">
                Get access to thousands of job opportunities, personalized recommendations,
                and powerful tools to advance your career.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Mock role assignment for now
                    setShowJobSeekerModal(false);
                    // In real app, this would trigger backend activity tracking
                    alert('🎉 Welcome to JobHub! You now have access to the full Job Seeker experience.');
                    // Navigate to job seeker dashboard
                    onNavigate('job_seeker_dashboard');
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Job Hunting
                </button>
                <button
                  onClick={() => setShowJobSeekerModal(false)}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employer Commitment Modal */}
      {showEmployerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Hire Top Talent?</h3>
              <p className="text-gray-600 mb-6">
                Access powerful hiring tools, post jobs to thousands of candidates,
                and build your dream team with our employer dashboard.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Mock role assignment for now
                    setShowEmployerModal(false);
                    // In real app, this would trigger backend activity tracking
                    alert('🎉 Welcome to JobHub! You now have access to the full Employer experience.');
                    // Navigate to employer dashboard
                    onNavigate('employer_dashboard');
                  }}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Start Hiring
                </button>
                <button
                  onClick={() => setShowEmployerModal(false)}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalDashboardPage;