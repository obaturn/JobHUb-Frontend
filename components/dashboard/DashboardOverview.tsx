import React from 'react';
import { User, Job, Application, JobSeekerDashboardTab, UserPost, Resume } from '../../types';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { BookmarkIcon } from '../icons/BookmarkIcon';
import CreatePost from './CreatePost';
import UnifiedSocialFeed from '../feed/UnifiedSocialFeed';
import CompanyEngagementFlow from '../workflow/CompanyEngagementFlow';
import { useBehaviorTracking } from '../../src/hooks/useBehaviorTracking';

interface DashboardOverviewProps {
    user: User;
    applications: Application[];
    savedJobs: Job[];
    posts: UserPost[];
    resumes: Resume[];
    onCreatePost: (content: string) => void;
    setActiveTab: (tab: JobSeekerDashboardTab) => void;
    onViewJobDetails: (job: Job) => void;
    onViewCompanyProfile: (companyId: string) => void;
    onViewProfile?: (userId: string) => void;
    onApplyJob?: (job: Job) => void;
    onSaveJob?: (job: Job) => void;
    onFollowCompany?: (companyId: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
    user, 
    applications, 
    savedJobs, 
    posts, 
    resumes,
    onCreatePost, 
    setActiveTab,
    onViewJobDetails,
    onViewCompanyProfile,
    onViewProfile,
    onApplyJob,
    onSaveJob,
    onFollowCompany
}) => {
    const newMessages = 3; // Mock data
    
    // Initialize behavior tracking
    const behaviorTracker = useBehaviorTracking(user.id);

    // Safe user name extraction
    const getUserFirstName = () => {
        // Debug logging to see what user data we have
        console.log('🔍 [DashboardOverview] User data:', {
            user: user,
            name: user?.name,
            email: user?.email,
            id: user?.id
        });
        
        if (!user) return 'User';
        
        // Try to get name from user.name field
        if (user.name && user.name.trim()) {
            const firstName = user.name.split(' ')[0];
            console.log('✅ [DashboardOverview] Using name from user.name:', firstName);
            return firstName || 'User';
        }
        
        // Fallback: try to extract from email if name is missing
        if (user.email) {
            const emailName = user.email.split('@')[0];
            // Capitalize first letter
            const fallbackName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            console.log('⚠️ [DashboardOverview] Using fallback name from email:', fallbackName);
            return fallbackName;
        }
        
        console.log('❌ [DashboardOverview] No name or email found, using default');
        return 'User';
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Enhanced navigation with behavior tracking
    const handleStatCardClick = (tab: JobSeekerDashboardTab, action: string) => {
        behaviorTracker.trackAction('dashboard_stat_click', { tab, action });
        setActiveTab(tab);
    };

    // Get personalized content based on engagement level
    const getPersonalizedMessage = () => {
        const engagementLevel = user.behaviorProfile?.engagementLevel || 'medium';
        
        switch(engagementLevel) {
            case 'low':
                return 'We noticed you\'ve been less active. Check out some new job recommendations below!';
            case 'high':
                return 'You\'re on fire! Keep up the great momentum with your job search.';
            default:
                return 'Ready to continue your job search journey?';
        }
    };

    // Check if user needs company engagement guidance
    const shouldShowCompanyEngagement = () => {
        // Show if user has viewed a company recently but hasn't followed any
        const hasViewedCompanies = localStorage.getItem('recentlyViewedCompanies');
        const hasFollowedCompanies = localStorage.getItem('followedCompanies');
        return hasViewedCompanies && !hasFollowedCompanies;
    };

    return (
        <div className="space-y-6">
            {/* Clean Welcome Header */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 p-6 lg:p-8 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                    <img
                        src={user?.avatar || 'https://picsum.photos/seed/default/200/200'}
                        alt={user?.name || 'User'}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-full ring-2 lg:ring-4 ring-white shadow-lg"
                    />
                    <div>
                        <h1 className="text-xl lg:text-3xl font-bold text-neutral-dark">
                            {getGreeting()}, {getUserFirstName()}!
                        </h1>
                        <p className="text-sm lg:text-base text-gray-600 mt-1">{getPersonalizedMessage()}</p>
                    </div>
                </div>

                {/* Simple stats */}
                <div className="flex flex-wrap gap-4 lg:gap-6 mt-4 lg:mt-6">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-gray-600">{applications.length} active applications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">{savedJobs.length} saved jobs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-600">{newMessages} new messages</span>
                    </div>
                </div>
            </div>

            {/* Company Engagement Flow (conditional) */}
            {shouldShowCompanyEngagement() && (
                <CompanyEngagementFlow
                    user={user}
                    companyId="techcorp"
                    onViewJobDetails={onViewJobDetails}
                    onApplyJob={onApplyJob || (() => {})}
                    onFollowCompany={onFollowCompany || (() => {})}
                    onViewCompanyProfile={onViewCompanyProfile}
                />
            )}

            {/* Main Content - Clean and Focused */}
            <div className="space-y-6">
                {/* Post Creation */}
                <CreatePost user={user} onCreatePost={onCreatePost} />
                
                {/* Unified Social Feed - LinkedIn Style */}
                <UnifiedSocialFeed
                    currentUser={user}
                    userType="job_seeker"
                    resumes={resumes}
                    onViewJobDetails={onViewJobDetails}
                    onViewCompanyProfile={onViewCompanyProfile}
                    onApplyJob={onApplyJob || (() => {})}
                    onSaveJob={onSaveJob || (() => {})}
                    onViewProfile={onViewProfile || (() => {})}
                />
            </div>
        </div>
    );
};

export default DashboardOverview;