
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import analytics from '../src/utils/analytics';

interface HeroProps {
    onNavigate: (page: 'job_search') => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  // Single set of state variables (removed duplicates)
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [jobCount, setJobCount] = useState(2300000);
  
  const heroTexts = [
    "Find Your Dream Job",
    "Hire Your Next Great Employee", 
    "Build Your Career",
    "Grow Your Team"
  ];

  const popularSearches = [
    "Software Engineer",
    "Product Manager", 
    "Data Scientist",
    "UX Designer",
    "Marketing Manager"
  ];

  // Single consolidated useEffect for text rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  // Single useEffect for job count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setJobCount(prev => prev + Math.floor(Math.random() * 5) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Single set of animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary via-blue-700 to-secondary text-white py-20 md:py-32 overflow-hidden">
      {/* Simple background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-accent/50 rounded-full"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-white/40 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Dynamic typing headline */}
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block"
                  >
                    {heroTexts[currentTextIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br />
              <span className="text-blue-100">with JobHub</span>
            </h1>
          </motion.div>

          <motion.p 
            variants={itemVariants}
            className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 mb-6 leading-relaxed"
          >
            JobHub connects top talent with the world's most innovative companies. Join millions of professionals who trust us with their career journey.
          </motion.p>

          {/* Real-time job count - simplified */}
          <motion.div 
            variants={itemVariants}
            className="mb-10"
          >
            <span className="text-sm font-semibold bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              🔥 {jobCount.toLocaleString()}+ jobs available now
            </span>
          </motion.div>
        </motion.div>

        {/* Enhanced search form - simplified */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="col-span-1 md:col-span-2">
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full px-4 py-4 rounded-lg border-0 bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                onClick={() => {
                  analytics.trackButtonClick('find_jobs', 'hero_search');
                  onNavigate('job_search');
                }}
                className="w-full px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 col-span-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Jobs
              </button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-blue-200 text-sm">Popular:</span>
            {popularSearches.slice(0, 4).map((search, index) => (
              <motion.button
                key={search}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSearchValue(search)}
                className="text-blue-200 text-sm hover:text-white transition-colors underline"
              >
                {search}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Simplified action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center items-center flex-wrap gap-6"
        >
          <button className="px-8 py-4 bg-white text-primary font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
            onClick={() => analytics.trackButtonClick('post_job', 'hero_cta')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </button>
          <button
            onClick={() => {
              analytics.trackButtonClick('browse_jobs', 'hero_cta');
              onNavigate('job_search');
            }}
            className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Browse Jobs
          </button>
        </motion.div>

        {/* Simplified trust indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16"
        >
          <p className="text-blue-200 text-sm mb-6">Trusted by industry leaders</p>
          
          {/* Company logos - simplified */}
          <div className="flex justify-center items-center gap-8 mb-8 opacity-60">
            {['Google', 'Microsoft', 'Meta', 'Amazon', 'Apple'].map((company) => (
              <div
                key={company}
                className="text-white/70 font-medium text-sm hover:text-white transition-all cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { value: '50K+', label: 'Companies' },
              { value: '1M+', label: 'Professionals' },
              { value: '3M+', label: 'Jobs Posted' },
              { value: '24/7', label: 'Support' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-blue-200 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;