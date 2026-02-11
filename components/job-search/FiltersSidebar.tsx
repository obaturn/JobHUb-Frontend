
import React, { useState } from 'react';

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}> = ({ title, children, isExpanded = true, onToggle }) => (
  <div className="py-6 border-b border-gray-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left group"
    >
      <h3 className="text-lg font-semibold text-neutral-dark group-hover:text-primary transition-colors">
        {title}
      </h3>
      {onToggle && (
        <svg
          className={`w-5 h-5 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </button>
    {isExpanded && (
      <div className="mt-4 space-y-3 animate-fade-in">{children}</div>
    )}
  </div>
);

const Checkbox: React.FC<{
  id: string;
  label: string;
  count?: number;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}> = ({ id, label, count, checked = false, onChange }) => (
  <div className="flex items-center group">
    <input
      id={id}
      name={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 transition-colors"
    />
    <label
      htmlFor={id}
      className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 cursor-pointer flex-1 flex items-center justify-between"
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </label>
  </div>
);

const RangeSlider: React.FC<{
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}> = ({ min, max, value, onChange, step = 1000 }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1]);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0]);
    onChange([value[0], newMax]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>${value[0].toLocaleString()}</span>
        <span>${value[1].toLocaleString()}+</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMinChange}
          step={step}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          step={step}
          className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>
    </div>
  );
};

const FiltersSidebar: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    experience: true,
    salary: true,
    location: false,
    company: false,
  });

  const [filters, setFilters] = useState({
    jobType: {
      'full-time': false,
      'part-time': false,
      'contract': false,
      'freelance': false,
    },
    experience: {
      'entry': false,
      'mid': false,
      'senior': false,
      'lead': false,
    },
    salary: [50000, 150000] as [number, number],
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleJobTypeChange = (type: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      jobType: { ...prev.jobType, [type]: checked }
    }));
  };

  const handleExperienceChange = (level: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      experience: { ...prev.experience, [level]: checked }
    }));
  };

  const activeFiltersCount = Object.values(filters.jobType).filter(Boolean).length +
                            Object.values(filters.experience).filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-dark">Filter Jobs</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">Refine your search results</p>
      </div>

      <div className="p-6 space-y-0">
        <FilterSection
          title="Job Type"
          isExpanded={expandedSections.jobType}
          onToggle={() => toggleSection('jobType')}
        >
          <Checkbox
            id="full-time"
            label="Full-time"
            count={8}
            checked={filters.jobType['full-time']}
            onChange={(checked) => handleJobTypeChange('full-time', checked)}
          />
          <Checkbox
            id="part-time"
            label="Part-time"
            count={3}
            checked={filters.jobType['part-time']}
            onChange={(checked) => handleJobTypeChange('part-time', checked)}
          />
          <Checkbox
            id="contract"
            label="Contract"
            count={2}
            checked={filters.jobType['contract']}
            onChange={(checked) => handleJobTypeChange('contract', checked)}
          />
          <Checkbox
            id="freelance"
            label="Freelance"
            count={1}
            checked={filters.jobType['freelance']}
            onChange={(checked) => handleJobTypeChange('freelance', checked)}
          />
        </FilterSection>

        <FilterSection
          title="Experience Level"
          isExpanded={expandedSections.experience}
          onToggle={() => toggleSection('experience')}
        >
          <Checkbox
            id="entry"
            label="Entry Level"
            count={2}
            checked={filters.experience['entry']}
            onChange={(checked) => handleExperienceChange('entry', checked)}
          />
          <Checkbox
            id="mid"
            label="Mid Level"
            count={5}
            checked={filters.experience['mid']}
            onChange={(checked) => handleExperienceChange('mid', checked)}
          />
          <Checkbox
            id="senior"
            label="Senior Level"
            count={6}
            checked={filters.experience['senior']}
            onChange={(checked) => handleExperienceChange('senior', checked)}
          />
          <Checkbox
            id="lead"
            label="Lead/Principal"
            count={1}
            checked={filters.experience['lead']}
            onChange={(checked) => handleExperienceChange('lead', checked)}
          />
        </FilterSection>

        <FilterSection
          title="Salary Range"
          isExpanded={expandedSections.salary}
          onToggle={() => toggleSection('salary')}
        >
          <RangeSlider
            min={30000}
            max={200000}
            value={filters.salary}
            onChange={(value) => setFilters(prev => ({ ...prev, salary: value }))}
          />
        </FilterSection>

        <FilterSection
          title="Location"
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter location..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remote"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remote" className="text-sm text-gray-600">Remote work</label>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Company"
          isExpanded={expandedSections.company}
          onToggle={() => toggleSection('company')}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </FilterSection>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="space-y-3">
          <button className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold">
            Apply Filters
          </button>
          <button className="w-full text-gray-600 hover:text-primary py-2 px-4 rounded-lg transition-colors font-medium">
            Reset All Filters
          </button>
        </div>
        {activeFiltersCount > 0 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-primary hover:text-primary-dark font-medium">
              Clear {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default FiltersSidebar;
