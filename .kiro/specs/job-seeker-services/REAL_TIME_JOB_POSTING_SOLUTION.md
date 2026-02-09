# Real-Time Job Posting Solution

**Requirement:** When an employer posts a job, job seekers should **immediately** see it without having to search.

---

## 🎯 Solution: Shared Job Store + Real-Time Updates

### Option 1: **Simple Shared State (Recommended for MVP)**

Use a **shared job store** that both employers and job seekers access.

#### Architecture:
```
Employer Posts Job
   ↓
POST /api/v1/jobs → Database
   ↓
Backend returns new job
   ↓
Frontend adds to shared jobsStore
   ↓
✅ Job Seeker Dashboard automatically shows it
   ↓
✅ Job Search automatically includes it
```

---

### Implementation Steps

#### Step 1: Create Shared Jobs Store

**File:** `stores/useSharedJobsStore.ts` (NEW FILE)

```typescript
import { create } from 'zustand';
import { Job } from '../types';

interface SharedJobsState {
  allJobs: Job[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchAllJobs: () => Promise<void>;
  addJob: (job: Job) => void;
  updateJob: (jobId: number, updates: Partial<Job>) => void;
  deleteJob: (jobId: number) => void;
  refreshJobs: () => Promise<void>;
}

export const useSharedJobsStore = create<SharedJobsState>((set, get) => ({
  allJobs: [],
  loading: false,
  error: null,

  // Fetch all published jobs from backend
  fetchAllJobs: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch('http://localhost:8081/api/v1/jobs?status=Published', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      set({ allJobs: data.jobs || [], loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
        loading: false 
      });
    }
  },

  // Add newly posted job immediately
  addJob: (job: Job) => {
    set(state => ({
      allJobs: [job, ...state.allJobs]  // Add to beginning
    }));
  },

  // Update existing job
  updateJob: (jobId: number, updates: Partial<Job>) => {
    set(state => ({
      allJobs: state.allJobs.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      )
    }));
  },

  // Delete job
  deleteJob: (jobId: number) => {
    set(state => ({
      allJobs: state.allJobs.filter(job => job.id !== jobId)
    }));
  },

  // Refresh jobs from backend
  refreshJobs: async () => {
    await get().fetchAllJobs();
  }
}));
```

---

#### Step 2: Update Employer Job Posting

**File:** `App.tsx` (Update handlePublishJob)

```typescript
import { useSharedJobsStore } from './stores/useSharedJobsStore';

const App = () => {
  const { addJob } = useSharedJobsStore();
  
  const handlePublishJob = async (jobData: Partial<Job>) => {
    try {
      // 1. Post job to backend
      const response = await fetch('http://localhost:8081/api/v1/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...jobData,
          companyId: user?.companyId || 'default-company',
          employerId: user?.id,
          status: 'Published'
        })
      });

      if (!response.ok) throw new Error('Failed to post job');

      const newJob = await response.json();
      
      // 2. Add to shared store (immediately available to job seekers!)
      addJob(newJob);
      
      // 3. Also add to employer's local list
      setEmployerJobs(prev => [newJob, ...prev]);
      
      // 4. Show success message
      alert('✅ Job posted successfully! Job seekers can now see it.');
      
      navigate('employer_dashboard');
    } catch (error) {
      console.error('Failed to post job:', error);
      alert('❌ Failed to post job. Please try again.');
    }
  };
  
  return (
    // ... rest of app
  );
};
```

---

#### Step 3: Update Job Search to Use Shared Store

**File:** `components/job-search/JobListings.tsx`

```typescript
import { useSharedJobsStore } from '../../stores/useSharedJobsStore';
import { useEffect } from 'react';

const JobListings: React.FC<JobListingsProps> = ({ 
  onViewJobDetails, 
  onViewCompanyProfile, 
  onSaveSearch 
}) => {
  const { allJobs, loading, fetchAllJobs } = useSharedJobsStore();
  const [sortBy, setSortBy] = useState('Most Recent');

  // Fetch jobs on component mount
  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  // Sort jobs
  const sortedJobs = [...allJobs].sort((a, b) => {
    switch (sortBy) {
      case 'Most Recent':
        return new Date(b.posted).getTime() - new Date(a.posted).getTime();
      case 'Salary: High to Low':
        // ... sorting logic
      default:
        return 0;
    }
  });

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-dark">
          All Jobs
          <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {allJobs.length} opportunities
          </span>
        </h2>
        {/* ... sort dropdown */}
      </div>

      <div className="space-y-4">
        {sortedJobs.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            onViewJobDetails={onViewJobDetails}
            onViewCompanyProfile={onViewCompanyProfile}
          />
        ))}
      </div>
    </div>
  );
};
```

---

#### Step 4: Update Dashboard Overview to Show Latest Jobs

**File:** `components/dashboard/DashboardOverview.tsx`

```typescript
import { useSharedJobsStore } from '../../stores/useSharedJobsStore';

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  user, 
  applications, 
  savedJobs,
  // ... other props
}) => {
  const { allJobs, fetchAllJobs } = useSharedJobsStore();
  
  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  // Get latest 5 jobs
  const latestJobs = allJobs
    .sort((a, b) => new Date(b.posted).getTime() - new Date(a.posted).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ... existing content */}

      {/* Latest Jobs Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            Latest Job Postings
          </h2>
          <button
            onClick={() => onNavigate('job_search')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            See all →
          </button>
        </div>
        
        <div className="space-y-3">
          {latestJobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-green-600">{job.salary}</span>
                    <span className="text-xs text-gray-500">{job.type}</span>
                    <span className="text-xs text-blue-600">Posted {job.posted}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => onApplyJob?.(job)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => onSaveJob?.(job)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

---

## 🔄 Complete Flow

### When Employer Posts Job:

```
1. Employer fills out job form
   ↓
