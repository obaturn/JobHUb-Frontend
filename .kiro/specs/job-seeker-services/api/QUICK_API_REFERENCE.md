# Quick API Reference - Job Seeker Dashboard

**For Backend Engineers** - Quick lookup for endpoint signatures

---

## 1. APPLICATION MANAGEMENT

```
POST   /api/v1/applications
GET    /api/v1/applications
GET    /api/v1/applications/{id}
PUT    /api/v1/applications/{id}/withdraw
GET    /api/v1/applications/stats
```

### Submit Application
```bash
POST /api/v1/applications
Authorization: Bearer {token}

{
  "jobId": "string",
  "resumeId": "string (optional)",
  "coverLetter": "string (optional)"
}

→ 201 Created
{
  "id": "uuid",
  "job": { /* full job object */ },
  "status": "Applied",
  "appliedDate": "YYYY-MM-DD"
}
```

### Get Applications
```bash
GET /api/v1/applications?status=Applied&page=1&limit=20

→ 200 OK
{
  "applications": [
    {
      "job": { /* full job object with logo */ },
      "status": "Applied | Resume Viewed | In Review | Shortlisted | Interview | Offered | Rejected",
      "appliedDate": "YYYY-MM-DD"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45 }
}
```

---

## 2. SAVED JOBS

```
POST   /api/v1/jobs/{jobId}/save
DELETE /api/v1/jobs/{jobId}/unsave
GET    /api/v1/jobs/saved
GET    /api/v1/jobs/saved/count
```

### Save Job
```bash
POST /api/v1/jobs/{jobId}/save
Authorization: Bearer {token}

{}

→ 201 Created
{
  "success": true,
  "message": "Job saved successfully"
}
```

### Get Saved Jobs
```bash
GET /api/v1/jobs/saved?page=1&limit=20

→ 200 OK
{
  "savedJobs": [
    { /* full job object with savedDate */ }
  ],
  "pagination": { "page": 1, "total": 12 }
}
```

---

## 3. JOB RECOMMENDATIONS

```
GET  /api/v1/jobs/recommendations
GET  /api/v1/jobs/recommendations/refresh
POST /api/v1/jobs/recommendations/feedback
```

### Get Recommendations
```bash
GET /api/v1/jobs/recommendations?limit=10&page=1

→ 200 OK
{
  "recommendations": [
    {
      /* full job object */
      "matchScore": 85,
      "matchReasons": [
        "Skills match: React, TypeScript",
        "Experience level: Senior"
      ]
    }
  ],
  "pagination": { "page": 1, "total": 45 },
  "lastUpdated": "ISO timestamp"
}
```

### Recommendation Algorithm
```
Match Score = 
  Skills Match (40%) +
  Experience Level (20%) +
  Location (15%) +
  User Behavior (15%) +
  Recency (10%)
```

---

## Key Data Structures

### Job Object (REQUIRED FIELDS)
```json
{
  "id": "number",
  "title": "string",
  "company": "string",
  "companyId": "string",
  "logo": "string (URL) ← REQUIRED",
  "location": "string",
  "type": "Full-time | Part-time | Contract | Freelance",
  "salary": "string (optional)",
  "posted": "string (ISO date)",
  "description": "string",
  "skills": ["string"],
  "seniority": "Entry | Mid | Senior | Lead | Executive"
}
```

### Application Status Values
```
"Applied"
"Resume Viewed"
"In Review"
"Shortlisted"
"Interview"
"Offered"
"Rejected"
```

**⚠️ IMPORTANT:** Status values are case-sensitive and must match exactly!

---

## Common Errors

```json
400 Bad Request
{
  "error": {
    "code": "ALREADY_APPLIED",
    "message": "You have already applied to this job"
  }
}

404 Not Found
{
  "error": {
    "code": "JOB_NOT_FOUND",
    "message": "Job not found"
  }
}

401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing authentication token"
  }
}
```

---

## Testing Endpoints

### Test with cURL

```bash
# Submit Application
curl -X POST http://localhost:8081/api/v1/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "123", "coverLetter": "I am interested..."}'

# Get Applications
curl -X GET http://localhost:8081/api/v1/applications \
  -H "Authorization: Bearer YOUR_TOKEN"

# Save Job
curl -X POST http://localhost:8081/api/v1/jobs/123/save \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{}'

# Get Saved Jobs
curl -X GET http://localhost:8081/api/v1/jobs/saved \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Recommendations
curl -X GET http://localhost:8081/api/v1/jobs/recommendations?limit=5 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Database Tables

```sql
-- Applications
applications (id, user_id, job_id, status, applied_date, resume_id, cover_letter)

-- Saved Jobs
saved_jobs (id, user_id, job_id, saved_date)

-- Recommendations Cache
job_recommendations (id, user_id, job_id, match_score, match_reasons, expires_at)

-- Feedback
recommendation_feedback (id, user_id, job_id, feedback, reason)
```

---

## Implementation Checklist

### Phase 1 (Core - Week 1)
- [ ] POST /api/v1/applications
- [ ] GET /api/v1/applications
- [ ] POST /api/v1/jobs/{jobId}/save
- [ ] DELETE /api/v1/jobs/{jobId}/unsave
- [ ] GET /api/v1/jobs/saved

### Phase 2 (Enhanced - Week 2)
- [ ] GET /api/v1/applications/{id}
- [ ] PUT /api/v1/applications/{id}/withdraw
- [ ] GET /api/v1/applications/stats
- [ ] GET /api/v1/jobs/saved/count

### Phase 3 (Recommendations - Week 3)
- [ ] GET /api/v1/jobs/recommendations
- [ ] Implement recommendation algorithm
- [ ] GET /api/v1/jobs/recommendations/refresh
- [ ] POST /api/v1/jobs/recommendations/feedback

---

**See CRITICAL_APIS_SPEC.md for complete details**
