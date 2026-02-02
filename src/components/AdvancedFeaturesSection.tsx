/**
 * Advanced Features Section
 * Showcases all advanced features: Job Map, AI Recommendations, Gamification, and Data Viz
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveJobMap from './InteractiveJobMap';
import AIRecommendations from './AIRecommendations';
import GamificationSystem from './GamificationSystem';
import AdvancedDataViz from './AdvancedDataViz';
import { SECTION_SPACING, CONTAINER_SPACING } from '../design-system/tokens/spacing';
import { FADE_IN_UP, VIEWPORT_ONCE } from '../design-system/tokens/animations';

const AdvancedFeaturesSection: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<'map' | 'ai' | 'gamification' | 'analytics'>('map');

  const features = [
    {
      id: 'map',
      title: 'Global Job Market',
      description: 'Interactive world map with job hotspots and market data',
      icon: '🗺️',
      color: 'from-blue-500 to-cyan-500',
      component: <InteractiveJobMap />
    },
    {
      id: 'ai',
      title: 'AI Career Assistant',
      description: 'Personalized job recommendations and career path guidance',
      icon: '🤖',
      color: 'from-purple-500 to-pink-500',
      component: <AIRecommendations />
    },
    {
      id: 'gamification',
      title: 'Career Progress',
      description: 'Level up your job search with achievements and rewards',
      icon: '🎮',
      color: 'from-yellow-500 to-orange-500',
      component: <GamificationSystem />
    },
    {
      id: 'analytics',
      title: 'Market Analytics',
      description: 'Advanced data visualizations and market insights',
      icon: '📊',
      color: 'from-green-500 to-emerald-500',
      component: <AdvancedDataViz />
    }
  ];

  const activeFeatureData = features.find(f => f.id === activeFeature);

  return (
    <section className={`bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 ${SECTION_SPACING.large} relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
      </div>

      <div className={`container mx-auto ${CONTAINER_SPACING.default} relative z-10`}>
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={FADE_IN_UP}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 px-6 py-3 rounded-full text-sm font-medium mb-6"
          >
            <motion.svg
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </motion.svg>
            Advanced Features
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Next-Generation
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Career Platform
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the future of job searching with AI-powered recommendations, interactive market insights, 
            gamified progress tracking, and global job market visualization.
          </motion.p>
        </motion.div>

        {/* Feature Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id as any)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT_ONCE}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  activeFeature === feature.id
                    ? 'bg-white border-blue-300 shadow-xl'
                    : 'bg-white/50 border-gray-200 hover:border-gray-300 hover:bg-white/80'
                }`}
              >
                {/* Active indicator */}
                {activeFeature === feature.id && (
                  <motion.div
                    layoutId="activeFeature"
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="relative z-10 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>

                {/* Glow effect for active feature */}
                {activeFeature === feature.id && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                        '0 0 40px rgba(147, 51, 234, 0.4)',
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Feature Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              {activeFeatureData?.component}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {[
            {
              icon: '🚀',
              title: 'AI-Powered Intelligence',
              description: 'Machine learning algorithms analyze millions of data points to provide personalized career recommendations.',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: '🌍',
              title: 'Global Market Insights',
              description: 'Real-time data from job markets worldwide, helping you make informed career decisions.',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🎯',
              title: 'Gamified Experience',
              description: 'Turn your job search into an engaging journey with achievements, levels, and progress tracking.',
              color: 'from-yellow-500 to-orange-500'
            }
          ].map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${highlight.color} rounded-xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}>
                {highlight.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{highlight.title}</h3>
              <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative z-10">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ delay: 1.1 }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                Ready to Experience the Future?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ delay: 1.3 }}
                className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
              >
                Join thousands of professionals already using our advanced features to accelerate their careers.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ delay: 1.5 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free Trial
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={VIEWPORT_ONCE}
                  transition={{ delay: 1.7 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Watch Demo
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvancedFeaturesSection;