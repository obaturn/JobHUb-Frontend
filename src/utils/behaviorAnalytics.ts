// LinkedIn-style behavioral intelligence system
export interface UserBehavior {
  jobApplications: number;
  jobPostings: number;
  profileViews: number;
  companyPageViews: number;
  resumeUpdates: number;
  candidateSearches: number;
  networkingActions: number;
  lastActivity: Date;
}

export interface BehaviorInsights {
  primaryIntent: 'job_seeking' | 'hiring' | 'networking' | 'mixed';
  confidence: number;
  suggestedContent: string[];
  adaptiveUI: {
    showJobRecommendations: boolean;
    showCandidateRecommendations: boolean;
    showNetworkingFeatures: boolean;
    showCompanyInsights: boolean;
  };
}

export class BehaviorAnalyzer {
  static analyzeBehavior(behavior: UserBehavior): BehaviorInsights {
    const {
      jobApplications,
      jobPostings,
      profileViews,
      companyPageViews,
      resumeUpdates,
      candidateSearches,
      networkingActions
    } = behavior;

    // Calculate behavior scores
    const jobSeekerScore = (jobApplications * 3) + (resumeUpdates * 2) + (profileViews * 1);
    const employerScore = (jobPostings * 5) + (candidateSearches * 3) + (companyPageViews * 1);
    const networkingScore = networkingActions * 2;

    const totalScore = jobSeekerScore + employerScore + networkingScore;
    
    // Determine primary intent
    let primaryIntent: BehaviorInsights['primaryIntent'] = 'mixed';
    let confidence = 0;

    if (jobSeekerScore > employerScore * 2) {
      primaryIntent = 'job_seeking';
      confidence = Math.min(jobSeekerScore / totalScore, 0.95);
    } else if (employerScore > jobSeekerScore * 2) {
      primaryIntent = 'hiring';
      confidence = Math.min(employerScore / totalScore, 0.95);
    } else if (networkingScore > (jobSeekerScore + employerScore)) {
      primaryIntent = 'networking';
      confidence = Math.min(networkingScore / totalScore, 0.95);
    } else {
      primaryIntent = 'mixed';
      confidence = 0.6;
    }

    // Generate adaptive UI settings
    const adaptiveUI = {
      showJobRecommendations: jobSeekerScore > 5 || primaryIntent === 'job_seeking',
      showCandidateRecommendations: employerScore > 5 || primaryIntent === 'hiring',
      showNetworkingFeatures: networkingScore > 3 || primaryIntent === 'networking',
      showCompanyInsights: companyPageViews > 2 || primaryIntent === 'hiring'
    };

    // Generate content suggestions
    const suggestedContent = this.generateContentSuggestions(primaryIntent, behavior);

    return {
      primaryIntent,
      confidence,
      suggestedContent,
      adaptiveUI
    };
  }

  private static generateContentSuggestions(
    intent: BehaviorInsights['primaryIntent'], 
    behavior: UserBehavior
  ): string[] {
    const suggestions: string[] = [];

    switch (intent) {
      case 'job_seeking':
        suggestions.push(
          'Complete your profile to get 3x more views',
          'Update your skills to match trending jobs',
          'Set up job alerts for your preferred roles'
        );
        if (behavior.resumeUpdates === 0) {
          suggestions.push('Upload your resume to get better matches');
        }
        break;

      case 'hiring':
        suggestions.push(
          'Post a job to reach qualified candidates',
          'Use our candidate search to find talent',
          'Upgrade to premium for advanced hiring tools'
        );
        break;

      case 'networking':
        suggestions.push(
          'Connect with professionals in your industry',
          'Share insights to build your professional brand',
          'Join industry groups to expand your network'
        );
        break;

      case 'mixed':
        suggestions.push(
          'Explore both job opportunities and networking',
          'Consider posting about your expertise',
          'Stay active to get personalized recommendations'
        );
        break;
    }

    return suggestions;
  }

  static trackAction(userId: string, action: string, metadata?: any) {
    // Track user actions for behavior analysis
    const behaviorData = this.getUserBehavior(userId);
    
    switch (action) {
      case 'apply_job':
        behaviorData.jobApplications++;
        break;
      case 'post_job':
        behaviorData.jobPostings++;
        break;
      case 'view_profile':
        behaviorData.profileViews++;
        break;
      case 'view_company':
        behaviorData.companyPageViews++;
        break;
      case 'update_resume':
        behaviorData.resumeUpdates++;
        break;
      case 'search_candidates':
        behaviorData.candidateSearches++;
        break;
      case 'connect_user':
      case 'send_message':
      case 'like_post':
        behaviorData.networkingActions++;
        break;
    }

    behaviorData.lastActivity = new Date();
    this.saveBehaviorData(userId, behaviorData);
  }

  static getUserBehavior(userId: string): UserBehavior {
    const stored = localStorage.getItem(`behavior_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    return {
      jobApplications: 0,
      jobPostings: 0,
      profileViews: 0,
      companyPageViews: 0,
      resumeUpdates: 0,
      candidateSearches: 0,
      networkingActions: 0,
      lastActivity: new Date()
    };
  }

  private static saveBehaviorData(userId: string, behavior: UserBehavior) {
    localStorage.setItem(`behavior_${userId}`, JSON.stringify(behavior));
  }
}