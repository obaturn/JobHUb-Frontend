import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { MOCK_USER } from '../constants';

// Import all the new components
import { Skeleton, LoadingSpinner, LoadingButton, CardSkeleton } from '../src/design-system/components/LoadingStates';
import { AnimatedCard, FloatingButton } from '../src/design-system/components/Interactions';
import { useBehaviorTracking } from '../src/hooks/useBehaviorTracking';

interface TestFeaturesPageProps {
  onNavigate: (page: any) => void;
  user?: User | null;
}

const TestFeaturesPage: React.FC<TestFeaturesPageProps> = ({ onNavigate, user = MOCK_USER }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [showSkeletons, setShowSkeletons] = useState(false);
  
  // Test behavior tracking
  const behaviorTracker = useBehaviorTracking(user?.id || 'test-user');

  const handleLoadingTest = (buttonId: string) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    
    // Track the action
    behaviorTracker.trackAction('test_loading_button', { buttonId });
    
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  const testBehaviorTracking = () => {
    // Simulate different user behaviors
    behaviorTracker.trackJobApplication(123);
    behaviorTracker.trackCompanyView('tech-corp');
    behaviorTracker.trackProfileView('user-456');
    behaviorTracker.trackNetworkingAction('connect', 'user-789');
    
    alert('Behavior tracking tested! Check browser console for logs.');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Test New Features
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test all the new components and features we've built
          </p>
          <button
            onClick={() => onNavigate('landing')}
            className="mt-4 text-blue-600 hover:underline"
          >
            ← Back to Home
          </button>
        </div>

        {/* Navigation to New Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 New Pages & Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedCard 
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
              onClick={() => onNavigate('companies_directory')}
              hoverScale={1.02}
              glowEffect
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🏢</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Companies Directory</h3>
                <p className="text-gray-600 text-sm">LinkedIn-style company directory with search and filters</p>
              </div>
            </AnimatedCard>

            <AnimatedCard 
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
              onClick={() => onNavigate('adaptive_dashboard')}
              hoverScale={1.02}
              glowEffect
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Adaptive Dashboard</h3>
                <p className="text-gray-600 text-sm">AI-powered dashboard that adapts to user behavior</p>
              </div>
            </AnimatedCard>

            <AnimatedCard 
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
              onClick={() => onNavigate('linkedin_dashboard')}
              hoverScale={1.02}
              glowEffect
            >
              <div className="text-center">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn-Style Dashboard</h3>
                <p className="text-gray-600 text-sm">Context-switching interface like LinkedIn</p>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Loading States Testing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">⏳ Loading States</h2>
          
          {/* Loading Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <LoadingButton
                variant="primary"
                isLoading={loadingStates.primary}
                onClick={() => handleLoadingTest('primary')}
                loadingText="Saving..."
              >
                Primary Button
              </LoadingButton>
              
              <LoadingButton
                variant="secondary"
                isLoading={loadingStates.secondary}
                onClick={() => handleLoadingTest('secondary')}
                loadingText="Processing..."
              >
                Secondary Button
              </LoadingButton>
              
              <LoadingButton
                variant="outline"
                isLoading={loadingStates.outline}
                onClick={() => handleLoadingTest('outline')}
              >
                Outline Button
              </LoadingButton>
              
              <LoadingButton
                variant="ghost"
                isLoading={loadingStates.ghost}
                onClick={() => handleLoadingTest('ghost')}
              >
                Ghost Button
              </LoadingButton>
            </div>
          </div>

          {/* Loading Spinners */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading Spinners</h3>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <LoadingSpinner size="sm" variant="primary" />
                <p className="text-sm text-gray-600 mt-2">Small</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="md" variant="secondary" />
                <p className="text-sm text-gray-600 mt-2">Medium</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="lg" variant="primary" />
                <p className="text-sm text-gray-600 mt-2">Large</p>
              </div>
              <div className="text-center">
                <LoadingSpinner size="xl" variant="gray" />
                <p className="text-sm text-gray-600 mt-2">Extra Large</p>
              </div>
            </div>
          </div>

          {/* Skeletons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Skeleton Loading</h3>
              <button
                onClick={() => setShowSkeletons(!showSkeletons)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showSkeletons ? 'Hide' : 'Show'} Skeletons
              </button>
            </div>
            
            {showSkeletons && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Job Card Skeleton</h4>
                  <CardSkeleton variant="job" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Company Card Skeleton</h4>
                  <CardSkeleton variant="company" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Profile Card Skeleton</h4>
                  <CardSkeleton variant="profile" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Micro-interactions Testing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ Micro-interactions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedCard 
              className="bg-white rounded-lg shadow-sm p-6"
              hoverScale={1.05}
              tiltIntensity={15}
              glowEffect
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🎨</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Animated Card</h3>
                <p className="text-gray-600 text-sm">Hover me for 3D tilt effect and glow</p>
              </div>
            </AnimatedCard>

            <AnimatedCard 
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-sm p-6"
              hoverScale={1.03}
              clickEffect
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-lg font-semibold mb-2">Gradient Card</h3>
                <p className="text-blue-100 text-sm">Click me for press effect</p>
              </div>
            </AnimatedCard>

            <AnimatedCard 
              className="bg-white rounded-lg shadow-sm p-6"
              hoverScale={1.02}
              tiltIntensity={20}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Card</h3>
                <p className="text-gray-600 text-sm">Smooth animations and transitions</p>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Behavior Tracking Testing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🧠 Behavior Tracking</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test User Behavior Analytics</h3>
            <p className="text-gray-600 mb-4">
              Click the button below to simulate user actions and see how the system tracks behavior.
              Check your browser console to see the tracking logs.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={testBehaviorTracking}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Behavior Tracking
              </button>
              
              <button
                onClick={() => behaviorTracker.trackJobApplication(456)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simulate Job Application
              </button>
              
              <button
                onClick={() => behaviorTracker.trackJobPosting({ title: 'Test Job' })}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Simulate Job Posting
              </button>
            </div>
          </div>
        </div>

        {/* Market Insights Preview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Redesigned Market Insights</h2>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Market Insights</h3>
            <p className="text-gray-600 mb-4">
              The Market Insights section has been redesigned to look more professional and less AI-generated.
              It now features clean tabs, real market data, and industry-standard design patterns.
            </p>
            
            <button
              onClick={() => onNavigate('landing')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View on Homepage
            </button>
          </div>
        </div>

        {/* Storybook Link */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📚 Design System Documentation</h2>
          <p className="text-gray-600 mb-6">
            View all components in Storybook for detailed documentation and examples
          </p>
          <button
            onClick={() => window.open('http://localhost:6006', '_blank')}
            className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Open Storybook
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingButton
        icon={<span>🧪</span>}
        label="Test Features"
        position="bottom-right"
        variant="primary"
        onClick={() => alert('Floating button works!')}
      />
    </div>
  );
};

export default TestFeaturesPage;