/**
 * Advanced Data Visualizations Component
 * Interactive charts, graphs, and data insights
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChartData {
  label: string;
  value: number;
  color: string;
  trend?: number;
}

interface TimeSeriesData {
  date: string;
  value: number;
  category: string;
}

interface SkillDemandData {
  skill: string;
  demand: number;
  growth: number;
  salary: number;
  jobs: number;
}

interface AdvancedDataVizProps {
  className?: string;
}

const AdvancedDataViz: React.FC<AdvancedDataVizProps> = ({ className = '' }) => {
  const [activeChart, setActiveChart] = useState<'salary' | 'skills' | 'trends' | 'locations'>('salary');
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredData, setHoveredData] = useState<any>(null);

  // Mock data for different visualizations
  const salaryData: ChartData[] = [
    { label: 'Software Engineer', value: 135000, color: '#3B82F6', trend: 12 },
    { label: 'Product Manager', value: 155000, color: '#8B5CF6', trend: 8 },
    { label: 'Data Scientist', value: 140000, color: '#10B981', trend: 15 },
    { label: 'UX Designer', value: 110000, color: '#F59E0B', trend: 10 },
    { label: 'DevOps Engineer', value: 125000, color: '#EF4444', trend: 18 },
  ];

  const skillDemandData: SkillDemandData[] = [
    { skill: 'React', demand: 95, growth: 25, salary: 125000, jobs: 15420 },
    { skill: 'Python', demand: 92, growth: 20, salary: 130000, jobs: 18750 },
    { skill: 'AWS', demand: 88, growth: 30, salary: 140000, jobs: 12340 },
    { skill: 'TypeScript', demand: 85, growth: 35, salary: 120000, jobs: 8920 },
    { skill: 'Docker', demand: 82, growth: 28, salary: 115000, jobs: 6780 },
    { skill: 'Kubernetes', demand: 78, growth: 40, salary: 145000, jobs: 5640 },
  ];

  const trendsData: TimeSeriesData[] = [
    { date: 'Jan', value: 85, category: 'Remote Jobs' },
    { date: 'Feb', value: 88, category: 'Remote Jobs' },
    { date: 'Mar', value: 92, category: 'Remote Jobs' },
    { date: 'Apr', value: 89, category: 'Remote Jobs' },
    { date: 'May', value: 95, category: 'Remote Jobs' },
    { date: 'Jun', value: 98, category: 'Remote Jobs' },
    { date: 'Jan', value: 65, category: 'AI/ML Jobs' },
    { date: 'Feb', value: 70, category: 'AI/ML Jobs' },
    { date: 'Mar', value: 75, category: 'AI/ML Jobs' },
    { date: 'Apr', value: 82, category: 'AI/ML Jobs' },
    { date: 'May', value: 88, category: 'AI/ML Jobs' },
    { date: 'Jun', value: 95, category: 'AI/ML Jobs' },
  ];

  const locationData: ChartData[] = [
    { label: 'San Francisco', value: 18750, color: '#3B82F6' },
    { label: 'New York', value: 15420, color: '#8B5CF6' },
    { label: 'Seattle', value: 12340, color: '#10B981' },
    { label: 'Austin', value: 8920, color: '#F59E0B' },
    { label: 'Remote', value: 25680, color: '#EF4444' },
  ];

  // Animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Bar Chart Component
  const BarChart: React.FC<{ data: ChartData[]; title: string; valueFormatter?: (value: number) => string }> = ({ 
    data, 
    title, 
    valueFormatter = (v) => v.toLocaleString() 
  }) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
              onMouseEnter={() => setHoveredData(item)}
              onMouseLeave={() => setHoveredData(null)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-600">{valueFormatter(item.value)}</span>
              </div>
              <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / maxValue) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                />
                {item.trend && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white">
                    +{item.trend}%
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Bubble Chart Component
  const BubbleChart: React.FC<{ data: SkillDemandData[] }> = ({ data }) => {
    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Skill Demand vs Growth</h4>
        <div className="relative h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 overflow-hidden">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {[20, 40, 60, 80].map(y => (
              <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#94A3B8" strokeWidth="1" />
            ))}
            {[20, 40, 60, 80].map(x => (
              <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#94A3B8" strokeWidth="1" />
            ))}
          </svg>

          {/* Bubbles */}
          {data.map((skill, index) => {
            const x = (skill.demand / 100) * 80 + 10; // 10-90% range
            const y = 90 - (skill.growth / 50) * 80; // Inverted Y axis
            const size = Math.sqrt(skill.jobs / 1000) * 8 + 20; // Size based on job count

            return (
              <motion.div
                key={skill.skill}
                className="absolute cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                onMouseEnter={() => setHoveredData(skill)}
                onMouseLeave={() => setHoveredData(null)}
              >
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg"
                  style={{ width: size, height: size }}
                  animate={{
                    boxShadow: [
                      '0 4px 20px rgba(59, 130, 246, 0.3)',
                      '0 8px 30px rgba(147, 51, 234, 0.4)',
                      '0 4px 20px rgba(59, 130, 246, 0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {skill.skill.substring(0, 3)}
                </motion.div>
              </motion.div>
            );
          })}

          {/* Axis labels */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
            Demand Score →
          </div>
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-600">
            ← Growth Rate
          </div>
        </div>

        {/* Legend */}
        <div className="text-xs text-gray-600 text-center">
          Bubble size represents number of job openings
        </div>
      </div>
    );
  };

  // Line Chart Component
  const LineChart: React.FC<{ data: TimeSeriesData[] }> = ({ data }) => {
    const categories = [...new Set(data.map(d => d.category))];
    const months = [...new Set(data.map(d => d.date))];

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Market Trends Over Time</h4>
        <div className="relative h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6">
          <svg className="w-full h-full">
            {/* Grid */}
            {[25, 50, 75].map(y => (
              <line key={y} x1="10%" y1={`${y}%`} x2="90%" y2={`${y}%`} stroke="#E5E7EB" strokeWidth="1" />
            ))}

            {/* Lines */}
            {categories.map((category, catIndex) => {
              const categoryData = data.filter(d => d.category === category);
              const color = catIndex === 0 ? '#3B82F6' : '#8B5CF6';
              
              const pathData = categoryData.map((point, index) => {
                const x = 10 + (index / (months.length - 1)) * 80;
                const y = 90 - (point.value / 100) * 80;
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ');

              return (
                <motion.path
                  key={category}
                  d={pathData}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: catIndex * 0.5 }}
                />
              );
            })}

            {/* Data points */}
            {data.map((point, index) => {
              const catIndex = categories.indexOf(point.category);
              const monthIndex = months.indexOf(point.date);
              const x = 10 + (monthIndex / (months.length - 1)) * 80;
              const y = 90 - (point.value / 100) * 80;
              const color = catIndex === 0 ? '#3B82F6' : '#8B5CF6';

              return (
                <motion.circle
                  key={`${point.category}-${point.date}`}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 1 }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredData(point)}
                  onMouseLeave={() => setHoveredData(null)}
                />
              );
            })}
          </svg>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-xs text-gray-600">
            {months.map(month => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6">
          {categories.map((category, index) => (
            <div key={category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: index === 0 ? '#3B82F6' : '#8B5CF6' }}
              />
              <span className="text-sm text-gray-600">{category}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Donut Chart Component
  const DonutChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage * 2.51} 251.2`; // 2π * 40 = 251.2
                const strokeDashoffset = -cumulativePercentage * 2.51;
                cumulativePercentage += percentage;

                return (
                  <motion.circle
                    key={item.label}
                    cx="128"
                    cy="128"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="cursor-pointer"
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    onMouseEnter={() => setHoveredData(item)}
                    onMouseLeave={() => setHoveredData(null)}
                  />
                );
              })}
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {data.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900 ml-auto">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <motion.svg
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </motion.svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Market Analytics</h3>
            <p className="text-gray-600">Interactive data visualizations and insights</p>
          </div>
        </div>

        {/* Chart Selector */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'salary', label: 'Salary Analysis', icon: '💰' },
            { id: 'skills', label: 'Skill Demand', icon: '🎯' },
            { id: 'trends', label: 'Market Trends', icon: '📈' },
            { id: 'locations', label: 'Job Locations', icon: '🌍' }
          ].map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeChart === chart.id
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{chart.icon}</span>
              <span>{chart.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeChart === 'salary' && (
              <BarChart 
                data={salaryData} 
                title="Average Salaries by Role" 
                valueFormatter={formatCurrency}
              />
            )}
            {activeChart === 'skills' && <BubbleChart data={skillDemandData} />}
            {activeChart === 'trends' && <LineChart data={trendsData} />}
            {activeChart === 'locations' && (
              <DonutChart data={locationData} title="Job Distribution by Location" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed z-50 bg-black text-white p-3 rounded-lg shadow-xl pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="text-sm">
                {hoveredData.skill && (
                  <>
                    <div className="font-bold">{hoveredData.skill}</div>
                    <div>Demand: {hoveredData.demand}%</div>
                    <div>Growth: +{hoveredData.growth}%</div>
                    <div>Avg Salary: {formatCurrency(hoveredData.salary)}</div>
                    <div>Jobs: {hoveredData.jobs.toLocaleString()}</div>
                  </>
                )}
                {hoveredData.label && !hoveredData.skill && (
                  <>
                    <div className="font-bold">{hoveredData.label}</div>
                    <div>{hoveredData.value?.toLocaleString ? hoveredData.value.toLocaleString() : hoveredData.value}</div>
                    {hoveredData.trend && <div>Growth: +{hoveredData.trend}%</div>}
                  </>
                )}
                {hoveredData.category && (
                  <>
                    <div className="font-bold">{hoveredData.category}</div>
                    <div>{hoveredData.date}: {hoveredData.value}%</div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdvancedDataViz;