/**
 * Behavior Tracking API Client
 * Communicates with backend at /api/v1/behavior/*
 */

import { httpPost, httpGet } from './httpClient';
import { BehaviorProfile } from '@/types';

export interface BehaviorTrackRequest {
  event: 'job_viewed' | 'job_applied' | 'job_saved' | 'job_posted' | 'time_spent';
  jobId?: string;
  duration?: number; // in minutes, for time_spent events
}

export interface BehaviorTrackResponse {
  success: boolean;
  message?: string;
}

/**
 * Track a user behavior event
 */
export async function trackBehavior(
  event: BehaviorTrackRequest
): Promise<BehaviorTrackResponse> {
  return httpPost<BehaviorTrackResponse>('/api/v1/behavior/track', event);
}

/**
 * Get user's behavior profile
 */
export async function getBehaviorProfile(): Promise<BehaviorProfile> {
  return httpGet<BehaviorProfile>('/api/v1/behavior/profile');
}
