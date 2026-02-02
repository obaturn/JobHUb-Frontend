/**
 * Salary Insights Dashboard
 * Interactive salary data visualization and market trends
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SalaryData {
  role: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  growth: number;
  demand: 'high' | 'medium' | 'low';
  experience: 'entry' | 'mid' | 'senior';
  location: string;
}

interface SalaryInsightsProps {
  className?: string;
}

const SalaryInsights: React.FC<SalaryInsightsProps> = ({ className = '' }) => {
  const [selectedRole, setSelectedRole] = useState<string>('Software Engineer');
  const [selectedLocation, setSelectedLocation] = useState<string>('San Francisco');
  const [animatedSalary, setAnimatedSalary] = useState(0);

  // Mock salary data
  const salaryData: SalaryData[] = [
    {
      role: 'Software Engineer',
      minSalary: 95000,
      maxSalary: 180000,
      avgSalary: 135000,
      growth: 12,
      demand: 'high',
      experience: 'mid',
      location: 'San Francisco'
    },
    {
      role: 'Product Manager',
      minSalary: 110000,
      maxSalary: 200000,
      avgSalary: 155000,
      growth: 8,
      demand: 'high',
      experience: 'mid',
      location: 'San Francisco'
    },
    {
      role: 'Data Scientist',
      minSalary: 100000,
      maxSalary: 170000,
      avgSalary: 140000,
      growth: 15,
      demand: 'high',
      experience: 'mid',
      location: 'San Francisco'
    },
    {
      role: 'UX Designer',
      minSalary: 80000,
      maxSalary: 140000,
      avgSalary: 110000,
      growth: 10,
      demand: 'medium',
      experience: 'mid',
      location: 'San Francisco'
    },
    {
      role: 'DevOps Engineer',
      minSalary: 90000,
      maxSalary: 160000,
      avgSalary: 125000,
      growth: 18,
      demand: 'high',
      experience: 'mid',
      location: 'San Francisco'
    }
  ];

  const locations = ['San Francisco', 'New York', 'Seattle', 'Austin', 'Remote'];
  const roles = salaryData.map(d => d.role);

  // Get current salary data
  const currentData = salaryData.find(d => d.role === selectedRole) || salaryData[0];

  // Animate salary counter
  useEffect(() => {
    let start = 0;
    const end = currentData.avgSalary;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedSalary(end);
        clearInterval(timer);
      } else {
        setAnimatedSalary(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [currentData.avgSalary]);

  // Format salary
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get demand color
  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Salary range visualization
  const SalaryBar = ({ data }: { data: SalaryData }) => {
    const range = data.maxSalary - data.minSalary;
    const avgPosition = ((data.avgSalary - data.minSalary) / range) * 100;

    return (
      <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Gradient background */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 origin-left"
        />
        
        {/* Average marker */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: `${avgPosition}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transform -translate-x-1/2"
          style={{ left: `${avgPosition}%` }}
        />
        
        {/* Labels */}
        <div className="absolute -bottom-6 left-0 text-xs text-gray-600">
          {formatSalary(data.minSalary)}
        </div>
        <div className="absolute -bottom-6 right-0 text-xs text-gray-600">
          {formatSalary(data.maxSalary)}
        </div>
        <div 
          className="absolute -top-8 text-sm font-semibold text-gray-900 transform -translate-x-1/2"
          style={{ left: `${avgPosition}%` }}
        >
          {formatSalary(data.avgSalary)}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Salary Insights</h3>
            <p className="text-gray-600">Real-time market data and trends</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Salary Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedRole}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          {/* Average Salary */}
          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {formatSalary(animatedSalary)}
            </div>
            <div className="text-lg text-gray-600">Average Salary</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDemandColor(currentData.demand)}`}>
                {currentData.demand} demand
              </span>
              <span className="text-green-600 font-medium">
                ↗️ +{currentData.growth}% this year
              </span>
            </div>
          </div>

          {/* Salary Range Visualization */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Salary Range</h4>
            <div className="relative px-4 py-8">
              <SalaryBar data={currentData} />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Min Salary', value: formatSalary(currentData.minSalary), icon: '📉' },
          { label: 'Max Salary', value: formatSalary(currentData.maxSalary), icon: '📈' },
          { label: 'Growth Rate', value: `+${currentData.growth}%`, icon: '🚀' },
          { label: 'Job Openings', value: '1,247', icon: '💼' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-semibold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Market Trends */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Trends</h4>
        <div className="space-y-3">
          {[
            { trend: 'Remote work increasing salaries by 8-12%', icon: '🏠', color: 'text-green-600' },
            { trend: 'AI/ML skills commanding 25% premium', icon: '🤖', color: 'text-blue-600' },
            { trend: 'Startup equity packages more competitive', icon: '🚀', color: 'text-purple-600' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`font-medium ${item.color}`}>{item.trend}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Personalized Salary Report
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SalaryInsights;