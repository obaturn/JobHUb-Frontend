/**
 * Jobs API Client (Employer Features)
 * Handles job creation, management, and listing
 * Backend: Application Service on Port 8083
 * Routes through API Gateway on Port 8084
 */

import { httpPost, httpGet, httpPut } from './httpClient';

export interface CreateJobRequest {
  title: string;
  company: string;
  companyId?: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  salary?: string;
  description: string;
  responsibilities?: string[];
  skills: string[];
  benefits?: string[];
  status: 'Published' | 'Draft' | 'Closed';
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  isRemote: boolean;
  educationRequired?: string;
}

export interface JobResponse {
  id: number;
  title: string;
  company: string;
  companyId?: string;
  employerId: string;
  location: string;
  type: string;
  salary?: string;
  description: string;
  responsibilities?: string[];
  skills: string[];
  benefits?: string[];
  status: string;
  seniority: string;
  isRemote: boolean;
  educationRequired?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PagedJobsResponse {
  jobs: JobResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a new job posting (Employer only)
 * POST /api/v1/jobs
 */
export async function createJob(request: CreateJobRequest): Promise<JobResponse> {
  console.log('📤 Creating job:', request.title);
  return httpPost<JobResponse>('/jobs', request);
}

/**
 * Get employer's jobs
 * GET /api/v1/jobs?employerId={userId}
 */
export async function getEmployerJobs(
  employerId: string,
  status?: string,
  page: number = 1,
  limit: number = 20,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<PagedJobsResponse> {
  const params = new URLSearchParams({
    employerId,
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  });
  
  if (status) params.append('status', status);
  
  console.log('📥 Fetching employer jobs:', params.toString());
  return httpGet<PagedJobsResponse>(`/jobs?${params.toString()}`);
}

/**
 * Get single job by ID
 * GET /api/v1/jobs/{jobId}
 */
export async function getJobById(jobId: number): Promise<JobResponse> {
  console.log('📄 Fetching job:', jobId);
  return httpGet<JobResponse>(`/jobs/${jobId}`);
}

/**
 * Update job status (Employer only)
 * PUT /api/v1/jobs/{jobId}/status?status={status}
 */
export async function updateJobStatus(
  jobId: number,
  status: 'Published' | 'Draft' | 'Closed'
): Promise<JobResponse> {
  console.log('📝 Updating job status:', jobId, status);
  return httpPut<JobResponse>(`/jobs/${jobId}/status?status=${status}`, {});
}
