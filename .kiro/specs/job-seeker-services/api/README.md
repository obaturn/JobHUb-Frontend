# Job Seeker Dashboard API Documentation

**For Backend Engineers Building the APIs**

---

## 📚 Documentation Structure

This directory contains complete API specifications for the Job Seeker Dashboard:

### 1. **CRITICAL_APIS_SPEC.md** (⭐ START HERE)
   - Complete API specifications with request/response formats
   - Database schema requirements
   - Error handling standards
   - Testing requirements
   - **Use this for:** Full implementation details

### 2. **QUICK_API_REFERENCE.md**
   - Quick lookup for endpoint signatures
   - cURL examples for testing
   - Common error codes
   - Implementation checklist
   - **Use this for:** Quick reference during development

### 3. **FRONTEND_BACKEND_MAPPING.md**
   - Shows exactly where each API is used in frontend
   - Current frontend code snippets
   - Integration points
   - Files that need updating
   - **Use this for:** Understanding the data flow

---

## 🎯 Quick Start for Backend Engineers

### What You're Building

3 critical API groups to support the Job Seeker Dashboard:

1. **Application Management** (5 endpoints)
   - Submit job applications
   - View application status
   - Track application history

2. **Saved Jobs** (4 endpoints)
   - Save/unsave jobs
   - View saved jobs list
   - Get saved count

3. **Job Recommendations** (3 endpoints)
   - AI-powered job matching
   - Personalized recommendations
   - Feedback collection

**Total:** 12 endpoints to implement

---

## 📋 Implementation Priority

### Phase 1: Core Functionality (Week 1) ⚡
```
✅ POST   /api/v1/applications
✅ GET    /api/v1/applications
✅ POST   /api/v1/jobs/{jobId}/save
✅ DELETE /api/v1/jobs/{jobId}/unsave
✅ GET    /api/v1/jobs/saved
```

### Phase 2: Enhanced Features (Week 2) 🚀
```
✅ GET /api/v1/applications/{id}
✅ PUT /api/v1/applications/{id}/withdraw
✅ GET /api/v1/applications/stats
✅ GET /api/v1/jobs/saved/count
```

### Phase 3: Recommendations (Week 3) 🤖
```
✅ GET  /api/v1/jobs/recommendations
✅ GET  /api/v1/jobs/recommendations/refresh
✅ POST /api/v1/jobs/recommendations/feedback
```

---

## ⚠️ Critical Requirements

### 1. Job Object MUST Include These Fields
```json
{
  "id": "number",
  "logo": "string (URL)",      ← REQUIRED for UI
  "companyId": "string",       ← REQUIRED for navigation
  "title": "string",
  "company": "string",
  "location": "string",
  "type": "Full-time | Part-time | Contract | Freelance"
}
```

### 2. Application Status Values (Case-Sensitive!)
```
"Applied"
"Resume Viewed"
"In Review"
"Shortlisted"
"Interview"
"Offered"
"Rejected"
```

### 3. Date Formats
- `appliedDate`: **YYYY-MM-DD** (not ISO timestamp!)
- `posted`: ISO date string
- `savedDate`: ISO timestamp

---

## 🔧 Technology Stack

**Frontend:**
- React + TypeScript
- Zustand (state management)
- Existing API client: `src/api/httpClient.ts`

**Backend Expected:**
- Spring Boot REST APIs
- JWT authentication
- MySQL/PostgreSQL database

**API Base URL:**
- Development: `http://localhost:8081/api/v1`
- Production: TBD

---

## 🗄️ Database Tables Needed

```sql
-- Applications
applications (
  id, user_id, job_id, status, 
  applied_date, resume_id, cover_letter
)

-- Saved Jobs
saved_jobs (
  id, user_id, job_id, saved_date
)

-- Recommendations Cache
job_recommendations (
  id, user_id, job_id, match_score, 
  match_reasons, expires_at
)

-- Feedback
recommendation_feedback (
  id, user_id, job_id, feedback, reason
)
```

See **CRITICAL_APIS_SPEC.md** for complete schema with indexes.

---

## 🧪 Testing Your APIs

### 1. Use the cURL Examples
```bash
# Test application submission
curl -X POST http://localhost:8081/api/v1/applications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jobId": "123", "coverLetter": "I am interested..."}'
```

### 2. Verify Response Format
- Check Job object has `logo` field
- Check `appliedDate` is YYYY-MM-DD format
- Check status values match exactly

### 3. Test with Frontend
- Frontend team will integrate once APIs are ready
- Coordinate on Slack/Teams for testing

---

## 📞 Communication

### Questions to Ask Frontend Team
1. ✅ Should we support bulk operations?
2. ✅ What's the max applications per user?
3. ✅ Real-time or batch recommendations?
4. ✅ Need webhooks for status changes?
5. ✅ GraphQL or REST?

### When APIs Are Ready
1. Update API base URL in frontend `.env`
2. Frontend will replace mock data with API calls
3. Coordinate testing session
4. Deploy to staging for QA

---

## 📖 Additional Resources

### Frontend Code Locations
- **API Client:** `src/api/httpClient.ts`
- **Job API:** `src/api/jobApi.ts` (functions already defined!)
- **Type Definitions:** `types.ts`
- **Dashboard:** `pages/JobSeekerDashboardPage.tsx`
- **Components:** `components/dashboard/`

### API Functions Already Defined (Not Integrated)
```typescript
// These exist but aren't being called yet:
saveJob(jobId)
unsaveJob(jobId)
getRecommendedJobs(limit)
searchJobs(params)
```

Once you implement the backend, frontend just needs to:
1. Import these functions
2. Replace mock data
3. Add error handling

---

## 🚀 Getting Started

1. **Read:** CRITICAL_APIS_SPEC.md (complete details)
2. **Reference:** QUICK_API_REFERENCE.md (during coding)
3. **Understand:** FRONTEND_BACKEND_MAPPING.md (data flow)
4. **Implement:** Phase 1 endpoints first
5. **Test:** Use cURL examples
6. **Coordinate:** With frontend team for integration

---

## ✅ Success Criteria

Your APIs are ready when:
- [ ] All Phase 1 endpoints return correct status codes
- [ ] Response formats match TypeScript interfaces exactly
- [ ] Job objects include `logo` field
- [ ] Date formats are correct
- [ ] Authentication works on all endpoints
- [ ] Error messages are user-friendly
- [ ] Pagination works correctly
- [ ] Recommendations algorithm produces relevant results

---

**Good luck! 🎉**

Questions? Contact the frontend team or refer to the detailed specs.
