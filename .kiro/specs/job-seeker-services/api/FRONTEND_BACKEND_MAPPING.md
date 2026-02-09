# Frontend-Backend Data Flow Mapping

**Purpose:** Show backend engineers exactly where each API is used in the frontend

---

## 1. Application Management Flow

### User Applies for Job

**Frontend Flow:**
```
User clicks "Apply" button
  ↓
JobDetailsPage.tsx / DashboardOverview.tsx
  ↓
App.tsx → handleApplyJob() (line 388)
  ↓
Currently: Creates local Application object
  ↓
NEEDS: Call POST /api/v1/applications
```

**Current Frontend Code (App.tsx):**
```typescript
const handleApplyJob = (job: Job) => {
  if (applications.some(app => app.job.id === job.id)) return;
  const newApplication: Application = {
      job,
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
  };
  setApplications(prev => [newApplication, ...prev]);
};
```

**Backend API Needed:**
```
POST /api/v1/applications
Body: { jobId, resumeId?, coverLetter? }
Response: Full Application object with job details
```

---

### View Applications List

**Frontend Flow:**
```
User navigates to "My Applications" tab
  ↓
JobSeekerDashboardPage.tsx → renderContent()
  ↓
MyApplications.tsx component
  ↓
Currently: Receives applications from props
  ↓
NEEDS: Fetch from GET /api/v1/applications
```

**Current Frontend Code (MyApplications.tsx):**
```typescript
interface MyApplicationsProps {
  applications: Application[];  // Currently from props
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
}
```

**Backend API Needed:**
```
GET /api/v1/applications?status=Applied&page=1&limit=20
Response: { applications: Application[], pagination: {...} }
```

**Data Used in UI:**
- `app.job.logo` - Company logo image
- `app.job.title` - Job title
- `app.job.company` - Company name
- `app.job.location` - Job location
- `app.status` - Application status badge
- `app.appliedDate` - Formatted as: new Date(app.appliedDate).toLocaleDateString()

---

## 2. Saved Jobs Flow

### User Saves a Job

**Frontend Flow:**
```
User clicks bookmark icon on job card
  ↓
JobCard.tsx / DashboardOverview.tsx
  ↓
App.tsx → handleToggleSaveJob() (line 398)
  ↓
Currently: Adds/removes from local state
  ↓
NEEDS: Call POST /api/v1/jobs/{jobId}/save
```

**Current Frontend Code (App.tsx):**
```typescript
const handleToggleSaveJob = (job: Job) => {
  if (savedJobs.some(saved => saved.id === job.id)) {
      setSavedJobs(prev => prev.filter(saved => saved.id !== job.id));
  } else {
      setSavedJobs(prev => [job, ...prev]);
  }
};
```

**Backend APIs Needed:**
```
POST /api/v1/jobs/{jobId}/save
DELETE /api/v1/jobs/{jobId}/unsave
```

**API Already Defined (src/api/jobApi.ts):**
```typescript
export async function saveJob(jobId: string): Promise<{ success: boolean }> {
  return httpPost<{ success: boolean }>(`/api/v1/jobs/${jobId}/save`, {});
}

export async function unsaveJob(jobId: string): Promise<{ success: boolean }> {
  return httpPost<{ success: boolean }>(`/api/v1/jobs/${jobId}/unsave`, {});
}
```

**Status:** ✅ API functions exist but NOT integrated with UI

---

### View Saved Jobs List

**Frontend Flow:**
```
User navigates to "Saved Jobs" tab
  ↓
JobSeekerDashboardPage.tsx → renderContent()
  ↓
SavedJobs.tsx component
  ↓
Currently: Receives savedJobs from props
  ↓
NEEDS: Fetch from GET /api/v1/jobs/saved
```

**Current Frontend Code (SavedJobs.tsx):**
```typescript
interface SavedJobsProps {
  savedJobs: Job[];  // Currently from props
  onViewJobDetails: (job: Job) => void;
  onViewCompanyProfile: (companyId: string) => void;
}
```

**Backend API Needed:**
```
GET /api/v1/jobs/saved?page=1&limit=20
Response: { savedJobs: Job[], pagination: {...} }
```

**Data Used in UI:**
- Renders JobCard component for each saved job
- JobCard uses: job.logo, job.title, job.company, job.location, job.type, job.salary

---

## 3. Job Recommendations Flow

