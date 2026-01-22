# Backend Integration Implementation - Complete Changelog

## Overview
This document outlines all frontend changes made to integrate with the real backend API. The implementation follows a layered architecture: HTTP client → API clients → State management → Utilities → Components.

---

## 1. Infrastructure Layer

### Created: `src/api/httpClient.ts` (208 lines)
**Purpose:** HTTP client with automatic token refresh interceptor

**Key Features:**
- Token management (get/store/clear from localStorage)
- Automatic 401 error handling with token refresh
- Race condition prevention for simultaneous refresh requests
- Helper functions: `httpClient()`, `httpGet()`, `httpPost()`, `httpPut()`, `httpDelete()`

**Token Storage:**
- Access token: localStorage (15 minutes)
- Refresh token: localStorage (7 days)

**Interceptor Flow:**
1. Add Authorization header with access token
2. Send request
3. If 401 received:
   - Call `/api/v1/auth/refresh-token` with refresh token
   - Update tokens
   - Retry original request
   - If refresh fails → redirect to login

---

## 2. API Client Layer

### Updated: `src/api/authApi.ts` (87 lines)
**Purpose:** Real authentication API integration

**Functions:**
- `login(credentials)` → POST `/api/v1/auth/login`
- `signup(userData)` → POST `/api/v1/auth/register`
- `getCurrentUser()` → GET `/api/v1/auth/me`
- `logout()` → POST `/api/v1/auth/logout`
- `refreshToken(refreshToken)` → POST `/api/v1/auth/refresh-token`

**Interfaces:**
- LoginRequest, LoginResponse
- SignupRequest, SignupResponse
- RefreshTokenRequest, RefreshTokenResponse

**Dependencies:** Uses httpClient helpers (handles auth headers + refresh logic automatically)

### Created: `src/api/behaviorApi.ts` (32 lines)
**Purpose:** Behavior tracking API integration

**Functions:**
- `trackBehavior(event)` → POST `/api/v1/behavior/track`
- `getBehaviorProfile()` → GET `/api/v1/behavior/profile`

**Event Types:**
- `job_viewed` (with jobId)
- `job_applied` (with jobId)
- `job_saved` (with jobId)
- `job_posted` (with jobId)
- `time_spent` (with duration in minutes)

---

## 3. Type Definitions

### Updated: `types.ts`
**Added:** `BehaviorProfile` interface
```typescript
export interface BehaviorProfile {
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

**Updated:** `User` interface
- Added optional field: `behaviorProfile?: BehaviorProfile`

---

## 4. State Management Layer

### Updated: `stores/useAuthStore.ts` (Complete Rewrite)
**Changes:**
- Replaced all mock implementations with real API calls
- Added token management (store/retrieve from localStorage)
- Added automatic page refresh recovery via `initialize()` method
- Added `setToken()` method for httpClient interceptor to update store

**Key Methods:**

#### login()
- Calls `authApi.login()` with credentials
- Stores access token + refresh token in localStorage
- Sets user state and authentication flag
- Returns user data

#### signup()
- Calls `authApi.signup()` with user data
- Stores tokens in localStorage
- Sets authenticated state

#### logout()
- Calls `authApi.logout()` (best effort, non-blocking)
- Clears tokens from localStorage
- Resets auth state

#### refreshToken()
- Called by httpClient interceptor on 401
- Gets refresh token from localStorage
- Calls `authApi.refreshToken()`
- Updates access token in store and localStorage
- On failure, calls logout()

#### initialize()
- Called on app mount
- Checks localStorage for refresh token
- If found, attempts to restore session:
  - First tries to use stored access token + user data
  - If missing, calls `refreshToken()` to get new access token
  - Calls `getCurrentUser()` to validate and get latest user data
- Handles page refresh seamlessly
- Sets auth state appropriately if no valid session exists

#### updateProfile()
- Updates user data in store
- Persists to localStorage

---

## 5. Utility Layer

### Created: `src/utils/behaviorTracking.ts`
**Purpose:** BehaviorTracker utility class for tracking user interactions

**Static Methods:**
- `trackJobView(jobId)` - Track job listing views
- `trackJobApply(jobId)` - Track job applications
- `trackJobSave(jobId)` - Track saved jobs
- `trackJobPosted(jobId)` - Track job postings
- `trackTimeSpent(durationMinutes)` - Track time spent on platform

**Features:**
- All methods use async/await
- Calls `behaviorApi` functions internally
- Automatically includes Authorization header (via httpClient)
- Fail silently on errors (console.warn only, no UI errors)
- Non-blocking to user experience

---

## 6. Component Updates

### Updated: `components/JobCard.tsx`
**Changes:**
- Added import: `import { BehaviorTracker } from '../src/utils/behaviorTracking'`
- Updated job title button click handler:
  - Calls `BehaviorTracker.trackJobView(job.id)` before opening details
  - Then navigates to job details

### Updated: `pages/JobDetailsPage.tsx`
**Changes:**
- Added import: `import { BehaviorTracker } from '../src/utils/behaviorTracking'`
- Added useEffect hook on component mount:
  - Calls `BehaviorTracker.trackJobView(job.id)` when job details page loads
- Updated handleApplyClick:
  - Calls `BehaviorTracker.trackJobApply(job.id)` before opening apply modal
- Updated handleSaveClick:
  - Calls `BehaviorTracker.trackJobSave(job.id)` only if saving (not unsaving)

### Updated: `pages/CreateJobPage.tsx`
**Changes:**
- Added import: `import { BehaviorTracker } from '../src/utils/behaviorTracking'`
- Updated Publish Job button click:
  - Generates temporary job ID: `job_${Date.now()}`
  - Calls `BehaviorTracker.trackJobPosted(tempJobId)` before publishing
  - Then calls onPublish()

### Updated: `components/dashboard/DashboardOverview.tsx`
**Changes:**
- Added `getPersonalizedMessage()` function that checks `user.behaviorProfile?.engagementLevel`:
  - `low`: "We noticed you've been less active. Check out some new job recommendations below!"
  - `high`: "You're on fire! Keep up the great momentum with your job search."
  - `medium`: "Ready to continue your job search journey?"
- Updated welcome message to use personalized content based on engagement level
- Shows behavior-driven personalization to users

### Updated: `App.tsx`
**Changes:**
- Fixed import path: `import { useAuthStore } from './stores/useAuthStore'`
- Changed import from `fetchUser` to `initialize`
- Updated useEffect to call `initialize()` on app mount instead of conditional fetch
- Fixed handleOnboardingComplete to use `updateProfile()` instead of non-existent `setUser()`
- Initialize() now handles:
  - Restoring sessions from localStorage on page refresh
  - Auto-refreshing expired access tokens using refresh token
  - Validating user session on app startup

---

## 7. Backend API Specifications (Confirmed)

### Authentication Endpoints
- **POST** `/api/v1/auth/login` - Login with email/password
- **POST** `/api/v1/auth/register` - Register new account
- **GET** `/api/v1/auth/me` - Get current user profile
- **POST** `/api/v1/auth/logout` - Logout user
- **POST** `/api/v1/auth/refresh-token` - Refresh access token

### Behavior Tracking Endpoints
- **POST** `/api/v1/behavior/track` - Track user behavior events
- **GET** `/api/v1/behavior/profile` - Get user behavior profile

### Headers Required
All requests automatically include:
- `Content-Type: application/json`
- `Authorization: Bearer <accessToken>` (for authenticated endpoints)

### Token Refresh Strategy
- **Type:** Reactive (wait for 401, then refresh)
- **Access Token Lifetime:** 15 minutes
- **Refresh Token Lifetime:** 7 days
- **Automatic Retry:** On refresh, original request is automatically retried
- **Session Recovery:** On page refresh, refresh token is used to restore session

---

## 8. Error Handling

### Authentication Errors
- 401 Unauthorized → Automatic token refresh attempt
- If refresh fails → Redirect to login page
- Session cleared from localStorage

### Behavior Tracking Errors
- API failures logged to console only
- Never block user interaction
- Fail silently (console.warn)

### API Errors
- Network errors throw with descriptive messages
- Caught by components and displayed to user where appropriate
- Login/signup errors displayed in forms

---

## 9. Page Refresh / Session Recovery

**Flow on App Mount:**
1. App renders with `initialize()` in useEffect
2. Check localStorage for `refreshToken`
3. If exists:
   - Try to use stored `accessToken` + `user` data first (fastest)
   - If missing, call `refreshToken()` to get new access token
   - Then call `getCurrentUser()` to validate and refresh user data
4. Set appropriate authentication state
5. User is automatically logged back in without re-entering credentials

**Benefits:**
- Seamless user experience on page refresh
- Automatic token rotation via refresh token
- User stays logged in across sessions
- Refresh token expires in 7 days

---

## 10. Security Measures Implemented

1. **Token Storage:**
   - Refresh tokens stored in localStorage (for page refresh recovery)
   - Access tokens stored in localStorage
   - Sensitive data: tokens only sent over HTTPS

2. **Request Interceptor:**
   - All requests include Authorization header
   - Token automatically added by httpClient
   - Invalid tokens trigger re-authentication

3. **Logout:**
   - Tokens cleared from localStorage
   - API logout endpoint called (best effort)
   - User redirected to login

4. **Automatic Refresh:**
   - Access token expires in 15 minutes
   - Refresh token lasts 7 days
   - Automatic refresh on any 401 response

---

## 11. Testing Checklist

- [ ] User can login with valid credentials
- [ ] User stays logged in after page refresh
- [ ] Session expires after 7 days of inactivity
- [ ] Access token refreshes automatically on 401
- [ ] Job views are tracked when viewing job details
- [ ] Job applies are tracked when applying
- [ ] Job saves are tracked when saving
- [ ] Job posts are tracked when publishing
- [ ] Time spent is tracked periodically
- [ ] Behavior profile affects dashboard personalization
- [ ] User can logout successfully
- [ ] UI shows correct engagement level message
- [ ] Errors fail silently for behavior tracking
- [ ] CORS works correctly for localhost:5173

---

## 12. File Summary

**New Files (3):**
- `src/api/httpClient.ts` - HTTP interceptor with token refresh
- `src/api/behaviorApi.ts` - Behavior tracking API client
- `src/utils/behaviorTracking.ts` - Behavior tracker utility

**Modified Files (8):**
- `src/api/authApi.ts` - Replaced mock with real backend
- `stores/useAuthStore.ts` - Complete rewrite with real API
- `types.ts` - Added BehaviorProfile interface
- `App.tsx` - Initialize auth on mount, fix imports
- `components/JobCard.tsx` - Track job views
- `pages/JobDetailsPage.tsx` - Track views, applies, saves
- `pages/CreateJobPage.tsx` - Track job posting
- `components/dashboard/DashboardOverview.tsx` - Use behavior data

**Total Lines Changed:** ~400+ lines of new/modified code

---

## 13. Next Steps (Post-Implementation)

1. Test with real backend server
2. Monitor token refresh behavior
3. Verify behavior tracking accuracy
4. Test session recovery on page refresh
5. Validate CORS configuration
6. Test on different devices/browsers
7. Monitor performance with behavior tracking
8. Consider adding analytics dashboard
9. Add time spent tracking on page unload
10. Consider privacy controls for behavior tracking

---

## 14. Architecture Diagram

```
User Interaction
      ↓
Components (JobCard, JobDetails, CreateJob, Dashboard)
      ↓
BehaviorTracker (utility)
      ↓
behaviorApi (track/profile)
      ↓
httpClient (with interceptor)
      ↓
Backend (/api/v1/behavior/*, /api/v1/auth/*)

Auth Flow:
Login/Signup → authApi → httpClient → Backend
      ↓
Store tokens in localStorage
      ↓
Initialize on App Mount
      ↓
Check refreshToken exists
      ↓
Restore session or redirect to login

401 Response:
httpClient detects 401
      ↓
Call refreshToken endpoint
      ↓
Update tokens in localStorage
      ↓
Retry original request
      ↓
Return response
```

---

## 15. Environment Setup

**Required Backend Endpoints:**
```
Base URL: /api/v1/
CORS enabled for: localhost:5173
```

**Browser Storage:**
- localStorage: accessToken, refreshToken, user (JSON)
- sessionStorage: (optional for temporary data)

---

## Summary

This implementation provides:
✅ Real backend API integration  
✅ Automatic token refresh on 401  
✅ Session recovery on page refresh  
✅ Behavior tracking with Authorization header  
✅ Type-safe API clients  
✅ Zustand state management  
✅ Error handling and logging  
✅ Behavior-based personalization  
✅ Security best practices  
✅ Zero breaking changes to existing UI  

All changes maintain backward compatibility with existing components while adding real backend integration.
