import React, { useState, useEffect } from 'react';
import { User, Job, Application, JobSeekerDashboardTab, UserPost, Resume } from '../../types';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { BookmarkIcon } from '../icons/BookmarkIcon';
import { BriefcaseIcon } from '../../constants';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { ClockIcon } from '../icons/ClockIcon';
import CreatePost from './CreatePost';
import UnifiedSocialFeed from '../feed/UnifiedSocialFeed';
import CompanyEngagementFlow from '../workflow/CompanyEngagementFlow';
import { useBehaviorTracking } from '../../src/hooks/useBehaviorTracking';
import { useSharedJobsStore } from '../../stores/useSharedJobsStore';
import { motion } from 'framer-motion';

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
    const { allJobs, fetchAllJobs } = useSharedJobsStore();
    const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Mock data for messages - in real app this would come from props or API
    const newMessages = 3;
    
    // Initialize behavior tracking
    const behaviorTracker = useBehaviorTracking(user.id);

    // Load personalized content on component mount
    useEffect(() => {
        loadPersonalizedContent();
        // Fetch latest jobs from shared store
        fetchAllJobs();
    }, [user.id, fetchAllJobs]);

    // Get latest 5 jobs from shared store
    const latestJobs = allJobs
        .sort((a, b) => b.id - a.id)  // Sort by ID (most recent first)
        .slice(0, 5);

    const loadPersonalizedContent = async () => {
        setLoading(true);
        try {
            // Simulate API calls for personalized content
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock recommended jobs based on user profile
            const mockRecommendedJobs: Job[] = [
                {
                    id: 'rec-1',
                    title: 'Senior Frontend Developer',
                    company: 'TechCorp Inc.',
                    location: 'San Francisco, CA',
                    type: 'Full-time',
                    salary: '$120,000 - $150,000',
                    description: 'Join our team building next-generation web applications...',
                    requirements: ['React', 'TypeScript', '5+ years experience'],
                    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    companyLogo: 'https://picsum.photos/seed/techcorp/100/100',
                    isRemote: false,
                    experienceLevel: 'Senior',
                    companyId: 'techcorp'
                },
                {
                    id: 'rec-2',
                    title: 'React Developer',
                    company: 'StartupXYZ',
                    location: 'Remote',
                    type: 'Full-time',
                    salary: '$90,000 - $120,000',
                    description: 'Build innovative products with cutting-edge technology...',
                    requirements: ['React', 'Node.js', '3+ years experience'],
                    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    companyLogo: 'https://picsum.photos/seed/startupxyz/100/100',
                    isRemote: true,
                    experienceLevel: 'Mid-level',
                    companyId: 'startupxyz'
                }
            ];
            
            setRecommendedJobs(mockRecommendedJobs);
            
            // Mock recent activity
            setRecentActivity([
                { type: 'application', message: 'Applied to Frontend Developer at TechCorp', time: '2 hours ago' },
                { type: 'save', message: 'Saved React Developer position', time: '1 day ago' },
                { type: 'profile', message: 'Updated your skills section', time: '3 days ago' }
            ]);
            
        } catch (error) {
            console.error('Failed to load personalized content:', error);
        } finally {
            setLoading(false);
        }
    };

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

            {/* Latest Job Postings Section - NEW! */}
            {latestJobs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <BriefcaseIcon className="w-5 h-5 text-green-600" />
                            Latest Job Postings
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                Just Posted
                            </span>
                        </h2>
                        <button
                            onClick={() => setActiveTab('saved_jobs')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            See all →
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {latestJobs.map((job) => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-gradient-to-r from-white to-blue-50/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                            {job.posted === 'Just now' && (
                                                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                                                    NEW
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            {job.salary && (
                                                <span className="text-sm font-medium text-green-600">{job.salary}</span>
                                            )}
                                            <span className="text-xs text-gray-500">{job.type}</span>
                                            {job.isRemote && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Remote</span>
                                            )}
                                            <span className="text-xs text-blue-600">Posted {job.posted}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => onApplyJob?.(job)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                                        >
                                            Apply Now
                                        </button>
                                        <button
                                            onClick={() => onSaveJob?.(job)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {allJobs.length > 5 && (
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500">
                                + {allJobs.length - 5} more jobs available
                            </p>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Job Recommendations Section */}
            {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-3">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            ) : recommendedJobs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                            Jobs You Might Like
                        </h2>
                        <button
                            onClick={() => setActiveTab('saved_jobs')}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            See all →
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {recommendedJobs.slice(0, 2).map((job) => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-green-600">{job.salary}</span>
                                            <span className="text-xs text-gray-500">{job.type}</span>
                                            {job.isRemote && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Remote</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => onApplyJob?.(job)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            Apply
                                        </button>
                                        <button
                                            onClick={() => onSaveJob?.(job)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-gray-600" />
                        Your Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                    activity.type === 'application' ? 'bg-blue-500' :
                                    activity.type === 'save' ? 'bg-green-500' : 'bg-purple-500'
                                }`}></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
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