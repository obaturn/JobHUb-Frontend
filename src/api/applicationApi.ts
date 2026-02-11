/**
 * Application API Client
 * Handles job application submissions, tracking, and management
 * Backend: Application Service on Port 8083
 * Routes through API Gateway on Port 8084
 */

import { httpPost, httpGet, httpPut } from './httpClient';

export interface SubmitApplicationRequest {
  jobId: number;
  resumeId?: string;
  coverLetter?: string;
}

export interface ApplicationResponse {
  id: string;
  userId: string;
  jobId: number;
  status: 'APPLIED' | 'RESUME_VIEWED' | 'IN_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'REJECTED' | 'WITHDRAWN';
  appliedDate: string;
  resumeId?: string;
  coverLetter?: string;
  withdrawnDate?: string;
  withdrawReason?: string;
}

export interface ApplicationDetailsResponse extends ApplicationResponse {
  job?: any; // Job details from backend
}

export interface PagedApplicationsResponse {
  applications: ApplicationResponse[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApplicationStatsResponse {
  total: number;
  thisWeek: number;
  interviewRate: number;
  byStatus: Record<string, number>;
}

/**
 * Submit a new job application
 * POST /api/v1/applications
 */
export async function submitApplication(request: SubmitApplicationRequest): Promise<ApplicationResponse> {
  console.log('📤 Submitting application:', request);
  return httpPost<ApplicationResponse>('/applications', request);
}

/**
 * Get user's applications with pagination and filtering
 * GET /api/v1/applications
 * 
 * For Job Seeker: Returns their own applications
 * For Employer: Pass jobId to get applications for that job
 */
export async function getUserApplications(
  jobId?: number,
  status?: string,
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PagedApplicationsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  });
  
  if (jobId) params.append('jobId', jobId.toString());
  if (status) params.append('status', status);
  
  console.log('📥 Fetching applications:', params.toString());
  return httpGet<PagedApplicationsResponse>(`/applications?${params.toString()}`);
}

/**
 * Get single application details
 * GET /api/v1/applications/{applicationId}
 */
export async function getApplicationDetails(applicationId: string): Promise<ApplicationDetailsResponse> {
  console.log('📄 Fetching application details:', applicationId);
  return httpGet<ApplicationDetailsResponse>(`/applications/${applicationId}`);
}

/**
 * Withdraw an application
 * PUT /api/v1/applications/{applicationId}/withdraw
 */
export async function withdrawApplication(
  applicationId: string,
  reason?: string
): Promise<ApplicationResponse> {
  console.log('🚫 Withdrawing application:', applicationId, reason);
  return httpPut<ApplicationResponse>(`/applications/${applicationId}/withdraw`, { reason });
}

/**
 * Update application status (Employer only)
 * PUT /api/v1/applications/{applicationId}/status
 */
export interface UpdateStatusRequest {
  status: 'IN_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'REJECTED';
  reason?: string;
}

export async function updateApplicationStatus(
  applicationId: string,
  request: UpdateStatusRequest
): Promise<ApplicationDetailsResponse> {
  console.log('📝 Updating application status:', applicationId, request.status);
  return httpPut<ApplicationDetailsResponse>(`/applications/${applicationId}/status`, request);
}