2. Clicks "Publish Job"
   ↓
3. Frontend calls: POST /api/v1/jobs
   ↓
4. Backend saves to database
   ↓
5. Backend returns job with ID
   ↓
6. Frontend adds to useSharedJobsStore
   ↓
7. ✅ Job immediately available everywhere!
```

### Where Job Appears Instantly:

```
✅ Job Search Page (JobListings.tsx)
✅ Dashboard Overview (Latest Jobs section)
✅ Job Recommendations (if matching user profile)
✅ Company Profile Page (company's jobs)
```

---

## 🚀 Option 2: Real-Time Updates with WebSocket (Advanced)

For **instant updates** without page refresh:

### Architecture:
```
Employer Posts Job
   ↓
POST /api/v1/jobs → Backend
   ↓
Backend saves to database
   ↓
Backend broadcasts via WebSocket
   ↓
All connected job seekers receive update
   ↓
✅ Job appears instantly on their screen
```

### Implementation:

#### Backend (Spring Boot)

```java
@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody JobRequest request) {
        // Save job to database
        Job newJob = jobService.createJob(request);
        
        // Broadcast to all connected clients
        messagingTemplate.convertAndSend("/topic/new-jobs", newJob);
        
        return ResponseEntity.ok(newJob);
    }
}
```

#### Frontend (React)

**File:** `src/hooks/useJobWebSocket.ts` (NEW FILE)

```typescript
import { useEffect } from 'react';
import { useSharedJobsStore } from '../stores/useSharedJobsStore';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const useJobWebSocket = () => {
  const { addJob } = useSharedJobsStore();

  useEffect(() => {
    // Connect to WebSocket
    const socket = new SockJS('http://localhost:8081/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('✅ Connected to job updates');
        
        // Subscribe to new job notifications
        stompClient.subscribe('/topic/new-jobs', (message) => {
          const newJob = JSON.parse(message.body);
          console.log('🆕 New job posted:', newJob.title);
          
          // Add to store (appears instantly!)
          addJob(newJob);
          
          // Show notification
          showNotification(`New job posted: ${newJob.title} at ${newJob.company}`);
        });
      },
      onDisconnect: () => {
        console.log('❌ Disconnected from job updates');
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [addJob]);
};

const showNotification = (message: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('New Job Posted!', {
      body: message,
      icon: '/logo.png'
    });
  }
};
```

**Use in App:**

```typescript
import { useJobWebSocket } from './hooks/useJobWebSocket';

const App = () => {
  // Enable real-time job updates
  useJobWebSocket();
  
  return (
    // ... rest of app
  );
};
```

---

## 📊 Comparison

| Feature | Option 1: Shared Store | Option 2: WebSocket |
|---------|----------------------|---------------------|
| **Complexity** | Simple | Advanced |
| **Real-time** | On page load/refresh | Instant (no refresh) |
| **Backend** | REST API only | REST + WebSocket |
| **Notifications** | No | Yes |
| **Scalability** | Good | Excellent |
| **Implementation Time** | 1-2 days | 3-5 days |

---

## 🎯 Recommended Approach

### Phase 1: Shared Store (Immediate)
1. Create `useSharedJobsStore`
2. Update employer posting to add to store
3. Update job search to use store
4. Update dashboard to show latest jobs

**Result:** Jobs appear when job seeker refreshes or navigates

### Phase 2: WebSocket (Later)
1. Add WebSocket support to backend
2. Implement `useJobWebSocket` hook
3. Add browser notifications

**Result:** Jobs appear instantly without refresh

---

## 🔧 Backend API Requirements

### POST /api/v1/jobs

**Request:**
```json
{
  "title": "Senior Frontend Developer",
  "companyId": "company-123",
  "employerId": "user-456",
  "location": "San Francisco, CA",
  "type": "Full-time",
  "salary": "$120k - $150k",
  "description": "We are looking for...",
  "requirements": "5+ years experience...",
  "skills": ["React", "TypeScript"],
  "status": "Published"
}
```

**Response:**
```json
{
  "id": 12345,
  "title": "Senior Frontend Developer",
  "company": "TechCorp",
  "companyId": "company-123",
  "employerId": "user-456",
  "logo": "https://...",
  "location": "San Francisco, CA",
  "type": "Full-time",
  "salary": "$120k - $150k",
  "posted": "2024-01-15T10:30:00Z",
  "status": "Published",
  "applicationsCount": 0,
  "viewsCount": 0,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### GET /api/v1/jobs

**Query Parameters:**
- `status=Published` (only show published jobs)
- `search=frontend` (optional)
- `location=remote` (optional)
- `type=Full-time` (optional)
- `page=1` (optional)
- `limit=20` (optional)

**Response:**
```json
{
  "jobs": [
    {
      "id": 12345,
      "title": "Senior Frontend Developer",
      ...
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8,
  "limit": 20
}
```

---

## ✅ Summary

**Your Question:** How to connect employer posting with job seeker seeing it immediately?

**Answer:** Use a **shared job store** that both access:

1. **Employer posts** → Adds to shared store
2. **Job seeker views** → Reads from shared store
3. **Backend syncs** → Keeps store updated

**Benefits:**
- ✅ Jobs appear immediately after posting
- ✅ No need to search first
- ✅ Shows in dashboard "Latest Jobs" section
- ✅ Shows in job search results
- ✅ Real-time with WebSocket (optional)

**Implementation:** Create `useSharedJobsStore.ts` and connect both employer and job seeker to it!

---

**Next Steps:**
1. Create the shared store file
2. Update employer posting to use it
3. Update job search to use it
4. Backend implements POST /api/v1/jobs
5. Backend implements GET /api/v1/jobs

Then it will work! 🚀
