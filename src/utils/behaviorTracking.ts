/**
 * Behavior Tracking Utility
 * Tracks user interactions (views, applies, saves, etc.)
 * Sends events to backend via trackBehavior API
 */

import * as behaviorApi from '../api/behaviorApi';

export class BehaviorTracker {
  /**
   * Track when a user views a job listing
   */
  static async trackJobView(jobId: string): Promise<void> {
    try {
      await behaviorApi.trackBehavior({
        event: 'job_viewed',
        jobId,
      });
    } catch (error) {
      console.warn('Failed to track job view:', error);
      // Fail silently - don't block user experience
    }
  }

  /**
   * Track when a user applies to a job
   */
  static async trackJobApply(jobId: string): Promise<void> {
    try {
      await behaviorApi.trackBehavior({
        event: 'job_applied',
        jobId,
      });
    } catch (error) {
      console.warn('Failed to track job apply:', error);
      // Fail silently - don't block user experience
    }
  }

  /**
   * Track when a user saves a job
   */
  static async trackJobSave(jobId: string): Promise<void> {
    try {
      await behaviorApi.trackBehavior({
        event: 'job_saved',
        jobId,
      });
    } catch (error) {
      console.warn('Failed to track job save:', error);
      // Fail silently - don't block user experience
    }
  }

  /**
   * Track when an employer posts a job
   */
  static async trackJobPosted(jobId: string): Promise<void> {
    try {
      await behaviorApi.trackBehavior({
        event: 'job_posted',
        jobId,
      });
    } catch (error) {
      console.warn('Failed to track job posted:', error);
      // Fail silently - don't block user experience
    }
  }

  /**
   * Track time spent on platform
   * Call this periodically (e.g., every 5 minutes or on page unload)
   */
  static async trackTimeSpent(durationMinutes: number): Promise<void> {
    try {
      await behaviorApi.trackBehavior({
        event: 'time_spent',
        duration: durationMinutes,
      });
    } catch (error) {
      console.warn('Failed to track time spent:', error);
      // Fail silently - don't block user experience
    }
  }
}
