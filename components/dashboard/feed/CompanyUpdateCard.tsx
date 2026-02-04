import React from 'react';
import { motion } from 'framer-motion';

interface CompanyUpdateCardProps {
  company: {
    id: string;
    name: string;
    logo: string;
  };
  update: {
    type: 'job_posting' | 'company_news' | 'achievement';
    content: string;
    image?: string;
    jobCount?: number;
    funding?: string;
  };
  timestamp: Date;
  onViewCompany: () => void;
}

const CompanyUpdateCard: React.FC<CompanyUpdateCardProps> = ({
  company,
  update,
  timestamp,
  onViewCompany
}) => {
  const getUpdateIcon = () => {
    switch (update.type) {
      case 'job_posting':
        return '💼';
      case 'company_news':
        return '📢';
      case 'achievement':
        return '🏆';
      default:
        return '📰';
    }
  };

  const getUpdateLabel = () => {
    switch (update.type) {
      case 'job_posting':
        return 'New Job Openings';
      case 'company_news':
        return 'Company Update';
      case 'achievement':
        return 'Achievement';
      default:
        return 'Update';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getUpdateIcon()}</span>
          <span className="text-sm font-medium text-purple-600">{getUpdateLabel()}</span>
        </div>
        <span className="text-sm text-gray-500">{formatTimeAgo(timestamp)}</span>
      </div>

      {/* Company Info */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div>
          <button
            onClick={onViewCompany}
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {company.name}
          </button>
          <p className="text-sm text-gray-500">Company</p>
        </div>
      </div>

      {/* Update Content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{update.content}</p>
        
        {/* Special content based on update type */}
        {update.type === 'job_posting' && update.jobCount && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-blue-700">
                {update.jobCount} new positions available
              </span>
            </div>
          </div>
        )}

        {update.type === 'company_news' && update.funding && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="text-sm font-medium text-green-700">
                Funding: {update.funding}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Update Image */}
      {update.image && (
        <div className="mb-4">
          <img
            src={update.image}
            alt="Company update"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm">Like</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm">Comment</span>
          </button>
        </div>

        <motion.button
          onClick={onViewCompany}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View Company →
        </motion.button>
      </div>
    </div>
  );
};

export default CompanyUpdateCard;