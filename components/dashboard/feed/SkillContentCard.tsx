import React from 'react';
import { motion } from 'framer-motion';

interface SkillContentCardProps {
  skillData: {
    type: 'skill_recommendation' | 'course_suggestion' | 'certification';
    skill: string;
    reason: string;
    courses?: number;
    avgSalaryIncrease?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    timeToComplete?: string;
  };
  timestamp: Date;
}

const SkillContentCard: React.FC<SkillContentCardProps> = ({
  skillData,
  timestamp
}) => {
  const getSkillIcon = () => {
    switch (skillData.type) {
      case 'skill_recommendation':
        return '🎯';
      case 'course_suggestion':
        return '📚';
      case 'certification':
        return '🏆';
      default:
        return '💡';
    }
  };

  const getSkillColor = () => {
    switch (skillData.type) {
      case 'skill_recommendation':
        return 'text-blue-600';
      case 'course_suggestion':
        return 'text-green-600';
      case 'certification':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'Advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const getTypeLabel = () => {
    switch (skillData.type) {
      case 'skill_recommendation':
        return 'Skill Recommendation';
      case 'course_suggestion':
        return 'Course Suggestion';
      case 'certification':
        return 'Certification Opportunity';
      default:
        return 'Skill Development';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getSkillIcon()}</span>
          <span className={`text-sm font-medium ${getSkillColor()}`}>
            {getTypeLabel()}
          </span>
        </div>
        <span className="text-sm text-gray-500">{formatTimeAgo(timestamp)}</span>
      </div>

      {/* Skill Content */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Learn {skillData.skill}
          </h3>
          {skillData.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(skillData.difficulty)}`}>
              {skillData.difficulty}
            </span>
          )}
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-4">
          {skillData.reason}
        </p>

        {/* Skill Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skillData.avgSalaryIncrease && (
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  +{skillData.avgSalaryIncrease}
                </div>
                <div className="text-xs text-gray-600">Avg Salary Increase</div>
              </div>
            )}
            
            {skillData.courses && (
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {skillData.courses}
                </div>
                <div className="text-xs text-gray-600">Available Courses</div>
              </div>
            )}
            
            {skillData.timeToComplete && (
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {skillData.timeToComplete}
                </div>
                <div className="text-xs text-gray-600">Time to Complete</div>
              </div>
            )}
          </div>
        </div>

        {/* Learning Path Preview */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Learning Path</h4>
          <div className="space-y-2">
            {[
              'Fundamentals & Core Concepts',
              'Hands-on Projects & Practice',
              'Advanced Techniques & Best Practices',
              'Real-world Application & Portfolio'
            ].map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
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
            <span className="text-sm">Save for Later</span>
          </button>
          
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">More Info</span>
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Learning
        </motion.button>
      </div>
    </div>
  );
};

export default SkillContentCard;