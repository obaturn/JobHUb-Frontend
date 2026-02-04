import React, { useState } from 'react';
import { Company, User } from '../../types';

interface CompanyFollowingProps {
  user: User;
  onViewCompanyProfile: (companyId: string) => void;
  onFollowCompany: (companyId: string) => void;
  onUnfollowCompany: (companyId: string) => void;
}

interface CompanyUpdate {
  id: string;
  companyId: string;
  company: {
    id: string;
    name: string;
    logo: string;
  };
  type: 'hiring' | 'news' | 'culture' | 'product';
  title: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  openPositions?: number;
}

const CompanyFollowing: React.FC<CompanyFollowingProps> = ({
  user,
  onViewCompanyProfile,
  onFollowCompany,
  onUnfollowCompany
}) => {
  const [followedCompanies] = useState<Company[]>([
    {
      id: 'techcorp',
      name: 'TechCorp',
      logo: 'https://picsum.photos/seed/techcorp/100/100',
      tagline: 'Building the future',
      about: 'Leading technology company',
      website: 'techcorp.com',
      location: 'San Francisco, CA',
      size: '1,000-5,000 employees',
      industry: 'Technology'
    },
    {
      id: 'innovate-inc',
      name: 'Innovate Inc.',
      logo: 'https://picsum.photos/seed/innovate/100/100',
      tagline: 'Innovation at scale',
      about: 'Innovative solutions provider',
      website: 'innovate.com',
      location: 'New York, NY',
      size: '500-1,000 employees',
      industry: 'Technology'
    }
  ]);

  const [companyUpdates] = useState<CompanyUpdate[]>([
    {
      id: '1',
      companyId: 'techcorp',
      company: {
        id: 'techcorp',
        name: 'TechCorp',
        logo: 'https://picsum.photos/seed/techcorp/100/100'
      },
      type: 'hiring',
      title: 'We\'re hiring!',
      content: 'Join our growing engineering team. We\'re looking for passionate developers who want to build the future of technology.',
      image: 'https://picsum.photos/seed/hiring1/600/300',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      openPositions: 5
    },
    {
      id: '2',
      companyId: 'innovate-inc',
      company: {
        id: 'innovate-inc',
        name: 'Innovate Inc.',
        logo: 'https://picsum.photos/seed/innovate/100/100'
      },
      type: 'culture',
      title: 'Team building day!',
      content: 'Our team had an amazing day at the beach building sandcastles and strengthening our bonds. This is what makes our culture special.',
      image: 'https://picsum.photos/seed/team/600/300',
      timestamp: '1 day ago',
      likes: 42,
      comments: 15
    },
    {
      id: '3',
      companyId: 'techcorp',
      company: {
        id: 'techcorp',
        name: 'TechCorp',
        logo: 'https://picsum.photos/seed/techcorp/100/100'
      },
      type: 'product',
      title: 'New product launch',
      content: 'We\'re excited to announce the launch of our new AI-powered platform that will revolutionize how businesses operate.',
      timestamp: '3 days ago',
      likes: 156,
      comments: 32
    }
  ]);

  const [suggestedCompanies] = useState([
    {
      id: 'google',
      name: 'Google',
      logo: 'https://picsum.photos/seed/google/100/100',
      industry: 'Technology',
      followers: '15M',
      reason: 'Similar to companies you follow'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      logo: 'https://picsum.photos/seed/microsoft/100/100',
      industry: 'Technology',
      followers: '12M',
      reason: 'Popular in your network'
    },
    {
      id: 'apple',
      name: 'Apple',
      logo: 'https://picsum.photos/seed/apple/100/100',
      industry: 'Technology',
      followers: '18M',
      reason: 'Trending in your industry'
    }
  ]);

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'hiring':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'culture':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'product':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Following Companies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Companies you follow</h2>
          <span className="text-sm text-gray-500">{followedCompanies.length} companies</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {followedCompanies.map((company) => (
            <div key={company.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <img
                src={company.logo}
                alt={company.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 
                  className="font-semibold text-gray-900 hover:text-primary cursor-pointer"
                  onClick={() => onViewCompanyProfile(company.id)}
                >
                  {company.name}
                </h3>
                <p className="text-sm text-gray-500">{company.industry}</p>
              </div>
              <button
                onClick={() => onUnfollowCompany(company.id)}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
              >
                Following
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Company Updates Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Updates from companies you follow</h2>
        
        {companyUpdates.map((update) => (
          <div key={update.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              {getUpdateIcon(update.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={update.company.logo}
                    alt={update.company.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span className="font-semibold text-gray-900">{update.company.name}</span>
                  <span className="text-sm text-gray-500">• {update.timestamp}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{update.title}</h3>
                <p className="text-gray-700 mb-4">{update.content}</p>
                
                {update.image && (
                  <img
                    src={update.image}
                    alt="Update"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                
                {update.openPositions && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-green-800 font-medium">
                      🎯 {update.openPositions} open positions available
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <button className="flex items-center gap-2 hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {update.likes} likes
                  </button>
                  <button className="flex items-center gap-2 hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {update.comments} comments
                  </button>
                  <button className="flex items-center gap-2 hover:text-primary transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Companies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested companies to follow</h3>
        
        <div className="space-y-4">
          {suggestedCompanies.map((company) => (
            <div key={company.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <img
                src={company.logo}
                alt={company.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{company.name}</h4>
                <p className="text-sm text-gray-600">{company.industry} • {company.followers} followers</p>
                <p className="text-xs text-gray-500 mt-1">{company.reason}</p>
              </div>
              <button
                onClick={() => onFollowCompany(company.id)}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                + Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyFollowing;