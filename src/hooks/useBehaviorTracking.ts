import { useCallback } from 'react';
import { BehaviorAnalyzer } from '../utils/behaviorAnalytics';

export const useBehaviorTracking = (userId: string | null) => {
  const trackAction = useCallback((action: string, metadata?: any) => {
    if (!userId) return;
    
    BehaviorAnalyzer.trackAction(userId, action, metadata);
    
    // Optional: Send to analytics service
    console.log(`[Behavior] User ${userId} performed: ${action}`, metadata);
  }, [userId]);

  const trackJobApplication = useCallback((jobId: number) => {
    trackAction('apply_job', { jobId });
  }, [trackAction]);

  const trackJobPosting = useCallback((jobData: any) => {
    trackAction('post_job', jobData);
  }, [trackAction]);

  const trackProfileView = useCallback((profileId: string) => {
    trackAction('view_profile', { profileId });
  }, [trackAction]);

  const trackCompanyView = useCallback((companyId: string) => {
    trackAction('view_company', { companyId });
  }, [trackAction]);

  const trackResumeUpdate = useCallback(() => {
    trackAction('update_resume');
  }, [trackAction]);

  const trackCandidateSearch = useCallback((searchQuery: string) => {
    trackAction('search_candidates', { query: searchQuery });
  }, [trackAction]);

  const trackNetworkingAction = useCallback((actionType: 'connect' | 'message' | 'like', targetId: string) => {
    trackAction(`${actionType}_user`, { targetId });
  }, [trackAction]);

  return {
    trackAction,
    trackJobApplication,
    trackJobPosting,
    trackProfileView,
    trackCompanyView,
    trackResumeUpdate,
    trackCandidateSearch,
    trackNetworkingAction
  };
};