### Load Personalized Recommendations

**Frontend Flow:**
```
User views Dashboard Overview
  ↓
DashboardOverview.tsx → useEffect() (line 48)
  ↓
loadPersonalizedContent() (line 50)
  ↓
Currently: Creates hardcoded mock jobs
  ↓
NEEDS: Call GET /api/v1/jobs/recommendations
```

**Current Frontend Code (DashboardOverview.tsx - lines 50-80):**
```typescript
const loadPersonalizedContent = async () => {
    setLoading(true);
    try {
        // Simulate API calls for personalized content
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock recommended jobs based on user profile
        const mockRecommendedJobs: Job[] = [
            {
                id: 'rec-1',
                title: 'Senior Frontend Developer',
                company: 'TechCorp Inc.',
                location: 'San Francisco, CA',
                type: 'Full-time',
                salary: '$120,000 - $150,000',
                description: 'Join our team building next-generation web applications...',
                requirements: ['React', 'TypeScript', '5+ years experience'],
                postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                companyLogo: 'https://picsum.photos/seed/techcorp/100/100',
                isRemote: false,
                experienceLevel: 'Senior',
                companyId: 'techcorp'
            },
            // ... more mock jobs
        ];
        
        setRecommendedJobs(mockRecommendedJobs);
    } catch (error) {
        console.error('Failed to load personalized content:', error);
    } finally {
        setLoading(false);
    }
};
```

**Backend API Needed:**
```
GET /api/v1/jobs/recommendations?limit=10
Response: {
  recommendations: Job[] (with matchScore and matchReasons),
  pagination: {...},
  lastUpdated: "ISO timestamp"
}
```

**API Already Defined (src/api/jobApi.ts):**
```typescript
export async function getRecommendedJobs(limit: number = 10): Promise<Job[]> {
  return httpGet<Job[]>(`/api/v1/jobs/recommendations?limit=${limit}`);
}
```

**Status:** ✅ API function exists but returns mock data, NOT integrated with UI

**Integration Needed:**
```typescript
// Replace mock data with:
import { getRecommendedJobs } from '../../src/api/jobApi';

const loadPersonalizedContent = async () => {
    setLoading(true);
    try {
        const jobs = await getRecommendedJobs(10);
        setRecommendedJobs(jobs);
    } catch (error) {
        console.error('Failed to load recommendations:', error);
    } finally {
        setLoading(false);
    }
};
```

---

## 4. Dashboard Statistics Flow

### Display Application Count

**Frontend Flow:**
```
Dashboard sidebar and header
  ↓
JobSeekerDashboardPage.tsx (line 340)
  ↓
Currently: applications.length from props
  ↓
NEEDS: Real-time count from backend
```

**Current Frontend Code:**
```typescript
<div className="text-2xl font-bold text-blue-600">{applications.length}</div>
<div className="text-xs text-gray-500">Applications</div>
```

**Backend API Needed:**
```
GET /api/v1/applications/stats
Response: {
  total: 45,
  byStatus: { Applied: 20, "In Review": 8, ... },
  thisWeek: 5,
  thisMonth: 15
}
```

---

### Display Saved Jobs Count

**Frontend Flow:**
```
Dashboard sidebar navigation
  ↓
JobSeekerDashboardPage.tsx (line 195)
  ↓
Currently: savedJobs.length from props
  ↓
NEEDS: Real-time count from backend
```

**Current Frontend Code:**
```typescript
{ 
  id: 'saved_jobs', 
  label: 'Saved Jobs', 
  count: savedJobs.length,  // Badge count
  icon: <BookmarkIcon />
}
```

**Backend API Needed:**
```
GET /api/v1/jobs/saved/count
Response: { count: 12 }
```

---

## 5. Job Store Integration

### Job Search and Filtering

**Frontend Flow:**
```
User searches for jobs
  ↓
stores/useJobStore.ts → fetchJobs()
  ↓
Currently: Filters ALL_JOBS constant (mock data)
  ↓
NEEDS: Call backend search API
```

**Current Frontend Code (useJobStore.ts - line 77):**
```typescript
fetchJobs: async (newFilters = {}) => {
  set({ loading: true, error: null });

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const { filters, pagination } = get();
    const currentFilters = { ...filters, ...newFilters };
    set({ filters: currentFilters });

    // Apply filters to mock data (this logic will move to backend)
    let filteredJobs = [...ALL_JOBS];

    if (currentFilters.query) {
      const query = currentFilters.query.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }
    // ... more filtering logic
  }
}
```

