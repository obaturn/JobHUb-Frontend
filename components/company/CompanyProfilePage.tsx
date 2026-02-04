import React, { useState, useEffect } from 'react';
import { Job, User } from '../../types';

interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  founded: string;
  followers: number;
  isFollowing: boolean;
  openJobs: Job[];
  culture: {
    values: string[];
    benefits: string[];
    workEnvironment: string;
  };
  recentUpdates: {
    id: string;
    type: 'job_posted' | 'company_news' | 'achievement';
    title: string;
    description: string;
    date: string;
    image?: string;
  }[];
}

interface CompanyProfilePageProps {
  companyId: string;
  user: User;
  onFollowCompany: (companyId: string) => void;
  onUnfollowCompany: (companyId: string) => void;
  onApplyJob: (job: Job) => void;
  onViewJobDetails: (job: Job) => void;
  onBack: () => void;
}

const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({
  companyId,
  user,
  onFollowCompany,
  onUnfollowCompany,
  onApplyJob,
  onViewJobDetails,
  onBack
}) => {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'culture' | 'updates'>('overview');

  useEffect(() => {
    // Mock company data - in real app, fetch from API
    const mockCompany: CompanyProfile = {
      id: companyId,
      name: companyId === 'techcorp' ? 'TechCorp' : 'InnovateCorp',
      logo: `https://picsum.photos/seed/${companyId}/200/200`,
      coverImage: `https://picsum.photos/seed/${companyId}-cover/1200/400`,
      description: `${companyId === 'techcorp' ? 'TechCorp' : 'InnovateCorp'} is a leading technology company focused on building innovative solutions that transform how people work and connect. We're passionate about creating products that make a real difference in people's lives.`,
      industry: 'Technology',
      size: '1,000-5,000 employees',
      location: 'San Francisco, CA',
      website: `https://${companyId}.com`,
      founded: '2015',
      followers: Math.floor(Math.random() * 50000) + 10000,
      isFollowing: false,
      openJobs: [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          company: companyId === 'techcorp' ? 'TechCorp' : 'InnovateCorp',
          companyId: companyId,
          logo: `https://picsum.photos/seed/${companyId}/100/100`,
          location: 'San Francisco, CA',
          type: 'Full-time',
          salary: '$140k - $180k',
          posted: '2 days ago',
          skills: ['React', 'TypeScript', 'Node.js']
        },
        {
          id: 2,
          title: 'Product Manager',
          company: companyId === 'techcorp' ? 'TechCorp' : 'InnovateCorp',
          companyId: companyId,
          logo: `https://picsum.photos/seed/${companyId}/100/100`,
          location: 'Remote',
          type: 'Full-time',
          salary: '$120k - $160k',
          posted: '1 week ago',
          skills: ['Product Strategy', 'Analytics', 'Leadership']
        }
      ],
      culture: {
        values: ['Innovation', 'Collaboration', 'Integrity', 'Growth'],
        benefits: ['Health Insurance', 'Remote Work', '401k Match', 'Learning Budget', 'Flexible PTO'],
        workEnvironment: 'We foster a collaborative environment where creativity thrives and every voice is heard.'
      },
      recentUpdates: [
        {
          id: '1',
          type: 'job_posted',
          title: 'New Opening: Senior Frontend Developer',
          description: 'Join our growing engineering team and help build the future of work.',
          date: '2 days ago'
        },
        {
          id: '2',
          type: 'company_news',
          title: 'Series B Funding Announcement',
          description: 'We raised $50M to accelerate our mission of transforming workplace collaboration.',
          date: '1 week ago'
        }
      ]
    };

    setCompany(mockCompany);
  }, [companyId]);

  const handleFollowToggle = () => {
    if (!company) return;
    
    if (company.isFollowing) {
      onUnfollowCompany(companyId);
      setCompany(prev => prev ? { ...prev, isFollowing: false, followers: prev.followers - 1 } : null);
    } else {
      onFollowCompany(companyId);
      setCompany(prev => prev ? { ...prev, isFollowing: true, followers: prev.followers + 1 } : null);
    }
  };

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Company Cover & Header */}
      <div className="relative">
        <img
          src={company.coverImage}
          alt={`${company.name} cover`}
          className="w-full h-48 lg:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl border-4 border-white shadow-lg"
              />
              <div className="flex-1 text-white">
                <h1 className="text-2xl lg:text-3xl font-bold">{company.name}</h1>
                <p className="text-lg opacity-90">{company.industry}</p>
                <p className="text-sm opacity-75">{company.location} • {company.followers.toLocaleString()} followers</p>
              </div>
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  company.isFollowing
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {company.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'jobs', label: `Jobs (${company.openJobs.length})` },
              { id: 'culture', label: 'Culture' },
              { id: 'updates', label: 'Updates' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
                <p className="text-gray-600 leading-relaxed">{company.description}</p>
              </div>

              {/* Recent Jobs */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Recent Job Openings</h2>
                <div className="space-y-4">
                  {company.openJobs.slice(0, 2).map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          className="font-semibold text-gray-900 hover:text-primary cursor-pointer"
                          onClick={() => onViewJobDetails(job)}
                        >
                          {job.title}
                        </h3>
                        <span className="text-sm text-gray-500">{job.posted}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{job.location} • {job.type}</p>
                      {job.salary && (
                        <p className="text-gray-700 font-medium text-sm mb-3">{job.salary}</p>
                      )}
                      <button
                        onClick={() => onApplyJob(job)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
                {company.openJobs.length > 2 && (
                  <button
                    onClick={() => setActiveTab('jobs')}
                    className="mt-4 text-primary hover:text-primary-dark font-medium"
                  >
                    View all {company.openJobs.length} jobs →
                  </button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold mb-4">Company Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Industry:</span>
                    <span className="ml-2 text-gray-900">{company.industry}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Company size:</span>
                    <span className="ml-2 text-gray-900">{company.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Founded:</span>
                    <span className="ml-2 text-gray-900">{company.founded}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Website:</span>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline">
                      {company.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Apply */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <h3 className="font-bold text-primary mb-2">Interested in working here?</h3>
                <p className="text-sm text-gray-600 mb-4">Follow {company.name} to get notified about new job openings.</p>
                <button
                  onClick={handleFollowToggle}
                  className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  {company.isFollowing ? 'Following' : 'Follow Company'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Open Positions at {company.name}</h2>
            <div className="grid gap-6">
              {company.openJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 
                        className="text-xl font-semibold text-gray-900 hover:text-primary cursor-pointer"
                        onClick={() => onViewJobDetails(job)}
                      >
                        {job.title}
                      </h3>
                      <p className="text-gray-600">{job.location} • {job.type}</p>
                      {job.salary && (
                        <p className="text-gray-700 font-medium mt-1">{job.salary}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{job.posted}</span>
                  </div>
                  
                  {job.skills && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => onApplyJob(job)}
                      className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => onViewJobDetails(job)}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Culture & Values</h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Values */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Our Values</h3>
                <div className="grid grid-cols-2 gap-4">
                  {company.culture.values.map((value, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">⭐</div>
                      <div className="font-medium text-gray-900">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold mb-4">Benefits & Perks</h3>
                <div className="space-y-3">
                  {company.culture.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Work Environment */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Work Environment</h3>
              <p className="text-gray-600 leading-relaxed">{company.culture.workEnvironment}</p>
            </div>
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Company Updates</h2>
            <div className="space-y-4">
              {company.recentUpdates.map((update) => (
                <div key={update.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      update.type === 'job_posted' ? 'bg-blue-100 text-blue-600' :
                      update.type === 'company_news' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {update.type === 'job_posted' ? '💼' :
                       update.type === 'company_news' ? '📢' : '🏆'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{update.title}</h3>
                      <p className="text-gray-600 mb-2">{update.description}</p>
                      <span className="text-sm text-gray-500">{update.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfilePage;