import React from 'react';
import { User, Job, Application, JobSeekerDashboardTab, UserPost } from '../../types';
import StatCard from './StatCard';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';
import { BookmarkIcon } from '../icons/BookmarkIcon';
import { EyeIcon } from '../icons/EyeIcon';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

interface DashboardOverviewProps {
    user: User;
    applications: Application[];
    savedJobs: Job[];
    posts: UserPost[];
    onCreatePost: (content: string) => void;
    setActiveTab: (tab: JobSeekerDashboardTab) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user, applications, savedJobs, posts, onCreatePost, setActiveTab }) => {
    const profileViews = 127; // Mock data
    const interviewsScheduled = 2; // Mock data
    const newMessages = 3; // Mock data

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const recentActivity = [
        { type: 'application', text: 'Applied to Senior Frontend Developer at Innovate Inc.', time: '2 hours ago' },
        { type: 'view', text: 'Your profile was viewed by Tech Giant', time: '4 hours ago' },
        { type: 'save', text: 'Saved Backend Engineer position', time: '1 day ago' },
    ];

    return (
        <div className="space-y-8">
            {/* Enhanced Welcome Header */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 p-8 rounded-2xl border border-gray-100 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-24 h-24 bg-primary rounded-full blur-2xl"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-accent rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-16 h-16 rounded-full ring-4 ring-white shadow-lg"
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-dark">
                                {getGreeting()}, {user.name.split(' ')[0]}!
                            </h1>
                            <p className="text-gray-600 mt-1">Ready to continue your job search journey?</p>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex flex-wrap gap-6 mt-6">
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
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    value={applications.length}
                    label="Applications Sent"
                    icon={<DocumentTextIcon className="w-6 h-6 text-primary" />}
                    onNavigate={() => setActiveTab('applications')}
                />
                <StatCard
                    value={savedJobs.length}
                    label="Saved Jobs"
                    icon={<BookmarkIcon className="w-6 h-6 text-primary" />}
                    onNavigate={() => setActiveTab('saved_jobs')}
                />
                <StatCard
                    value={profileViews}
                    label="Profile Views"
                    icon={<EyeIcon className="w-6 h-6 text-primary" />}
                />
                <StatCard
                    value={interviewsScheduled}
                    label="Interviews Scheduled"
                    icon={
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    }
                />
            </div>

            {/* Recent Activity & Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-neutral-dark mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                        activity.type === 'application' ? 'bg-green-500' :
                                        activity.type === 'view' ? 'bg-blue-500' : 'bg-purple-500'
                                    }`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 line-clamp-2">{activity.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-primary hover:text-primary-dark text-sm font-medium transition-colors">
                            View All Activity →
                        </button>
                    </div>
                </div>

                {/* Feed Section */}
                <div className="lg:col-span-2">
                    <div className="space-y-6">
                        <CreatePost user={user} onCreatePost={onCreatePost} />
                        <div className="space-y-6">
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))
                            ) : (
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                                    <p className="text-gray-500">Share your thoughts and connect with other professionals!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;