**Backend API Needed:**
```
GET /api/v1/jobs?search=react&location=remote&type=Full-time&page=1&limit=12
Response: { jobs: Job[], total: 150, page: 1, pages: 13 }
```

**API Already Defined (src/api/jobApi.ts):**
```typescript
export async function searchJobs(params: JobSearchParams): Promise<JobSearchResponse> {
  const queryString = new URLSearchParams();
  // ... builds query string
  return httpGet<JobSearchResponse>(`/api/v1/jobs?${queryString.toString()}`);
}
```

**Status:** ✅ API function exists but NOT integrated with useJobStore

---

## Summary: What Backend Engineer Needs to Know

### Critical Fields That MUST Be Present

1. **Job Object - REQUIRED Fields:**
   ```typescript
   {
     id: number,           // Used everywhere
     logo: string,         // Used in ALL job displays (MyApplications, SavedJobs, etc.)
     companyId: string,    // Used for navigation to company profile
     title: string,
     company: string,
     location: string,
     type: "Full-time" | "Part-time" | "Contract" | "Freelance"  // Exact match required
   }
   ```

2. **Application Status - EXACT Values:**
   ```
   "Applied"
   "Resume Viewed"
   "In Review"
   "Shortlisted"
   "Interview"
   "Offered"
   "Rejected"
   ```
   ⚠️ These are case-sensitive and used in UI conditionals!

3. **Date Formats:**
   - `appliedDate`: Must be `YYYY-MM-DD` format (not ISO timestamp)
   - `posted`: ISO date string
   - `savedDate`: ISO timestamp

---

## Files That Need Backend Integration

### High Priority (Week 1)
1. **App.tsx**
   - Line 388: `handleApplyJob()` → POST /api/v1/applications
   - Line 398: `handleToggleSaveJob()` → POST/DELETE /api/v1/jobs/{id}/save

2. **DashboardOverview.tsx**
   - Line 50: `loadPersonalizedContent()` → GET /api/v1/jobs/recommendations

3. **MyApplications.tsx**
   - Needs: GET /api/v1/applications on component mount

4. **SavedJobs.tsx**
   - Needs: GET /api/v1/jobs/saved on component mount

### Medium Priority (Week 2)
5. **useJobStore.ts**
   - Line 77: `fetchJobs()` → GET /api/v1/jobs (search)

6. **JobSeekerDashboardPage.tsx**
   - Needs: GET /api/v1/applications/stats
   - Needs: GET /api/v1/jobs/saved/count

---

## API Functions Already Defined (But Not Integrated)

These functions exist in `src/api/jobApi.ts` but are NOT being called:

```typescript
✅ searchJobs(params)           // Defined but not used
✅ getJobById(jobId)            // Defined but not used
✅ saveJob(jobId)               // Defined but not used
✅ unsaveJob(jobId)             // Defined but not used
✅ getRecommendedJobs(limit)    // Defined but not used
✅ getTrendingJobs(limit)       // Defined but not used
✅ getSimilarJobs(jobId, limit) // Defined but not used
```

**Action Required:** Once backend implements these endpoints, frontend just needs to:
1. Import the functions
2. Replace mock data with API calls
3. Add error handling
4. Add loading states

---

## Testing the Integration

### Step 1: Test Individual Endpoints
```bash
# Test application submission
curl -X POST http://localhost:8081/api/v1/applications \
  -H "Authorization: Bearer TOKEN" \
  -d '{"jobId": "123"}'

# Test get applications
curl http://localhost:8081/api/v1/applications \
  -H "Authorization: Bearer TOKEN"
```

### Step 2: Verify Response Format
- Check that Job object includes `logo` field
- Check that `appliedDate` is in YYYY-MM-DD format
- Check that status values match exactly

### Step 3: Frontend Integration
- Replace mock data in components
- Test loading states
- Test error handling
- Verify UI displays correctly

---

**Next Steps:**
1. Backend implements Phase 1 APIs (Week 1)
2. Frontend integrates Phase 1 APIs
3. Test end-to-end flow
4. Move to Phase 2 APIs

**Questions?** Contact frontend team for clarification on any data structures or flows.
