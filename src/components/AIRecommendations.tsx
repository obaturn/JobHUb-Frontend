/**
 * AI-Powered Recommendations Component
 * Smart job matching and career path suggestions using AI
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  matchReasons: string[];
  skills: string[];
  type: 'perfect' | 'good' | 'potential';
  logo: string;
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'high' | 'medium' | 'low';
  learningPath: string[];
}

interface CareerPath {
  id: string;
  title: string;
  currentRole: string;
  targetRole: string;
  timeline: string;
  steps: string[];
  salaryGrowth: string;
  probability: number;
}

interface AIRecommendationsProps {
  className?: string;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'skills' | 'career'>('jobs');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Mock AI recommendations data
  const jobRecommendations: JobRecommendation[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco',
      salary: '$140k-$180k',
      matchScore: 95,
      matchReasons: ['React expertise', '5+ years experience', 'TypeScript skills'],
      skills: ['React', 'TypeScript', 'Node.js'],
      type: 'perfect',
      logo: '🚀'
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$120k-$160k',
      matchScore: 87,
      matchReasons: ['Full-stack experience', 'Startup background', 'Remote work ready'],
      skills: ['React', 'Python', 'AWS'],
      type: 'good',
      logo: '⚡'
    },
    {
      id: '3',
      title: 'Tech Lead',
      company: 'InnovateCo',
      location: 'New York',
      salary: '$160k-$200k',
      matchScore: 78,
      matchReasons: ['Leadership potential', 'Technical depth', 'Team experience'],
      skills: ['Leadership', 'Architecture', 'Mentoring'],
      type: 'potential',
      logo: '🎯'
    }
  ];

  const skillGaps: SkillGap[] = [
    {
      skill: 'Machine Learning',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'high',
      learningPath: ['Python Basics', 'Statistics', 'TensorFlow', 'Deep Learning']
    },
    {
      skill: 'System Design',
      currentLevel: 3,
      requiredLevel: 5,
      priority: 'high',
      learningPath: ['Scalability Patterns', 'Database Design', 'Microservices']
    },
    {
      skill: 'DevOps',
      currentLevel: 2,
      requiredLevel: 4,
      priority: 'medium',
      learningPath: ['Docker', 'Kubernetes', 'CI/CD', 'AWS']
    }
  ];

  const careerPaths: CareerPath[] = [
    {
      id: '1',
      title: 'Technical Leadership Track',
      currentRole: 'Senior Developer',
      targetRole: 'Engineering Manager',
      timeline: '18-24 months',
      steps: ['Lead a team project', 'Mentor junior developers', 'Take management course', 'Apply for team lead role'],
      salaryGrowth: '+$40k-$60k',
      probability: 85
    },
    {
      id: '2',
      title: 'Technical Specialist Track',
      currentRole: 'Senior Developer',
      targetRole: 'Principal Engineer',
      timeline: '2-3 years',
      steps: ['Master system design', 'Contribute to architecture', 'Become domain expert', 'Lead technical initiatives'],
      salaryGrowth: '+$50k-$80k',
      probability: 78
    }
  ];

  // Simulate AI analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalysisComplete(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getMatchBadge = (type: string) => {
    switch (type) {
      case 'perfect': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'potential': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <motion.svg
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </motion.svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">AI Career Assistant</h3>
              <p className="text-gray-600">Personalized recommendations powered by machine learning</p>
            </div>
          </div>

          <motion.button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : (
              'Run AI Analysis'
            )}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'jobs', label: 'Job Matches', icon: '💼' },
            { id: 'skills', label: 'Skill Gaps', icon: '📈' },
            { id: 'career', label: 'Career Paths', icon: '🎯' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          {!analysisComplete ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h4>
              <p className="text-gray-600">Analyzing your profile and market data...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Job Recommendations */}
              {activeTab === 'jobs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Recommended Jobs</h4>
                    <span className="text-sm text-gray-500">{jobRecommendations.length} matches found</span>
                  </div>

                  {jobRecommendations.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                            {job.logo}
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">{job.title}</h5>
                            <p className="text-gray-600">{job.company} • {job.location}</p>
                            <p className="text-green-600 font-medium">{job.salary}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getMatchColor(job.matchScore)}`}>
                            {job.matchScore}%
                          </div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getMatchBadge(job.type)}`}>
                            {job.type} match
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h6 className="font-medium text-gray-900 mb-2">Why this matches:</h6>
                        <div className="flex flex-wrap gap-2">
                          {job.matchReasons.map((reason, idx) => (
                            <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Skill Gaps */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Skill Development Plan</h4>
                    <span className="text-sm text-gray-500">Based on market demand</span>
                  </div>

                  {skillGaps.map((gap, index) => (
                    <motion.div
                      key={gap.skill}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h5 className="font-semibold text-gray-900">{gap.skill}</h5>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(gap.priority)}`}>
                            {gap.priority} priority
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Current: {gap.currentLevel}/5</div>
                          <div className="text-sm text-gray-600">Target: {gap.requiredLevel}/5</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{gap.currentLevel}/{gap.requiredLevel}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </div>

                      {/* Learning Path */}
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Recommended Learning Path:</h6>
                        <div className="flex flex-wrap gap-2">
                          {gap.learningPath.map((step, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {idx + 1}. {step}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Career Paths */}
              {activeTab === 'career' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Career Path Recommendations</h4>
                    <span className="text-sm text-gray-500">AI-predicted trajectories</span>
                  </div>

                  {careerPaths.map((path, index) => (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h5 className="font-semibold text-gray-900">{path.title}</h5>
                          <p className="text-gray-600">{path.currentRole} → {path.targetRole}</p>
                          <p className="text-sm text-gray-500">{path.timeline}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">{path.probability}%</div>
                          <div className="text-sm text-gray-600">Success Rate</div>
                          <div className="text-green-600 font-medium">{path.salaryGrowth}</div>
                        </div>
                      </div>

                      <div>
                        <h6 className="font-medium text-gray-900 mb-3">Action Steps:</h6>
                        <div className="space-y-2">
                          {path.steps.map((step, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index * 0.1) + (idx * 0.05) }}
                              className="flex items-center gap-3"
                            >
                              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {idx + 1}
                              </div>
                              <span className="text-gray-700">{step}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AIRecommendations;