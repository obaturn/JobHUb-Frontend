# Step-by-Step Implementation Guide

## Start Here: Minimal Changes Required

I'm giving you the EXACT code changes needed. Copy-paste and adapt.

---

## Step 1: Update `types.ts` (5 minutes)

### Find this in your types.ts:
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  // ... other fields ...
  userType?: 'new_user' | 'job_seeker' | 'employer' | 'admin';
  status?: 'Active' | 'Suspended' | 'Banned';
  createdDate?: string;
}
```

### Replace with:
```typescript
// NEW: Add these interfaces BEFORE the User interface

export interface BehaviorProfile {
  viewedJobs: number;
  appliedJobs: number;
  savedJobs: number;
  postedJobs: number;
  timeSpentOnPlatform: number; // in minutes
  lastActiveCategories: string[];
  engagementLevel: 'low' | 'medium' | 'high';
  lastActiveAt: string;
}

export interface UserPreferences {
  dashboardLayout: 'default' | 'compact';
  recommendationFrequency: 'daily' | 'weekly' | 'none';
  emailNotifications: boolean;
}

// UPDATED: Add fields to User interface
export interface User {
  id: string;
  name: string;
  email: string;
  // ... existing fields stay the same ...
  userType?: 'new_user' | 'job_seeker' | 'employer' | 'admin';
  status?: 'Active' | 'Suspended' | 'Banned';
  createdDate?: string;
  
  // ⭐ ADD THESE TWO NEW FIELDS
  behaviorProfile?: BehaviorProfile;
  preferences?: UserPreferences;
}
```

---

## Step 2: Create `src/utils/behaviorTracking.ts` (5 minutes)

Create a new file:

```typescript
/**
 * Behavior Tracking Utility
 * Tracks user interactions (views, applies, saves, etc.)
 * Sends events to backend for aggregation
 */

export interface BehaviorEvent {
  userId: string;
  event: 'job_viewed' | 'job_applied' | 'job_saved' | 'job_posted' | 'time_spent';
  jobId?: string;
  duration?: number; // for time_spent events
  timestamp: string;
}

export class BehaviorTracker {
  /**
   * Track when a user views a job listing
   */
  static trackJobView(userId: string, jobId: string) {
    this.sendEvent({
      userId,
      event: 'job_viewed',
      jobId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track when a user applies to a job
   */
  static trackJobApply(userId: string, jobId: string) {
    this.sendEvent({
      userId,
      event: 'job_applied',
      jobId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track when a user saves a job
   */
  static trackJobSave(userId: string, jobId: string) {
    this.sendEvent({
      userId,
      event: 'job_saved',
      jobId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track when an employer posts a job
   */
  static trackJobPosted(userId: string, jobId: string) {
    this.sendEvent({
      userId,
      event: 'job_posted',
      jobId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track time spent on platform
   */
  static trackTimeSpent(userId: string, durationMinutes: number) {
    this.sendEvent({
      userId,
      event: 'time_spent',
      duration: durationMinutes,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Private helper: Send event to backend
   * Uses fire-and-forget pattern (doesn't block UI)
   */
  private static sendEvent(event: BehaviorEvent) {
    // Don't block UI - send in background
    fetch('/api/behavior/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    }).catch(err => {
      // Silently fail - don't break user experience if tracking fails
      console.debug('Behavior tracking failed:', err);
    });
  }
}
```

---

## Step 3: Update `stores/useAuthStore.ts` (10 minutes)

### Find the AuthState interface:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // ... other fields ...
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}
```

### Add these methods to the interface:
```typescript
interface AuthState {
  // ... existing fields ...
  
  // ⭐ ADD THESE TWO
  updateBehaviorProfile: (updates: Partial<BehaviorProfile>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}
```

### Find the create call where you set initial state:
```typescript
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  // ... other initial state ...
}));
```

### Add these new methods inside the store creation:
```typescript
export const useAuthStore = create<AuthState>((set, get) => ({
  // ... existing code ...

  // ⭐ NEW: Update behavior profile
  updateBehaviorProfile: (updates) => {
    set((state) => {
      if (!state.user) return state;
      
      const updated = {
        ...state.user,
        behaviorProfile: {
          ...state.user.behaviorProfile,
          ...updates
        }
      };
      
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(updated));
      
      return { user: updated };
    });
  },

  // ⭐ NEW: Update preferences
  updatePreferences: (updates) => {
    set((state) => {
      if (!state.user) return state;
      
      const updated = {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          ...updates
        }
      };
      
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(updated));
      
      return { user: updated };
    });
  },

  // ... rest of store ...
}));
```

---

## Step 4: Update Signup to Initialize Behavior (5 minutes)

### Find your signup method:
```typescript
signup: async (userData) => {
  // ... signup code ...
  const user = {
    id: '...',
    email: userData.email,
    // ... other fields ...
  } as User;
}
```

### Add behavior initialization:
```typescript
signup: async (userData) => {
  // ... existing signup code ...
  const user = {
    id: '...',
    email: userData.email,
    // ... existing fields ...
    userType: userData.userType || 'job_seeker',
    
    // ⭐ INITIALIZE BEHAVIOR
    behaviorProfile: {
      viewedJobs: 0,
      appliedJobs: 0,
      savedJobs: 0,
      postedJobs: 0,
      timeSpentOnPlatform: 0,
      lastActiveCategories: [],
      engagementLevel: 'low',
      lastActiveAt: new Date().toISOString()
    },
    
    // ⭐ INITIALIZE PREFERENCES
    preferences: {
      dashboardLayout: 'default',
      recommendationFrequency: 'weekly',
      emailNotifications: true
    }
  } as User;
  
  // ... rest of signup ...
}
```

---

## Step 5: Track Events When Users Interact (10 minutes)

### In Job View Component:
```typescript
// Find where you handle viewing a job
const handleViewJob = (job: Job) => {
  // ⭐ ADD THIS LINE
  BehaviorTracker.trackJobView(user.id, job.id.toString());
  
  // existing code...
  setSelectedJob(job);
  navigate('job_details');
};

// Don't forget to import
import { BehaviorTracker } from '../utils/behaviorTracking';
```

### In Job Apply Component:
```typescript
// Find where user applies to a job
const handleApplyJob = (job: Job) => {
  // ⭐ ADD THIS LINE
  BehaviorTracker.trackJobApply(user.id, job.id.toString());
  
  // existing code...
  const newApplication = { job, status: 'Applied', appliedDate: new Date().toISOString() };
  setApplications([...applications, newApplication]);
};
```

### In Save Job Component:
```typescript
// Find where user saves a job
const handleSaveJob = (job: Job) => {
  // ⭐ ADD THIS LINE
  BehaviorTracker.trackJobSave(user.id, job.id.toString());
  
  // existing code...
  setSavedJobs([...savedJobs, job]);
};
```

---

## Step 6: Add Personalized Content to Dashboard (15 minutes)

### Find your DashboardOverview component:
```typescript
// components/dashboard/DashboardOverview.tsx

interface DashboardOverviewProps {
  user: User;
  // ... other props ...
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user, ... }) => {
  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      {/* Current content */}
    </div>
  );
};
```

### Add personalization logic:
```typescript
// components/dashboard/DashboardOverview.tsx

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user, ... }) => {
  const behavior = user.behaviorProfile;

  // ⭐ NEW: Personalization logic
  const renderWelcomeSection = () => {
    if (!behavior || behavior.viewedJobs === 0) {
      // New user: show onboarding
      return (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-2">Welcome to JobHub!</h3>
          <p className="text-gray-700 mb-4">
            Start by exploring jobs. We'll personalize recommendations based on your activity.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Explore Jobs
          </button>
        </div>
      );
    }

    if (behavior.engagementLevel === 'low') {
      // Inactive user: show motivational content
      return (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <p className="text-gray-700">
            💡 Tip: Job seekers who spend 15+ minutes exploring get better recommendations. Keep going!
          </p>
        </div>
      );
    }

    if (behavior.appliedJobs > 5 && !user.completedAssessments?.length) {
      // Active user: suggest assessments
      return (
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-2">Boost Your Profile</h4>
          <p className="text-sm text-gray-700 mb-3">
            You've applied to {behavior.appliedJobs} jobs! Skill assessments help employers find you faster.
          </p>
          <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
            Take Assessment
          </button>
        </div>
      );
    }

    if (behavior.engagementLevel === 'high' && behavior.appliedJobs > 10) {
      // Power user: show referral
      return (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
          <h4 className="font-semibold mb-2">🎁 Earn Rewards</h4>
          <p className="text-sm text-gray-700 mb-3">
            You're a power user! Refer friends and both of you get rewards.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      
      {/* ⭐ NEW PERSONALIZED SECTION */}
      {renderWelcomeSection()}
      
      {/* ⭐ EXISTING CONTENT - Show based on behavior */}
      {behavior && behavior.viewedJobs > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-4">Recommended for You</h3>
          {/* Job recommendations */}
        </div>
      )}
      
      {/* Other sections */}
    </div>
  );
};
```

---

## Step 7: Optional - Test in Browser (2 minutes)

```javascript
// In browser console:

// Check current user's behavior
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.behaviorProfile);
// Output: { viewedJobs: 0, appliedJobs: 0, ... }

// Simulate updating behavior (for testing)
const updated = {
  ...user,
  behaviorProfile: {
    ...user.behaviorProfile,
    appliedJobs: 8,
    engagementLevel: 'high'
  }
};
localStorage.setItem('user', JSON.stringify(updated));

// Refresh page to see changes
location.reload();
```

---

## Summary of Changes

| File | Change | Time |
|------|--------|------|
| types.ts | Add BehaviorProfile, UserPreferences, update User | 5 min |
| src/utils/behaviorTracking.ts | Create new file | 5 min |
| stores/useAuthStore.ts | Add updateBehaviorProfile, updatePreferences | 10 min |
| stores/useAuthStore.ts | Initialize behavior in signup | 5 min |
| components/*/\*.tsx | Add BehaviorTracker.track\*() calls | 10 min |
| components/dashboard/DashboardOverview.tsx | Add personalization logic | 15 min |

**Total: ~50 minutes of coding**

---

## Next: Backend Integration

Once frontend is working, create backend endpoint:

```typescript
// POST /api/behavior/track
// Body: BehaviorEvent
// Response: { success: true }

interface BehaviorEvent {
  userId: string;
  event: 'job_viewed' | 'job_applied' | 'job_saved' | 'job_posted' | 'time_spent';
  jobId?: string;
  duration?: number;
  timestamp: string;
}
```

Backend should:
1. Save event to behavior_events table
2. Aggregate daily to behavior_profile
3. Calculate engagement_level
4. Update user.behaviorProfile on next login

---

## You're Done!

Frontend changes complete in ~1 hour. Users will now:
1. Get personalized welcome content
2. See different dashboard content as they become active
3. Receive smart suggestions based on engagement

All while keeping your secure role-based access control and separate dashboards per role!
