import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton, LoadingSpinner, LoadingButton, CardSkeleton } from './index';
import { useState } from 'react';

const meta: Meta = {
  title: 'Design System/Loading States',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

// Skeleton Stories
export const SkeletonVariants: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Text Skeletons</h3>
        <div className="space-y-3">
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="75%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" lines={3} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Shape Variants</h3>
        <div className="flex gap-4 items-center">
          <Skeleton variant="circular" width={64} height={64} />
          <Skeleton variant="rectangular" width={120} height={80} />
          <Skeleton variant="rounded" width={100} height={40} />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Animation Types</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Pulse Animation</p>
            <Skeleton animation="pulse" width="200px" height="20px" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Wave Animation</p>
            <Skeleton animation="wave" width="200px" height="20px" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">No Animation</p>
            <Skeleton animation="none" width="200px" height="20px" />
          </div>
        </div>
      </div>
    </div>
  ),
};

// Loading Spinner Stories
export const LoadingSpinners: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Sizes</h3>
        <div className="flex gap-4 items-center">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
          <LoadingSpinner size="xl" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Variants</h3>
        <div className="flex gap-4 items-center">
          <LoadingSpinner variant="primary" />
          <LoadingSpinner variant="secondary" />
          <LoadingSpinner variant="gray" />
          <div className="bg-gray-800 p-4 rounded">
            <LoadingSpinner variant="white" />
          </div>
        </div>
      </div>
    </div>
  ),
};

// Loading Button Stories
export const LoadingButtons: StoryObj = {
  render: () => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    
    const handleClick = (buttonId: string) => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
      }, 2000);
    };
    
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
          <div className="flex flex-wrap gap-4">
            <LoadingButton
              variant="primary"
              isLoading={loadingStates.primary}
              onClick={() => handleClick('primary')}
              loadingText="Saving..."
            >
              Primary Button
            </LoadingButton>
            <LoadingButton
              variant="secondary"
              isLoading={loadingStates.secondary}
              onClick={() => handleClick('secondary')}
            >
              Secondary Button
            </LoadingButton>
            <LoadingButton
              variant="outline"
              isLoading={loadingStates.outline}
              onClick={() => handleClick('outline')}
            >
              Outline Button
            </LoadingButton>
            <LoadingButton
              variant="ghost"
              isLoading={loadingStates.ghost}
              onClick={() => handleClick('ghost')}
            >
              Ghost Button
            </LoadingButton>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <LoadingButton
              size="sm"
              isLoading={loadingStates.small}
              onClick={() => handleClick('small')}
            >
              Small
            </LoadingButton>
            <LoadingButton
              size="md"
              isLoading={loadingStates.medium}
              onClick={() => handleClick('medium')}
            >
              Medium
            </LoadingButton>
            <LoadingButton
              size="lg"
              isLoading={loadingStates.large}
              onClick={() => handleClick('large')}
            >
              Large
            </LoadingButton>
          </div>
        </div>
      </div>
    );
  },
};

// Card Skeleton Stories
export const CardSkeletons: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Job Card Skeleton</h3>
        <div className="max-w-md">
          <CardSkeleton variant="job" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Company Card Skeleton</h3>
        <div className="max-w-sm">
          <CardSkeleton variant="company" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Profile Card Skeleton</h3>
        <div className="max-w-md">
          <CardSkeleton variant="profile" />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Article Card Skeleton</h3>
        <div className="max-w-sm">
          <CardSkeleton variant="article" />
        </div>
      </div>
    </div>
  ),
};

// Real-world Usage Example
export const RealWorldExample: StoryObj = {
  render: () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    
    const toggleLoading = () => {
      if (!isLoading) {
        setShowContent(false);
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setShowContent(true);
        }, 2000);
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Job Listings</h3>
          <LoadingButton
            onClick={toggleLoading}
            isLoading={isLoading}
            loadingText="Loading..."
            disabled={isLoading}
          >
            Refresh Jobs
          </LoadingButton>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            // Loading state
            <>
              <CardSkeleton variant="job" />
              <CardSkeleton variant="job" />
              <CardSkeleton variant="job" />
              <CardSkeleton variant="job" />
            </>
          ) : showContent ? (
            // Loaded content
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                      {i}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Senior React Developer {i}
                      </h4>
                      <p className="text-gray-600 mb-2">TechCorp Inc.</p>
                      <div className="flex gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          Remote
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                          Full-time
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        We're looking for an experienced React developer to join our team...
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Posted 2 days ago</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm">
                        Save
                      </button>
                      <button className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    );
  },
};