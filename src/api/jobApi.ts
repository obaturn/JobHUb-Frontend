/**
 * Job API Client
 * Communicates with backend at /api/v1/jobs/*
 */

import { httpPost, httpGet, httpPut } from './httpClient';
import { Job } from '@/types';

export interface JobFilters {
  search?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'lead';
  company?: string;
  category?: string;
  skills?: string[];
}

export interface JobSearchParams extends JobFilters {
  page?: number;
  limit?: number;
  sortBy?: 'recent' | 'salary' | 'relevance';
}

export interface JobSearchResponse {
  jobs: Job[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface JobDetailsResponse {
  job: Job;
  similarJobs: Job[];
  applicationCount?: number;
}

export interface SaveJobRequest {
  jobId: string;
}

/**
 * Search and get jobs with filters and pagination
 */
export async function searchJobs(params: JobSearchParams): Promise<JobSearchResponse> {
  const queryString = new URLSearchParams();
  
  if (params.search) queryString.append('search', params.search);
  if (params.location) queryString.append('location', params.location);
  if (params.salaryMin) queryString.append('salaryMin', params.salaryMin.toString());
  if (params.salaryMax) queryString.append('salaryMax', params.salaryMax.toString());
  if (params.jobType) queryString.append('jobType', params.jobType);
  if (params.experienceLevel) queryString.append('experienceLevel', params.experienceLevel);
  if (params.company) queryString.append('company', params.company);
  if (params.category) queryString.append('category', params.category);
  if (params.skills?.length) queryString.append('skills', params.skills.join(','));
  queryString.append('page', (params.page || 1).toString());
  queryString.append('limit', (params.limit || 10).toString());
  if (params.sortBy) queryString.append('sortBy', params.sortBy);

  return httpGet<JobSearchResponse>(`/api/v1/jobs?${queryString.toString()}`);
}

/**
 * Get single job details
 */
export async function getJobById(jobId: string): Promise<JobDetailsResponse> {
  return httpGet<JobDetailsResponse>(`/api/v1/jobs/${jobId}`);
}

/**
 * Get similar jobs to a given job
 */
export async function getSimilarJobs(jobId: string, limit: number = 5): Promise<Job[]> {
  return httpGet<Job[]>(`/api/v1/jobs/${jobId}/similar?limit=${limit}`);
}

/**
 * Get trending/popular jobs
 */
export async function getTrendingJobs(limit: number = 10): Promise<Job[]> {
  return httpGet<Job[]>(`/api/v1/jobs/trending?limit=${limit}`);
}

/**
 * Save a job for later
 */
export async function saveJob(jobId: string): Promise<{ success: boolean }> {
  return httpPost<{ success: boolean }>(`/api/v1/jobs/${jobId}/save`, {});
}

/**
 * Unsave a job
 */
export async function unsaveJob(jobId: string): Promise<{ success: boolean }> {
  return httpPost<{ success: boolean }>(`/api/v1/jobs/${jobId}/unsave`, {});
}

/**
 * Get recommended jobs based on user profile and behavior
 */
export async function getRecommendedJobs(limit: number = 10): Promise<Job[]> {
  return httpGet<Job[]>(`/api/v1/jobs/recommendations?limit=${limit}`);
}

/**
 * Get jobs by category
 */
export async function getJobsByCategory(category: string, limit: number = 10): Promise<Job[]> {
  return httpGet<Job[]>(`/api/v1/jobs/category/${category}?limit=${limit}`);
}

// ============== SAVED JOBS ==============

export interface SavedJobsResponse {
  savedJobs: Array<{
    id: number;
    jobId: number;
    savedDate: string;
    job: any; // Job details
  }>;
  total: number;
  page: number;
  pages: number;
  limit: number;
}

/**
 * Get saved jobs with pagination
 * GET /api/v1/jobs/saved
 */
export async function getSavedJobs(
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'savedDate',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<SavedJobsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  });
  
  console.log('📚 Fetching saved jobs:', params.toString());
  return httpGet<SavedJobsResponse>(`/jobs/saved?${params.toString()}`);
}

/**
 * Get saved jobs count
 * GET /api/v1/jobs/saved/count
 */
export async function getSavedJobsCount(): Promise<{ count: number }> {
  console.log('🔢 Fetching saved jobs count');
  return httpGet<{ count: number }>('/jobs/saved/count');
}

// ============== RECOMMENDATIONS ==============

export interface RecommendationResponse {
  recommendations: Array<{
    job: any; // Job details
    matchScore: number;
    matchReasons: string[];
  }>;
  total: number;
  page: number;
  cachedAt: string;
}

/**
 * Get job recommendations with pagination
 * GET /api/v1/jobs/recommendations
 */
export async function getRecommendations(
  limit: number = 10,
  page: number = 1,
  refresh: boolean = false
): Promise<RecommendationResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    refresh: refresh.toString()
  });
  
  console.log('🎯 Fetching job recommendations:', params.toString());
  return httpGet<RecommendationResponse>(`/jobs/recommendations?${params.toString()}`);
}

/**
 * Refresh recommendations (force recalculation)
 * GET /api/v1/jobs/recommendations/refresh
 */
export async function refreshRecommendations(): Promise<{ message: string; count: number }> {
  console.log('🔄 Refreshing recommendations');
  return httpGet<{ message: string; count: number }>('/jobs/recommendations/refresh');
}

/**
 * Provide feedback on recommendation
 * POST /api/v1/jobs/recommendations/feedback
 */
export interface RecommendationFeedbackRequest {
  jobId: number;
  feedback: 'INTERESTED' | 'NOT_INTERESTED' | 'APPLIED' | 'NOT_RELEVANT';
  reason?: string;
}

export async function provideFeedback(request: RecommendationFeedbackRequest): Promise<{ message: string }> {
  console.log('💬 Providing recommendation feedback:', request);
  return httpPost<{ message: string }>('/jobs/recommendations/feedback', request);
}
