
import React from 'react';
import { Page } from '../types';

interface HeroProps {
    onNavigate: (page: 'job_search') => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-br from-primary via-blue-700 to-secondary text-white py-20 md:py-32 overflow-hidden">
      {/* Floating particles for extra visual interest */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-float"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-accent/50 rounded-full animate-float-delayed"></div>
      <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-white/40 rounded-full animate-float-slow"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Find Your Dream Job or Hire Your Next Great Employee
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 mb-10 leading-relaxed">
            JobHub connects top talent with the world's most innovative companies. Join millions of professionals who trust us with their career journey.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-300">
          <form className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/10 shadow-2xl" onSubmit={(e) => { e.preventDefault(); onNavigate('job_search'); }}>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              className="w-full px-4 py-4 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white transition-all duration-300 col-span-1 md:col-span-2 placeholder-gray-500"
            />
            <button
              type="submit"
              className="w-full px-6 py-4 bg-accent text-white font-semibold rounded-lg hover:bg-green-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 col-span-1 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find Jobs
            </button>
          </form>
        </div>

        <div className="flex justify-center items-center flex-wrap gap-6 animate-fade-in-up animation-delay-500">
          <button
            className="group px-8 py-4 bg-white text-primary font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </button>
          <button
            onClick={() => onNavigate('job_search')}
            className="group px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Browse Jobs
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 animate-fade-in-up animation-delay-700">
          <p className="text-blue-200 text-sm mb-6">Trusted by industry leaders and powered by modern technology</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-blue-200 text-xs">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">1M+</div>
              <div className="text-blue-200 text-xs">Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">3M+</div>
              <div className="text-blue-200 text-xs">Jobs Posted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-blue-200 text-xs">Support</div>
            </div>
          </div>
        </div>
      </div>
      {/* Enhanced custom animations */}
      <style>{`
        @keyframes rotate-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-rotate-cw {
          animation: rotate-cw 20s linear infinite;
        }
        .animate-rotate-ccw {
          animation: rotate-ccw 25s linear infinite;
        }
        .animate-rotate-cw-fast {
          animation: rotate-cw 10s linear infinite;
        }
        .animate-rotate-ccw-slow {
          animation: rotate-ccw 30s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite 4s;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </section>
  );
};

export default Hero;