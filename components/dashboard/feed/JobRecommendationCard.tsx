import React from 'react';
import { motion } from 'framer-motion';
import { Job } from '../../../types';

interface JobRecommendationCardProps {
  job: Job;
  reason: string;
  matchPercentage: number;
  onViewDetails: () => void;
  onApply: () => void;
  onSave: () => void;
}

const JobRecommendationCard: React.FC<JobRecommendationCardProps> = ({
  job,
  reason,
  matchPercentage,
  onViewDetails,
  onApply,
  onSave
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-600">Job Recommendation</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            {matchPercentage}% match
          </div>
          <button
            onClick={onSave}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Job Content */}
      <div className="flex items-start space-x-4">
        <img
          src={job.logo}
          alt={`${job.company} logo`}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {job.title}
          </h3>
          <p className="text-gray-600 mb-2">
            {job.company} • {job.location}
          </p>
          
          {job.salary && (
            <p className="text-green-600 font-medium mb-2">{job.salary}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span>{job.type}</span>
            <span>•</span>
            <span>{job.posted}</span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-blue-700 font-medium">Why this job?</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">{reason}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onViewDetails}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View Details
        </button>
        
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={onApply}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Apply Now
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default JobRecommendationCard;