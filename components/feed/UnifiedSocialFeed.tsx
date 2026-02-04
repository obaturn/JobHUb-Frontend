import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import SocialFeedPost from './SocialFeedPost';
import EnhancedJobCard from '../jobs/EnhancedJobCard';

interface UnifiedSocialFeedProps {
  currentUser: User;
  userType: 'job_seeker' | 'employer';
  resumes?: any[];
  onViewJobDetails: (job: any) => void;
  onViewCompanyProfile: (companyId: string) => void;
  onApplyJob: (job: any) => void;
  onSaveJob: (job: any) => void;
  onViewProfile: (userId: string) => void;
}

const UnifiedSocialFeed: React.FC<UnifiedSocialFeedProps> = ({
  currentUser,
  userType,
  resumes = [],
  onViewJobDetails,
  onViewCompanyProfile,
  onApplyJob,
  onSaveJob,
  onViewProfile
}) => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'posts' | 'jobs' | 'companies'>('all');

  useEffect(() => {
    // Generate mixed feed content (posts + job postings + company updates)
    const generateFeedItems = () => {
      const mockItems = [
        // Job Seeker Achievement Post
        {
          type: 'social_post',
          id: 'post-1',
          post: {
            id: 'post-1',
            author: {
              id: 'user-1',
              name: 'Sarah Johnson',
              avatar: 'https://picsum.photos/seed/sarah/200/200',
              title: 'Frontend Developer',
              company: 'TechStart Inc',
              isVerified: false
            },
            type: 'achievement',
            content: 'Excited to share that I just completed my React certification! 🎉 The journey was challenging but incredibly rewarding. Looking forward to applying these new skills in my next project. #ReactJS #WebDevelopment #ContinuousLearning',
            timestamp: '2 hours ago',
            engagement: {
              likes: 24,
              comments: 8,
              shares: 3,
              hasLiked: false,
              hasCommented: false,
              hasShared: false
            },
            comments: [
              {
                id: 'comment-1',
                author: {
                  id: 'user-2',
                  name: 'Mike Chen',
                  avatar: 'https://picsum.photos/seed/mike/200/200',
                  title: 'Senior Developer',
                  company: 'Google'
                },
                content: 'Congratulations Sarah! React is such a powerful framework. Would love to hear about your favorite features.',
                timestamp: '1 hour ago',
                likes: 5,
                hasLiked: false
              }
            ],
            hashtags: ['ReactJS', 'WebDevelopment', 'ContinuousLearning']
          }
        },

        // Job Posting
        {
          type: 'job_posting',
          id: 'job-1',
          job: {
            id: 1,
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            companyId: 'techcorp',
            logo: 'https://picsum.photos/seed/techcorp/100/100',
            location: 'San Francisco, CA (Hybrid)',
            type: 'Full-time',
            salary: '$140k - $180k',
            posted: '3 hours ago',
            skills: ['React', 'TypeScript', 'Node.js', 'GraphQL']
          }
        },

        // Company News Post
        {
          type: 'social_post',
          id: 'post-2',
          post: {
            id: 'post-2',
            author: {
              id: 'company-1',
              name: 'TechCorp',
              avatar: 'https://picsum.photos/seed/techcorp/200/200',
              title: 'Technology Company',
              isVerified: true
            },
            type: 'company_news',
            content: 'We\'re thrilled to announce our Series B funding of $50M! 🚀 This investment will help us expand our engineering team and accelerate product development. We\'re hiring across all levels - check out our open positions! #TechCorp #Hiring #SeriesB #Growth',
            timestamp: '5 hours ago',
            engagement: {
              likes: 156,
              comments: 23,
              shares: 45,
              hasLiked: false,
              hasCommented: false,
              hasShared: false
            },
            comments: [
              {
                id: 'comment-2',
                author: {
                  id: 'user-3',
                  name: 'Alex Rivera',
                  avatar: 'https://picsum.photos/seed/alex/200/200',
                  title: 'Product Manager',
                  company: 'StartupXYZ'
                },
                content: 'Congratulations on the funding! Exciting times ahead. Are you looking for experienced PMs?',
                timestamp: '4 hours ago',
                likes: 12,
                hasLiked: false
              }
            ],
            hashtags: ['TechCorp', 'Hiring', 'SeriesB', 'Growth']
          }
        },

        // Job Seeker Question Post
        {
          type: 'social_post',
          id: 'post-3',
          post: {
            id: 'post-3',
            author: {
              id: 'user-4',
              name: 'David Kim',
              avatar: 'https://picsum.photos/seed/david/200/200',
              title: 'Full Stack Developer',
              isVerified: false
            },
            type: 'question',
            content: 'Question for the community: What\'s your experience with transitioning from a startup to a big tech company? I\'m considering making the move and would love to hear about the cultural differences and growth opportunities. Any insights would be appreciated! 🤔 #CareerAdvice #BigTech #Startup',
            timestamp: '1 day ago',
            engagement: {
              likes: 18,
              comments: 15,
              shares: 2,
              hasLiked: false,
              hasCommented: false,
              hasShared: false
            },
            comments: [
              {
                id: 'comment-3',
                author: {
                  id: 'user-5',
                  name: 'Lisa Wang',
                  avatar: 'https://picsum.photos/seed/lisa/200/200',
                  title: 'Engineering Manager',
                  company: 'Meta'
                },
                content: 'Made the transition 2 years ago. The resources and mentorship opportunities at big tech are incredible, but you might miss the fast-paced, wear-many-hats environment of startups.',
                timestamp: '20 hours ago',
                likes: 8,
                hasLiked: false
              }
            ],
            hashtags: ['CareerAdvice', 'BigTech', 'Startup']
          }
        },

        // Another Job Posting
        {
          type: 'job_posting',
          id: 'job-2',
          job: {
            id: 2,
            title: 'Product Manager',
            company: 'InnovateCorp',
            companyId: 'innovate-corp',
            logo: 'https://picsum.photos/seed/innovate/100/100',
            location: 'Remote',
            type: 'Full-time',
            salary: '$120k - $160k',
            posted: '1 day ago',
            skills: ['Product Strategy', 'Analytics', 'Leadership', 'Agile']
          }
        },

        // Learning Post
        {
          type: 'social_post',
          id: 'post-4',
          post: {
            id: 'post-4',
            author: {
              id: 'user-6',
              name: 'Emma Thompson',
              avatar: 'https://picsum.photos/seed/emma/200/200',
              title: 'UX Designer',
              company: 'DesignStudio',
              isVerified: false
            },
            type: 'learning',
            content: 'Just finished an amazing workshop on accessibility in design! 🎨♿ It\'s incredible how small changes can make such a big impact on user experience. Here are my top 3 takeaways:\n\n1. Color contrast ratios matter more than you think\n2. Alt text should be descriptive, not just present\n3. Keyboard navigation is crucial for many users\n\nAlways learning, always improving! #UXDesign #Accessibility #InclusiveDesign',
            timestamp: '2 days ago',
            engagement: {
              likes: 42,
              comments: 12,
              shares: 8,
              hasLiked: false,
              hasCommented: false,
              hasShared: false
            },
            comments: [],
            hashtags: ['UXDesign', 'Accessibility', 'InclusiveDesign']
          }
        }
      ];

      return mockItems;
    };

    setFeedItems(generateFeedItems());
  }, []);

  const handleLike = (postId: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.type === 'social_post' && item.post.id === postId) {
        return {
          ...item,
          post: {
            ...item.post,
            engagement: {
              ...item.post.engagement,
              likes: item.post.engagement.hasLiked 
                ? item.post.engagement.likes - 1 
                : item.post.engagement.likes + 1,
              hasLiked: !item.post.engagement.hasLiked
            }
          }
        };
      }
      return item;
    }));
  };

  const handleComment = (postId: string, content: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      author: {
        id: currentUser.id || 'current-user',
        name: currentUser.name || 'You',
        avatar: currentUser.avatar || 'https://picsum.photos/seed/default/200/200',
        title: currentUser.headline || 'Professional',
        company: currentUser.company
      },
      content,
      timestamp: 'Just now',
      likes: 0,
      hasLiked: false
    };

    setFeedItems(prev => prev.map(item => {
      if (item.type === 'social_post' && item.post.id === postId) {
        return {
          ...item,
          post: {
            ...item.post,
            comments: [newComment, ...item.post.comments],
            engagement: {
              ...item.post.engagement,
              comments: item.post.engagement.comments + 1,
              hasCommented: true
            }
          }
        };
      }
      return item;
    }));
  };

  const handleShare = (postId: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.type === 'social_post' && item.post.id === postId) {
        return {
          ...item,
          post: {
            ...item.post,
            engagement: {
              ...item.post.engagement,
              shares: item.post.engagement.shares + 1,
              hasShared: true
            }
          }
        };
      }
      return item;
    }));
  };

  const filteredItems = feedItems.filter(item => {
    if (filter === 'posts') return item.type === 'social_post';
    if (filter === 'jobs') return item.type === 'job_posting';
    if (filter === 'companies') return item.type === 'social_post' && item.post.author.isVerified;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Feed Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All Updates', icon: '🌟' },
            { key: 'posts', label: 'Posts', icon: '💭' },
            { key: 'jobs', label: 'Jobs', icon: '💼' },
            { key: 'companies', label: 'Companies', icon: '🏢' }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === key
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed Items */}
      <div className="space-y-6">
        {filteredItems.map((item) => {
          if (item.type === 'social_post') {
            return (
              <SocialFeedPost
                key={item.id}
                post={item.post}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onViewProfile={onViewProfile}
              />
            );
          } else if (item.type === 'job_posting') {
            return (
              <EnhancedJobCard
                key={item.id}
                job={item.job}
                user={currentUser}
                resumes={resumes}
                onViewJobDetails={onViewJobDetails}
                onViewCompanyProfile={onViewCompanyProfile}
                onApplyJob={onApplyJob}
                onSaveJob={onSaveJob}
                showApplicationModal={userType === 'job_seeker'}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Load More Updates
        </button>
      </div>
    </div>
  );
};

export default UnifiedSocialFeed;