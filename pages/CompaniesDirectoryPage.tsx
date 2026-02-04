import React, { useState } from 'react';
import { Company } from '../types';
import { MOCK_COMPANIES } from '../constants';

interface CompaniesDirectoryPageProps {
  onViewCompanyProfile: (companyId: string) => void;
  onNavigate: (page: any) => void;
}

const CompaniesDirectoryPage: React.FC<CompaniesDirectoryPageProps> = ({ 
  onViewCompanyProfile, 
  onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');

  // Get unique industries and sizes for filters
  const industries = ['All', ...Array.from(new Set(MOCK_COMPANIES.map(c => c.industry)))];
  const sizes = ['All', ...Array.from(new Set(MOCK_COMPANIES.map(c => c.size)))];

  // Filter companies based on search and filters
  const filteredCompanies = MOCK_COMPANIES.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || company.industry === selectedIndustry;
    const matchesSize = selectedSize === 'All' || company.size === selectedSize;
    
    return matchesSearch && matchesIndustry && matchesSize;
  });

  const featuredCompanies = MOCK_COMPANIES.slice(0, 6);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Companies
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore top companies, learn about their culture, and find your next opportunity
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Companies
              </label>
              <input
                type="text"
                id="search"
                placeholder="Company name or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Industry Filter */}
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                id="industry"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Companies */}
        {searchTerm === '' && selectedIndustry === 'All' && selectedSize === 'All' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Companies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCompanies.map(company => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => onViewCompanyProfile(company.id)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {company.tagline}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{company.size}</span>
                      <span>{company.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Companies */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchTerm || selectedIndustry !== 'All' || selectedSize !== 'All' 
                ? `Companies (${filteredCompanies.length})` 
                : 'All Companies'}
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredCompanies.length} of {MOCK_COMPANIES.length} companies
            </div>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('All');
                  setSelectedSize('All');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map(company => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => onViewCompanyProfile(company.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start mb-4">
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="w-12 h-12 rounded-lg object-cover mr-3 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {company.name}
                        </h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {company.about.substring(0, 120)}...
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>📍 {company.location}</span>
                        <span>👥 {company.size}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🌐 {company.website}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCompanyProfile(company.id);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Profile →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Can't find the company you're looking for?
            </h3>
            <p className="text-gray-600 mb-6">
              Browse our job listings to discover more opportunities
            </p>
            <button
              onClick={() => onNavigate('job_search')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesDirectoryPage;