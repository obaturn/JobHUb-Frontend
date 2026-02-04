import React from 'react';
import { motion } from 'framer-motion';

interface MarketInsightCardProps {
  insight: {
    type: 'salary_trend' | 'skill_demand' | 'industry_growth' | 'job_market';
    title: string;
    content: string;
    trend?: string;
    category: string;
    data?: {
      percentage?: string;
      value?: string;
      comparison?: string;
    };
  };
  timestamp: Date;
}

const MarketInsightCard: React.FC<MarketInsightCardProps> = ({
  insight,
  timestamp
}) => {
  const getInsightIcon = () => {
    switch (insight.type) {
      case 'salary_trend':
        return '💰';
      case 'skill_demand':
        return '🎯';
      case 'industry_growth':
        return '📈';
      case 'job_market':
        return '📊';
      default:
        return '💡';
    }
  };

  const getInsightColor = () => {
    switch (insight.type) {
      case 'salary_trend':
        return 'text-green-600';
      case 'skill_demand':
        return 'text-blue-600';
      case 'industry_growth':
        return 'text-purple-600';
      case 'job_market':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendColor = (trend?: string) => {
    if (!trend) return 'text-gray-600';
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
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
          <span className="text-lg">{getInsightIcon()}</span>
          <span className={`text-sm font-medium ${getInsightColor()}`}>
            Market Insight
          </span>
        </div>
        <span className="text-sm text-gray-500">{formatTimeAgo(timestamp)}</span>
      </div>

      {/* Insight Content */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {insight.title}
          </h3>
          {insight.trend && (
            <div className={`text-lg font-bold ${getTrendColor(insight.trend)} ml-4`}>
              {insight.trend}
            </div>
          )}
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-3">
          {insight.content}
        </p>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Category</p>
              <p className="text-sm text-gray-600">{insight.category}</p>
            </div>
            
            {insight.data && (
              <div className="text-right">
                {insight.data.percentage && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Growth</p>
                    <p className={`text-sm font-semibold ${getTrendColor(insight.data.percentage)}`}>
                      {insight.data.percentage}
                    </p>
                  </div>
                )}
                {insight.data.value && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Value</p>
                    <p className="text-sm text-gray-600">{insight.data.value}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-sm">Save</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm">Share</span>
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
        >
          Learn More →
        </motion.button>
      </div>
    </div>
  );
};

export default MarketInsightCard;