import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Simple, professional market insights section inspired by LinkedIn and Indeed
const MarketInsightsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const marketStats = [
    { label: 'Active Jobs', value: '2.3M+', change: '+12%', trend: 'up' },
    { label: 'New This Week', value: '45K', change: '+8%', trend: 'up' },
    { label: 'Companies Hiring', value: '150K+', change: '+15%', trend: 'up' },
    { label: 'Avg. Response Time', value: '3 days', change: '-20%', trend: 'down' }
  ];

  const topIndustries = [
    { name: 'Technology', jobs: '450K+', growth: '+18%' },
    { name: 'Healthcare', jobs: '320K+', growth: '+12%' },
    { name: 'Finance', jobs: '280K+', growth: '+9%' },
    { name: 'Education', jobs: '190K+', growth: '+7%' },
    { name: 'Retail', jobs: '380K+', growth: '+5%' }
  ];

  const salaryRanges = [
    { role: 'Software Engineer', range: '$80K - $150K', median: '$115K' },
    { role: 'Product Manager', range: '$90K - $160K', median: '$125K' },
    { role: 'Data Scientist', range: '$85K - $145K', median: '$110K' },
    { role: 'UX Designer', range: '$70K - $130K', median: '$95K' }
  ];

  return (
    <section className="bg-white py-16 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Job Market Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest trends and data from the job market
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'industries', label: 'Industries' },
              { id: 'salaries', label: 'Salaries' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Market Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {marketStats.map((stat, index) => (
                  <div key={stat.label} className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {stat.label}
                    </div>
                    <div className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} this month
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Market Activity
                </h3>
                <div className="space-y-3">
                  {[
                    'TechCorp posted 15 new Software Engineer positions',
                    'Healthcare Plus is actively hiring Nurses nationwide',
                    'FinanceFirst increased salaries by 8% across all roles',
                    'StartupXYZ just raised Series A, expanding team by 50%'
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'industries' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topIndustries.map((industry, index) => (
                  <div key={industry.name} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {industry.name}
                      </h3>
                      <span className="text-sm text-green-600 font-medium">
                        {industry.growth}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {industry.jobs}
                    </div>
                    <div className="text-sm text-gray-600">
                      Open positions
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'salaries' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                {salaryRanges.map((salary, index) => (
                  <div key={salary.role} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {salary.role}
                        </h3>
                        <div className="text-sm text-gray-600">
                          Salary Range: <span className="font-medium">{salary.range}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {salary.median}
                        </div>
                        <div className="text-sm text-gray-600">
                          Median
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Ready to find your next opportunity?
            </h3>
            <p className="text-gray-600 mb-6">
              Browse thousands of jobs from top companies
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Search Jobs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketInsightsSection;