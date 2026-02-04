import React, { useState } from 'react';
import { User, Job } from '../../types';

interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  location: string;
  experience: string;
  skills: string[];
  appliedFor: Job;
  appliedDate: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';
  resumeUrl?: string;
  coverLetter?: string;
  matchScore: number;
}

interface CandidateManagementProps {
  jobs: Job[];
  onViewCandidate: (candidateId: string) => void;
  onUpdateCandidateStatus: (candidateId: string, status: string) => void;
  onScheduleInterview: (candidateId: string) => void;
  onSendMessage: (candidateId: string) => void;
}

const CandidateManagement: React.FC<CandidateManagementProps> = ({
  jobs,
  onViewCandidate,
  onUpdateCandidateStatus,
  onScheduleInterview,
  onSendMessage
}) => {
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock candidates data
  const mockCandidates: Candidate[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      avatar: 'https://picsum.photos/seed/sarah/200/200',
      headline: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      experience: '5 years',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      appliedFor: jobs[0] || { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp' } as Job,
      appliedDate: '2024-01-15',
      status: 'new',
      matchScore: 95,
      coverLetter: 'I am excited to apply for this position...'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      avatar: 'https://picsum.photos/seed/michael/200/200',
      headline: 'Full Stack Developer',
      location: 'New York, NY',
      experience: '3 years',
      skills: ['React', 'Python', 'Django', 'PostgreSQL'],
      appliedFor: jobs[0] || { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp' } as Job,
      appliedDate: '2024-01-14',
      status: 'reviewing',
      matchScore: 87
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      avatar: 'https://picsum.photos/seed/emily/200/200',
      headline: 'Product Manager',
      location: 'Austin, TX',
      experience: '4 years',
      skills: ['Product Strategy', 'Analytics', 'Agile', 'Leadership'],
      appliedFor: jobs[1] || { id: 2, title: 'Product Manager', company: 'TechCorp' } as Job,
      appliedDate: '2024-01-13',
      status: 'shortlisted',
      matchScore: 92
    }
  ];

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesJob = selectedJob === 'all' || candidate.appliedFor.id.toString() === selectedJob;
    const matchesStatus = selectedStatus === 'all' || candidate.status === selectedStatus;
    const matchesSearch = searchTerm === '' || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'interviewed':
        return 'bg-indigo-100 text-indigo-800';
      case 'offered':
        return 'bg-green-100 text-green-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Candidate Management</h1>
        <p className="text-gray-600">Review and manage job applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Candidates</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, role, or skills..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Job</label>
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id.toString()}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Export List
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: mockCandidates.length, color: 'bg-blue-500' },
          { label: 'New Applications', value: mockCandidates.filter(c => c.status === 'new').length, color: 'bg-green-500' },
          { label: 'Shortlisted', value: mockCandidates.filter(c => c.status === 'shortlisted').length, color: 'bg-purple-500' },
          { label: 'Hired', value: mockCandidates.filter(c => c.status === 'hired').length, color: 'bg-emerald-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Candidates ({filteredCandidates.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {getStatusLabel(candidate.status)}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {candidate.matchScore}% match
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-1">{candidate.headline}</p>
                    <p className="text-sm text-gray-500 mb-2">{candidate.location} • {candidate.experience} experience</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">Applied for:</span>
                      <span className="text-sm font-medium text-gray-900">{candidate.appliedFor.title}</span>
                      <span className="text-sm text-gray-500">• {new Date(candidate.appliedDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 4 && (
                        <span className="text-xs text-gray-500">+{candidate.skills.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <select
                    value={candidate.status}
                    onChange={(e) => onUpdateCandidateStatus(candidate.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="offered">Offered</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onViewCandidate(candidate.id)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  View Profile
                </button>
                
                <button
                  onClick={() => onScheduleInterview(candidate.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Schedule Interview
                </button>
                
                <button
                  onClick={() => onSendMessage(candidate.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Send Message
                </button>

                {candidate.resumeUrl && (
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 font-medium">No candidates found</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateManagement;