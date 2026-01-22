# Backend Integration - Quick Reference Guide

## 🚀 What Was Done

Successfully integrated the JobHub frontend with real backend APIs for authentication, behavior tracking, and user management. All mock implementations have been replaced with actual API calls.

---

## 📁 Key Files Created/Modified

### New Files (3)
1. **`src/api/httpClient.ts`** - HTTP client with automatic token refresh interceptor
2. **`src/api/behaviorApi.ts`** - Behavior tracking API client
3. **`src/utils/behaviorTracking.ts`** - BehaviorTracker utility class

### Modified Files (8)
1. **`stores/useAuthStore.ts`** - Rewrote to use real backend
2. **`src/api/authApi.ts`** - Replaced mock with real authentication
3. **`types.ts`** - Added BehaviorProfile interface
4. **`App.tsx`** - Initialize auth on app load
5. **`components/JobCard.tsx`** - Track job views
6. **`pages/JobDetailsPage.tsx`** - Track views, applies, saves
7. **`pages/CreateJobPage.tsx`** - Track job posts
8. **`components/dashboard/DashboardOverview.tsx`** - Show behavior-based personalization

---

## 🔑 Key Features Implemented

### 1. **Token Management**
- Access tokens: 15 minutes (localStorage)
- Refresh tokens: 7 days (localStorage)
- Automatic refresh on 401 response

### 2. **Session Recovery**
- App checks localStorage on mount
- Restores session using refresh token
- Seamless login after page refresh

### 3. **Behavior Tracking**
- Job views tracked
- Job applications tracked
- Job saves tracked
- Job posts tracked
- Time spent tracking ready

### 4. **Personalization**
- Dashboard shows engagement level
- Different messages based on user activity
- Behavior profile integrated into User type

---

## 🔌 API Endpoints Used

### Authentication
```
POST   /api/v1/auth/login          - Login
POST   /api/v1/auth/register       - Signup
GET    /api/v1/auth/me             - Get current user
POST   /api/v1/auth/logout         - Logout
POST   /api/v1/auth/refresh-token  - Refresh access token
```

### Behavior Tracking
```
POST   /api/v1/behavior/track      - Track user events
GET    /api/v1/behavior/profile    - Get behavior profile
```

---

## 📊 Behavior Event Types

```typescript
'job_viewed'    - User viewed a job listing
'job_applied'   - User applied to a job
'job_saved'     - User saved a job
'job_posted'    - User posted a new job (employer)
'time_spent'    - User spent time on platform
```

---

## 🔐 How Authentication Works

```
1. User logs in with email/password
   ↓
2. Backend validates and returns accessToken + refreshToken
   ↓
3. Both tokens stored in localStorage
   ↓
4. User state updated in Zustand store
   ↓
5. All API requests include Authorization header
   ↓
6. If 401 received:
   - Automatically call refresh-token endpoint
   - Update tokens
   - Retry original request
```

---

## 💾 Data Storage

### localStorage Keys
- `accessToken` - JWT access token (15 min expiry)
- `refreshToken` - JWT refresh token (7 day expiry)
- `user` - Current user data (JSON)

### In-Memory (Zustand Store)
- User object with all profile data
- Authentication state
- MFA state
- Loading/error states

---

## 🎯 Behavior Tracking Flow

```
User clicks/interacts
   ↓
Component calls BehaviorTracker.track*()
   ↓
BehaviorTracker calls behaviorApi.trackBehavior()
   ↓
behaviorApi calls httpClient with event data
   ↓
httpClient adds Authorization header
   ↓
Backend receives event with user identification
   ↓
Backend calculates engagement level
   ↓
Frontend fetches updated behaviorProfile on demand
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Signup creates new account
- [ ] Page refresh maintains session
- [ ] Logout clears tokens
- [ ] Invalid credentials show error

### Token Refresh
- [ ] Access token refreshes on 401
- [ ] Old request retried after refresh
- [ ] Refresh token updates on each refresh
- [ ] Session expires after 7 days

### Behavior Tracking
- [ ] Job views recorded when opening details
- [ ] Job applies recorded when applying
- [ ] Job saves recorded when saving
- [ ] Job posts recorded when publishing
- [ ] Tracking doesn't block user interactions
- [ ] Errors logged but don't show to user

### Personalization
- [ ] Dashboard shows engagement level
- [ ] Messages change based on engagement
- [ ] Behavior profile appears in user object

---

## 🚨 Error Handling

### Authentication Errors
- **401 Unauthorized** → Automatic token refresh
- **Refresh failed** → Redirect to login, clear tokens
- **Invalid credentials** → Show error message in form

### Behavior Tracking Errors
- **Network error** → Logged to console only
- **API failure** → Never blocks user
- **Failed silently** → console.warn, no UI error

---

## 🔄 Page Refresh Flow

```
Page loaded
   ↓
App.tsx mounts
   ↓
useAuthStore.initialize() called
   ↓
Check localStorage for refreshToken
   ↓
If found:
  ├─ Try stored accessToken first (fastest)
  ├─ If missing, call refresh-token endpoint
  ├─ Get updated user data via /auth/me
  └─ Restore full session
   ↓
User automatically logged in
```

---

## 🛠️ Common Tasks

### To Add Tracking to a New Component

```typescript
import { BehaviorTracker } from '@/src/utils/behaviorTracking';

// Track job view
BehaviorTracker.trackJobView(jobId);

// Track job apply
BehaviorTracker.trackJobApply(jobId);

// Track job save
BehaviorTracker.trackJobSave(jobId);

// Track time spent (in minutes)
BehaviorTracker.trackTimeSpent(5);
```

### To Access Current User

```typescript
import { useAuthStore } from '@/stores/useAuthStore';

const store = useAuthStore();
const user = store.user;
const engagement = user?.behaviorProfile?.engagementLevel;
```

### To Check Authentication Status

```typescript
const { isAuthenticated } = useAuthStore();

if (!isAuthenticated) {
  // Show login prompt or redirect
}
```

---

## 📋 Import Paths

Use the `@/` alias (configured in tsconfig.json):

```typescript
// ✅ Correct
import { BehaviorTracker } from '@/src/utils/behaviorTracking';
import { User } from '@/types';
import * as authApi from '@/src/api/authApi';

// ❌ Avoid
import { BehaviorTracker } from '../../../src/utils/behaviorTracking';
```

---

## 🔍 Debugging

### Check Auth State
```typescript
const store = useAuthStore.getState();
console.log('User:', store.user);
console.log('Token:', store.token);
console.log('Authenticated:', store.isAuthenticated);
```

### Check Tokens in localStorage
```javascript
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### Monitor API Calls
- Open DevTools Network tab
- Look for requests to `/api/v1/auth/*` and `/api/v1/behavior/*`
- Verify Authorization header is present
- Check response status codes

---

## 🎓 Architecture Overview

```
User Interface Layer
├── Components (JobCard, JobDetails, CreateJob)
├── Pages (Dashboard, Auth)
└── Hooks (useAuthStore)
        ↓
Utility Layer
├── BehaviorTracker (trackJobView, trackJobApply, etc.)
└── Other utilities
        ↓
API Client Layer
├── authApi (login, signup, logout, refresh)
├── behaviorApi (trackBehavior, getBehaviorProfile)
└── httpClient (token refresh interceptor)
        ↓
State Management
└── Zustand (useAuthStore)
        ↓
Local Storage
├── accessToken
├── refreshToken
└── user (JSON)
        ↓
Backend API
├── /api/v1/auth/*
└── /api/v1/behavior/*
```

---

## 📝 Type Definitions

### BehaviorProfile
```typescript
{
  viewedJobs: number;
  appliedJobs: number;
  savedJobs: number;
  postedJobs: number;
  shortlistedCandidates: number;
  timeSpentMinutes: number;
  lastActiveCategories: string[];
  lastActiveAt: string;
  engagementLevel: 'low' | 'medium' | 'high';
}
```

### User (Updated)
```typescript
interface User {
  // ... existing fields
  behaviorProfile?: BehaviorProfile;
}
```

---

## ✅ Implementation Complete

All frontend code is now integrated with the backend API:
- ✅ Authentication (login, signup, logout, refresh)
- ✅ Session management (localStorage + refresh token)
- ✅ Behavior tracking (5 event types)
- ✅ Token refresh interceptor (automatic 401 handling)
- ✅ Personalization (engagement-based messages)
- ✅ Error handling (graceful, non-blocking)
- ✅ Type safety (TypeScript throughout)

The build compiles successfully with no errors!

---

## 🚀 Next Steps

1. Start backend server on port 5000
2. Verify CORS configuration for localhost:5173
3. Test login/signup flow
4. Monitor behavior tracking accuracy
5. Validate session recovery on page refresh
6. Test token refresh on 401 responses
7. Monitor performance with tracking enabled

Happy coding! 🎉
