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
  resumeFile?: File;
  resumeFileName?: string;
  resumeContentType?: string;
  resumeData?: string;
  coverLetter?: string;
  applicantName: string;
  applicantEmail: string;
}

export interface ApplicationResponse {
  id: string;
  userId: string;
  jobId: number;
  jobTitle?: string;
  companyName?: string;
  status: 'APPLIED' | 'RESUME_VIEWED' | 'IN_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'REJECTED' | 'WITHDRAWN';
  appliedDate: string;
  resumeId?: string;
  resumeFileName?: string;
  coverLetter?: string;
  withdrawnDate?: string;
  withdrawReason?: string;
  applicantName?: string;
  applicantEmail?: string;
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
 * Uses JSON with base64-encoded resume data
 */
export async function submitApplication(request: SubmitApplicationRequest): Promise<ApplicationResponse> {
  console.log('📤 Submitting application:', request);
  
  // If there's a resume file, convert to base64
  if (request.resumeFile) {
    const base64Data = await fileToBase64(request.resumeFile);
    
    // Create the request with base64-encoded resume
    const requestWithResume = {
      ...request,
      resumeFileName: request.resumeFile.name,
      resumeContentType: request.resumeFile.type,
      resumeData: base64Data
    };
    
    // Remove the File object from the request (can't be JSON serialized)
    const { resumeFile, ...requestWithoutFile } = requestWithResume;
    
    console.log('📤 Submitting with resume file:', request.resumeFile.name);
    return httpPost<ApplicationResponse>('/applications', requestWithoutFile);
  }
  
  // No resume file - use regular JSON endpoint but still include resume info if resumeId is provided
  return httpPost<ApplicationResponse>('/applications', request);
}

/**
 * Convert a File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:application/pdf;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
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

/**
 * Download/view resume for an application (Employer only)
 * GET /api/v1/applications/{applicationId}/resume
 */
export async function downloadResume(applicationId: string): Promise<void> {
  console.log('📥 Downloading resume for application:', applicationId);
  
  // Get the blob data using authenticated httpClient
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8084/api/v1'}/applications/${applicationId}/resume`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to download resume: ${response.status} ${response.statusText}`);
  }
  
  // Get the blob from response
  const blob = await response.blob();
  
  // Create a temporary URL for the blob
  const fileURL = URL.createObjectURL(blob);
  
  // Open in new tab
  window.open(fileURL, '_blank');
}

/**
 * Get applications for a specific job (Employer only)
 * GET /api/v1/applications?jobId={jobId}
 */
export async function getJobApplications(jobId: number): Promise<PagedApplicationsResponse> {
  console.log('📥 Fetching applications for job:', jobId);
  return getUserApplications(jobId);
}

