/**
 * Interactive Job Market Map
 * World map showing job hotspots, salary ranges, and market trends
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobHotspot {
  id: string;
  city: string;
  country: string;
  coordinates: { x: number; y: number };
  jobCount: number;
  avgSalary: number;
  topSkills: string[];
  growth: number;
  remoteRatio: number;
  companies: string[];
}

interface InteractiveJobMapProps {
  className?: string;
}

const InteractiveJobMap: React.FC<InteractiveJobMapProps> = ({ className = '' }) => {
  const [selectedHotspot, setSelectedHotspot] = useState<JobHotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<JobHotspot | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Mock job market data
  const jobHotspots: JobHotspot[] = [
    {
      id: 'sf',
      city: 'San Francisco',
      country: 'USA',
      coordinates: { x: 15, y: 35 },
      jobCount: 15420,
      avgSalary: 165000,
      topSkills: ['React', 'Python', 'AWS'],
      growth: 12,
      remoteRatio: 65,
      companies: ['Google', 'Meta', 'Uber']
    },
    {
      id: 'nyc',
      city: 'New York',
      country: 'USA',
      coordinates: { x: 25, y: 32 },
      jobCount: 18750,
      avgSalary: 145000,
      topSkills: ['JavaScript', 'Java', 'React'],
      growth: 8,
      remoteRatio: 55,
      companies: ['Goldman Sachs', 'JPMorgan', 'Bloomberg']
    },
    {
      id: 'london',
      city: 'London',
      country: 'UK',
      coordinates: { x: 50, y: 28 },
      jobCount: 12340,
      avgSalary: 85000,
      topSkills: ['Python', 'Java', 'Docker'],
      growth: 15,
      remoteRatio: 70,
      companies: ['Revolut', 'Monzo', 'DeepMind']
    },
    {
      id: 'berlin',
      city: 'Berlin',
      country: 'Germany',
      coordinates: { x: 52, y: 25 },
      jobCount: 8920,
      avgSalary: 75000,
      topSkills: ['Go', 'Kubernetes', 'React'],
      growth: 22,
      remoteRatio: 80,
      companies: ['SAP', 'Zalando', 'N26']
    },
    {
      id: 'singapore',
      city: 'Singapore',
      country: 'Singapore',
      coordinates: { x: 78, y: 55 },
      jobCount: 6780,
      avgSalary: 95000,
      topSkills: ['Java', 'Python', 'AWS'],
      growth: 18,
      remoteRatio: 45,
      companies: ['Grab', 'Sea', 'Shopee']
    },
    {
      id: 'tokyo',
      city: 'Tokyo',
      country: 'Japan',
      coordinates: { x: 85, y: 40 },
      jobCount: 11200,
      avgSalary: 78000,
      topSkills: ['Java', 'Python', 'React'],
      growth: 10,
      remoteRatio: 35,
      companies: ['Sony', 'Nintendo', 'SoftBank']
    },
    {
      id: 'sydney',
      city: 'Sydney',
      country: 'Australia',
      coordinates: { x: 88, y: 75 },
      jobCount: 4560,
      avgSalary: 92000,
      topSkills: ['Python', 'AWS', 'React'],
      growth: 14,
      remoteRatio: 60,
      companies: ['Atlassian', 'Canva', 'Afterpay']
    },
    {
      id: 'toronto',
      city: 'Toronto',
      country: 'Canada',
      coordinates: { x: 22, y: 28 },
      jobCount: 7890,
      avgSalary: 95000,
      topSkills: ['Python', 'Java', 'React'],
      growth: 16,
      remoteRatio: 65,
      companies: ['Shopify', 'Wealthsimple', 'Coinsquare']
    }
  ];

  // Animation cycle for pulsing effects
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Format salary
  const formatSalary = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get hotspot size based on job count
  const getHotspotSize = (jobCount: number) => {
    const maxJobs = Math.max(...jobHotspots.map(h => h.jobCount));
    const ratio = jobCount / maxJobs;
    return 8 + (ratio * 12); // 8px to 20px
  };

  // Get growth color
  const getGrowthColor = (growth: number) => {
    if (growth >= 15) return 'text-green-600';
    if (growth >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      className={`bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-8 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Global Job Market</h3>
            <p className="text-blue-200">Interactive hotspots and trends worldwide</p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        {/* World Map SVG */}
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-800/30 to-purple-800/30 rounded-xl border border-white/10 overflow-hidden">
          {/* Simplified world map background */}
          <svg
            viewBox="0 0 100 60"
            className="absolute inset-0 w-full h-full opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            {/* Continents outline (simplified) */}
            <path
              d="M10 20 L30 15 L35 25 L25 35 L15 30 Z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.3)"
            />
            <path
              d="M45 15 L65 12 L70 20 L68 30 L50 32 L45 25 Z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.3)"
            />
            <path
              d="M75 25 L90 22 L95 35 L85 45 L75 40 Z"
              fill="rgba(255,255,255,0.1)"
              stroke="rgba(255,255,255,0.3)"
            />
          </svg>

          {/* Job Hotspots */}
          {jobHotspots.map((hotspot, index) => (
            <motion.div
              key={hotspot.id}
              className="absolute cursor-pointer"
              style={{
                left: `${hotspot.coordinates.x}%`,
                top: `${hotspot.coordinates.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredHotspot(hotspot)}
              onMouseLeave={() => setHoveredHotspot(null)}
              onClick={() => setSelectedHotspot(hotspot)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Pulsing rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-400"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.8, 0, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
                style={{
                  width: getHotspotSize(hotspot.jobCount) * 2,
                  height: getHotspotSize(hotspot.jobCount) * 2,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />

              {/* Main hotspot dot */}
              <motion.div
                className="relative bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg"
                style={{
                  width: getHotspotSize(hotspot.jobCount),
                  height: getHotspotSize(hotspot.jobCount),
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 30px rgba(147, 51, 234, 0.8)',
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {/* Job count label */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                  {(hotspot.jobCount / 1000).toFixed(1)}k jobs
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* Hover Tooltip */}
          <AnimatePresence>
            {hoveredHotspot && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute z-20 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-white/20 pointer-events-none"
                style={{
                  left: `${hoveredHotspot.coordinates.x}%`,
                  top: `${hoveredHotspot.coordinates.y - 15}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div className="text-sm">
                  <div className="font-bold text-gray-900">{hoveredHotspot.city}</div>
                  <div className="text-gray-600">{hoveredHotspot.jobCount.toLocaleString()} jobs</div>
                  <div className="text-green-600 font-medium">{formatSalary(hoveredHotspot.avgSalary)} avg</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span>Job Hotspots</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>High Growth Areas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span>Remote-Friendly</span>
          </div>
        </div>
      </div>

      {/* Selected Hotspot Details */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-white">{selectedHotspot.city}, {selectedHotspot.country}</h4>
                <p className="text-blue-200">Market Overview</p>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{selectedHotspot.jobCount.toLocaleString()}</div>
                <div className="text-sm text-blue-200">Open Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{formatSalary(selectedHotspot.avgSalary)}</div>
                <div className="text-sm text-blue-200">Avg Salary</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getGrowthColor(selectedHotspot.growth)}`}>+{selectedHotspot.growth}%</div>
                <div className="text-sm text-blue-200">Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{selectedHotspot.remoteRatio}%</div>
                <div className="text-sm text-blue-200">Remote</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Skills */}
              <div>
                <h5 className="font-semibold text-white mb-3">Top Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedHotspot.topSkills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm border border-blue-400/30"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Top Companies */}
              <div>
                <h5 className="font-semibold text-white mb-3">Top Companies</h5>
                <div className="space-y-2">
                  {selectedHotspot.companies.map((company, index) => (
                    <motion.div
                      key={company}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-blue-200"
                    >
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>{company}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InteractiveJobMap;