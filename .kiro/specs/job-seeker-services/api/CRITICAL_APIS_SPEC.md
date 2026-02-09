# Critical APIs Specification for Job Seeker Dashboard

**Document Version:** 1.0  
**Last Updated:** 2024  
**Target Audience:** Backend Engineers  
**Frontend Framework:** React + TypeScript  
**Backend Expected:** Spring Boot REST APIs

---

## Overview

This document provides the **exact API specifications** needed to support the Job Seeker Dashboard frontend. All request/response formats are based on the actual TypeScript types used in the frontend code.

**Priority APIs Covered:**
1. Application Management APIs
2. Saved Jobs APIs  
3. Job Recommendations APIs

---

## Authentication

All endpoints require JWT Bearer token authentication:
```
Authorization: Bearer {accessToken}
```

**User Context:** The `userId` is extracted from the JWT token, not passed in request body.

---

## 1. APPLICATION MANAGEMENT APIs

### 1.1 Submit Job Application

**Endpoint:** `POST /api/v1/applications`

**Purpose:** Submit a job application for the authenticated user

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobId": "string (required)",
  "resumeId": "string (optional - if not provided, use primary resume)",
  "coverLetter": "string (optional)",
  "answers": [
    {
      "questionId": "string",
      "answer": "string"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": "string (UUID)",
  "userId": "string",
  "jobId": "string",
  "job": {
    "id": "number",
    "title": "string",
    "company": "string",
    "companyId": "string",
    "logo": "string (URL)",
    "location": "string",
    "type": "Full-time | Part-time | Contract | Freelance",
    "salary": "string (optional)",
    "posted": "string (ISO date)",
    "description": "string (optional)",
    "responsibilities": ["string"],
    "skills": ["string"],
    "benefits": ["string"],
    "status": "Published | Closed | Draft",
    "applicationsCount": "number (optional)",
    "viewsCount": "number (optional)",
    "seniority": "Entry | Mid | Senior | Lead | Executive (optional)"
  },
  "status": "Applied",
  "appliedDate": "string (ISO date format: YYYY-MM-DD)",
  "resumeId": "string",
  "coverLetter": "string (optional)",
  "createdAt": "string (ISO timestamp)",
  "updatedAt": "string (ISO timestamp)"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid job ID or already applied
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Job not found
- `409 Conflict` - Already applied to this job

**Frontend Usage:**
- File: `App.tsx` (line 388)
- Component: `DashboardOverview.tsx`, `JobDetailsPage.tsx`
- Current behavior: Creates application with status "Applied"

---

### 1.2 Get User Applications

**Endpoint:** `GET /api/v1/applications`

**Purpose:** Retrieve all job applications for the authenticated user

**Query Parameters:**
```
?status=Applied,In Review,Shortlisted (optional - comma-separated)
&page=1 (optional, default: 1)
&limit=20 (optional, default: 20)
&sortBy=appliedDate (optional: appliedDate, status)
&sortOrder=desc (optional: asc, desc)
```

**Response (200 OK):**
```json
{
  "applications": [
    {
      "id": "string (UUID)",
      "userId": "string",
      "job": {
        "id": "number",
        "title": "string",
        "company": "string",
        "companyId": "string",
        "logo": "string (URL)",
        "location": "string",
        "type": "Full-time | Part-time | Contract | Freelance",
        "salary": "string (optional)",
        "posted": "string (ISO date)",
        "description": "string (optional)",
        "skills": ["string"],
        "seniority": "Entry | Mid | Senior | Lead | Executive (optional)"
      },
      "status": "Applied | Resume Viewed | In Review | Shortlisted | Interview | Offered | Rejected",
      "appliedDate": "string (YYYY-MM-DD format)",
      "lastUpdated": "string (ISO timestamp)",
      "notes": "string (optional - employer notes visible to candidate)"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

**Frontend Usage:**
- File: `MyApplications.tsx`
- Component: `DashboardOverview.tsx`
- Expected: Array of Application objects with full job details

**Important Notes:**
- The `job` object must include the `logo` field (used in UI)
- Status must match exactly: "Applied", "Resume Viewed", "In Review", "Shortlisted", "Interview", "Offered", "Rejected"
- Date format for `appliedDate` must be YYYY-MM-DD (used for display)

---

### 1.3 Get Single Application Details

**Endpoint:** `GET /api/v1/applications/{applicationId}`

**Purpose:** Get detailed information about a specific application

**Response (200 OK):**
```json
{
  "id": "string (UUID)",
  "userId": "string",
  "job": {
    "id": "number",
    "title": "string",
    "company": "string",
    "companyId": "string",
    "logo": "string (URL)",
    "location": "string",
    "type": "Full-time | Part-time | Contract | Freelance",
    "salary": "string",
    "posted": "string (ISO date)",
    "description": "string",
    "responsibilities": ["string"],
    "skills": ["string"],
    "benefits": ["string"]
  },
  "status": "Applied | Resume Viewed | In Review | Shortlisted | Interview | Offered | Rejected",
  "appliedDate": "string (YYYY-MM-DD)",
  "resumeId": "string",
  "coverLetter": "string (optional)",
  "timeline": [
    {
      "status": "Applied",
      "timestamp": "string (ISO timestamp)",
      "note": "string (optional)"
    },
    {
      "status": "Resume Viewed",
      "timestamp": "string (ISO timestamp)",
      "note": "string (optional)"
    }
  ],
  "employerNotes": "string (optional)",
  "interviewDetails": {
    "scheduledDate": "string (ISO timestamp, optional)",
    "location": "string (optional)",
    "type": "Phone | Video | In-person (optional)",
    "meetingLink": "string (optional)"
  }
}
```

**Error Responses:**
- `404 Not Found` - Application not found or doesn't belong to user

---

### 1.4 Withdraw Application

**Endpoint:** `PUT /api/v1/applications/{applicationId}/withdraw`

**Purpose:** Withdraw a job application

**Request Body:**
```json
{
  "reason": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "id": "string",
  "status": "Withdrawn",
  "withdrawnDate": "string (ISO timestamp)",
  "message": "Application withdrawn successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Cannot withdraw (e.g., already offered/rejected)
- `404 Not Found` - Application not found

---

### 1.5 Get Application Statistics

**Endpoint:** `GET /api/v1/applications/stats`

**Purpose:** Get aggregated statistics about user's applications

**Response (200 OK):**
```json
{
  "total": 45,
  "byStatus": {
    "Applied": 20,
    "Resume Viewed": 10,
    "In Review": 8,
    "Shortlisted": 4,
    "Interview": 2,
    "Offered": 1,
    "Rejected": 0
  },
  "thisWeek": 5,
  "thisMonth": 15,
  "averageResponseTime": "3.5 days",
  "interviewRate": 15.5,
  "offerRate": 2.2
}
```

**Frontend Usage:**
- Component: `DashboardOverview.tsx` (for stats cards)
- Used to show application progress and success metrics

---

## 2. SAVED JOBS APIs

### 2.1 Save a Job

**Endpoint:** `POST /api/v1/jobs/{jobId}/save`

**Purpose:** Save a job to user's saved jobs list

**Request Body:** Empty `{}`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Job saved successfully",
  "savedJob": {
    "id": "string (UUID)",
    "userId": "string",
    "jobId": "number",
    "savedDate": "string (ISO timestamp)"
  }
}
```

**Error Responses:**
- `404 Not Found` - Job not found
- `409 Conflict` - Job already saved

**Frontend Usage:**
- File: `src/api/jobApi.ts` (already defined)
- Component: `DashboardOverview.tsx`, `JobCard.tsx`
- Current: Defined but not integrated with backend

---

### 2.2 Unsave a Job

**Endpoint:** `DELETE /api/v1/jobs/{jobId}/unsave`

**Purpose:** Remove a job from user's saved jobs list

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Job removed from saved list"
}
```

**Error Responses:**
- `404 Not Found` - Job not in saved list

**Frontend Usage:**
- File: `src/api/jobApi.ts` (already defined)
- Component: `SavedJobs.tsx`

---

### 2.3 Get All Saved Jobs

**Endpoint:** `GET /api/v1/jobs/saved`

**Purpose:** Retrieve all saved jobs for the authenticated user

**Query Parameters:**
```
?page=1 (optional, default: 1)
&limit=20 (optional, default: 20)
&sortBy=savedDate (optional: savedDate, salary, posted)
&sortOrder=desc (optional: asc, desc)
```

**Response (200 OK):**
```json
{
  "savedJobs": [
    {
      "id": "number",
      "title": "string",
      "company": "string",
      "companyId": "string",
      "logo": "string (URL)",
      "location": "string",
      "type": "Full-time | Part-time | Contract | Freelance",
      "salary": "string (optional)",
      "posted": "string (ISO date)",
      "description": "string",
      "requirements": ["string"],
      "postedDate": "string (ISO timestamp)",
      "companyLogo": "string (URL)",
      "isRemote": "boolean",
      "experienceLevel": "string",
      "skills": ["string"],
      "savedDate": "string (ISO timestamp)"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

**Frontend Usage:**
- Component: `SavedJobs.tsx`
- Store: `useJobStore.ts`
- Expected: Array of full Job objects with savedDate

**Important Notes:**
- Must return complete Job objects (not just IDs)
- Include `logo` field for company logo display
- `savedDate` used for sorting

---

### 2.4 Get Saved Jobs Count

**Endpoint:** `GET /api/v1/jobs/saved/count`

**Purpose:** Get the count of saved jobs (for badges/counters)

**Response (200 OK):**
```json
{
  "count": 12
}
```

**Frontend Usage:**
- Component: `JobSeekerDashboardPage.tsx` (navigation badges)
- Used for: Displaying count in sidebar navigation

---

## 3. JOB RECOMMENDATIONS APIs

### 3.1 Get Personalized Job Recommendations

**Endpoint:** `GET /api/v1/jobs/recommendations`

**Purpose:** Get AI-powered personalized job recommendations based on user profile, skills, and behavior

**Query Parameters:**
```
?limit=10 (optional, default: 10, max: 50)
&page=1 (optional)
&refresh=false (optional - force refresh recommendations)
```

**Response (200 OK):**
```json
{
  "recommendations": [
    {
      "id": "number",
      "title": "string",
      "company": "string",
      "companyId": "string",
      "location": "string",
      "type": "Full-time | Part-time | Contract | Freelance",
      "salary": "string",
      "description": "string",
      "requirements": ["string"],
      "postedDate": "string (ISO timestamp)",
      "companyLogo": "string (URL)",
      "isRemote": "boolean",
      "experienceLevel": "string",
      "matchScore": 85,
      "matchReasons": [
        "Skills match: React, TypeScript",
        "Experience level: Senior",
        "Location preference: Remote"
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45
  },
  "lastUpdated": "string (ISO timestamp)"
}
```

**Recommendation Algorithm Requirements:**

The backend should calculate recommendations based on:

1. **User Skills Matching** (40% weight)
   - Match user's skills array with job's required skills
   - Calculate percentage match

2. **Experience Level** (20% weight)
   - Match user's `yearsOfExperience` with job's `seniority` level
   - Entry: 0-2 years, Mid: 2-5 years, Senior: 5-10 years, Lead: 10+ years

3. **Location Preference** (15% weight)
   - Match user's `location` with job's `location`
   - Remote jobs get bonus points

4. **User Behavior** (15% weight)
   - Jobs similar to previously viewed/saved jobs
   - Use `behaviorProfile.lastActiveCategories`

5. **Recency** (10% weight)
   - Prefer recently posted jobs
   - Jobs posted within last 7 days get higher score

**Frontend Usage:**
- File: `src/api/jobApi.ts` (already defined)
- Component: `DashboardOverview.tsx` (lines 50-80)
- Current: Using hardcoded mock data
- Expected: Real recommendations based on user profile

**Important Notes:**
- Must return complete Job objects (same structure as other job endpoints)
- Include `matchScore` (0-100) for each recommendation
- Include `matchReasons` array explaining why job was recommended
- Cache recommendations for 1 hour, refresh on user profile changes

---

### 3.2 Refresh Job Recommendations

**Endpoint:** `GET /api/v1/jobs/recommendations/refresh`

**Purpose:** Force refresh of job recommendations (clears cache and recalculates)

**Response (200 OK):**
```json
{
  "message": "Recommendations refreshed successfully",
  "count": 45,
  "lastUpdated": "string (ISO timestamp)"
}
```

**Frontend Usage:**
- Component: `DashboardOverview.tsx`
- Trigger: User clicks "Refresh Recommendations" button

---

### 3.3 Provide Recommendation Feedback

**Endpoint:** `POST /api/v1/jobs/recommendations/feedback`

**Purpose:** Allow users to provide feedback on recommendations to improve algorithm

**Request Body:**
```json
{
  "jobId": "number (required)",
  "feedback": "relevant | not_relevant | already_applied | not_interested",
  "reason": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Feedback recorded successfully"
}
```

**Frontend Usage:**
- Component: Job recommendation cards
- Purpose: Improve recommendation algorithm over time

---

## Database Schema Requirements

### Applications Table
```sql
CREATE TABLE applications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    job_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATE NOT NULL,
    resume_id VARCHAR(36),
    cover_letter TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    withdrawn_date TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (resume_id) REFERENCES resumes(id),
    
    UNIQUE KEY unique_user_job (user_id, job_id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_applied_date (applied_date)
);
```

### Saved Jobs Table
```sql
CREATE TABLE saved_jobs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    job_id BIGINT NOT NULL,
    saved_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    
    UNIQUE KEY unique_user_saved_job (user_id, job_id),
    INDEX idx_user_saved_date (user_id, saved_date)
);
```

### Job Recommendations Cache Table
```sql
CREATE TABLE job_recommendations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    job_id BIGINT NOT NULL,
    match_score INT NOT NULL,
    match_reasons JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    
    INDEX idx_user_score (user_id, match_score DESC),
    INDEX idx_expires (expires_at)
);
```

### Recommendation Feedback Table
```sql
CREATE TABLE recommendation_feedback (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    job_id BIGINT NOT NULL,
    feedback VARCHAR(50) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    
    INDEX idx_user_feedback (user_id, feedback)
);
```

---

## Frontend Type Definitions Reference

For backend engineers to understand the exact data structures expected:

### Application Type (TypeScript)
```typescript
interface Application {
  job: Job;
  status: 'Applied' | 'Resume Viewed' | 'In Review' | 'Shortlisted' | 'Interview' | 'Offered' | 'Rejected';
  appliedDate: string; // Format: YYYY-MM-DD
}
```

### Job Type (TypeScript)
```typescript
interface Job {
  id: number;
  title: string;
  company: string;
  companyId: string;
  logo: string; // URL
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  salary?: string;
  posted: string; // ISO date
  description?: string;
  responsibilities?: string[];
  skills?: string[];
  benefits?: string[];
  status?: 'Published' | 'Closed' | 'Draft';
  applicationsCount?: number;
  viewsCount?: number;
  seniority?: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
}
```

### User Type (TypeScript)
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  location: string;
  about: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    graduationYear: string;
  }>;
  yearsOfExperience?: number;
  userType?: 'job_seeker' | 'employer' | 'admin';
  behaviorProfile?: BehaviorProfile;
}
```

---

## Error Handling Standards

All error responses should follow this format:

```json
{
  "error": {
    "code": "string (e.g., APPLICATION_ALREADY_EXISTS)",
    "message": "string (user-friendly message)",
    "details": "string (optional technical details)",
    "timestamp": "string (ISO timestamp)"
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|-----------|-------------|
| 400 | INVALID_REQUEST | Missing or invalid request parameters |
| 400 | ALREADY_APPLIED | User has already applied to this job |
| 400 | JOB_ALREADY_SAVED | Job is already in saved list |
| 401 | UNAUTHORIZED | Invalid or missing authentication token |
| 403 | FORBIDDEN | User doesn't have permission |
| 404 | JOB_NOT_FOUND | Job doesn't exist |
| 404 | APPLICATION_NOT_FOUND | Application doesn't exist |
| 409 | CONFLICT | Resource conflict (duplicate) |
| 500 | INTERNAL_ERROR | Server error |

---

## Testing Requirements

### Required Test Data

Backend should provide seed data for testing:

1. **Test User:**
   - ID: `test-user-123`
   - Skills: `["React", "TypeScript", "Node.js", "Python"]`
   - Location: `"San Francisco, CA"`
   - Years of Experience: `5`

2. **Test Jobs:**
   - At least 20 jobs with varying:
     - Skills requirements
     - Experience levels
     - Locations
     - Job types

3. **Test Applications:**
   - At least 5 applications in different statuses

### API Testing Checklist

- [ ] All endpoints return correct HTTP status codes
- [ ] Response formats match TypeScript interfaces exactly
- [ ] Date formats are consistent (ISO 8601)
- [ ] Pagination works correctly
- [ ] Authentication is enforced on all endpoints
- [ ] Error messages are user-friendly
- [ ] Job recommendations algorithm produces relevant results
- [ ] Duplicate applications are prevented
- [ ] Saved jobs can be added/removed correctly

---

## Integration Notes for Backend Engineers

### Critical Fields That Must Be Present

1. **Job Object:**
   - `logo` field is REQUIRED (used in all job displays)
   - `companyId` is REQUIRED (used for navigation)
   - `type` must be exact match: "Full-time", "Part-time", "Contract", or "Freelance"

2. **Application Object:**
   - `appliedDate` must be in YYYY-MM-DD format (not ISO timestamp)
   - `status` must match exactly (case-sensitive)
   - Must include full `job` object (not just jobId)

3. **Recommendations:**
   - Must include `matchScore` (0-100)
   - Must include `matchReasons` array
   - Should be cached for performance

### Performance Considerations

1. **Job Recommendations:**
   - Cache recommendations for 1 hour per user
   - Recalculate on profile changes
   - Use background job for expensive calculations

2. **Saved Jobs:**
   - Index on (user_id, saved_date) for fast retrieval
   - Consider denormalizing job data to avoid joins

3. **Applications:**
   - Index on (user_id, status) for filtering
   - Index on applied_date for sorting

### Security Considerations

1. **Authorization:**
   - Always verify user owns the application/saved job
   - Don't expose other users' data
   - Validate job exists before allowing save/apply

2. **Rate Limiting:**
   - Limit applications to 50 per day per user
   - Limit recommendation refreshes to 10 per hour
   - Limit saved jobs to 500 per user

3. **Data Validation:**
   - Validate all enum values (status, type, etc.)
   - Sanitize user input (cover letters, feedback)
   - Validate date formats

---

## API Implementation Priority

### Phase 1: Core Functionality (Week 1)
1. ✅ POST /api/v1/applications - Submit application
2. ✅ GET /api/v1/applications - Get user applications
3. ✅ POST /api/v1/jobs/{jobId}/save - Save job
4. ✅ DELETE /api/v1/jobs/{jobId}/unsave - Unsave job
5. ✅ GET /api/v1/jobs/saved - Get saved jobs

### Phase 2: Enhanced Features (Week 2)
6. ✅ GET /api/v1/applications/{id} - Get application details
7. ✅ PUT /api/v1/applications/{id}/withdraw - Withdraw application
8. ✅ GET /api/v1/applications/stats - Get statistics
9. ✅ GET /api/v1/jobs/saved/count - Get saved count

### Phase 3: Recommendations (Week 3)
10. ✅ GET /api/v1/jobs/recommendations - Get recommendations
11. ✅ GET /api/v1/jobs/recommendations/refresh - Refresh recommendations
12. ✅ POST /api/v1/jobs/recommendations/feedback - Feedback

---

## Frontend Integration Checklist

Once backend APIs are ready, frontend needs to:

- [ ] Replace mock data in `DashboardOverview.tsx` with API calls
- [ ] Update `useJobStore.ts` to use real API instead of ALL_JOBS constant
- [ ] Integrate `saveJob` and `unsaveJob` functions from `jobApi.ts`
- [ ] Add error handling for all API calls
- [ ] Add loading states for async operations
- [ ] Update `App.tsx` to fetch applications from API
- [ ] Add toast notifications for success/error messages
- [ ] Implement retry logic for failed requests

---

## Contact & Questions

**Frontend Lead:** [Your Name]  
**Backend Lead:** [Backend Engineer Name]  
**API Base URL:** `http://localhost:8081/api/v1` (development)

**Questions to Clarify:**
1. Should we support bulk operations (e.g., delete multiple saved jobs)?
2. What's the maximum number of applications per user?
3. Should recommendations be real-time or batch processed?
4. Do we need webhooks for application status changes?
5. Should we implement GraphQL for complex queries?

---

**Document End**
