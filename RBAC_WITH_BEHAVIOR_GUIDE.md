# Role-Based Access Control + Behavior-Based Personalization Guide

## Problem Statement
You want to implement a LinkedIn-like behavior-based system while keeping your role-based dashboard structure. Here's why both can coexist.

---

## Architecture: Hybrid Approach

### Layer 1: PRIMARY - Role-Based Access Control (RBAC)
**Purpose**: Determines WHO gets access to WHAT features

```
┌─────────────────┐
│  User Signup    │
└────────┬────────┘
         │
         ├─→ Role Assignment
         │   ├─ job_seeker
         │   ├─ employer
         │   └─ admin
         │
         └─→ Welcome Email (role-specific template)
             │
             └─→ Onboarding (role-specific flow)
                 │
                 └─→ Dashboard (role-specific layout)
                     ├─ JobSeekerDashboard
                     ├─ EmployerDashboard
                     └─ AdminDashboard
```

**Why keep it:**
- Job seekers need job search, applications, networking
- Employers need posting, applicant tracking, team management
- Admins need moderation, user management, analytics
- These are fundamentally different use cases

---

### Layer 2: SECONDARY - Behavior-Based Personalization
**Purpose**: What CONTENT to show within the allowed dashboard

```
SAME Dashboard Layout
        │
        ├─→ View/Apply/Save behavior → Show AI recommendations
        ├─→ High engagement → Show premium features
        ├─→ Low activity → Show motivational content
        └─→ Time spent → Suggest breaks (UX improvement)
```

**Why add it:**
- Personalize job recommendations based on viewing patterns
- Show relevant skill assessments based on job interests
- Suggest career paths based on application behavior
- Drive engagement through smart content sequencing

---

## Current State vs. Target State

### Current ✓
```typescript
User {
  id: string;
  email: string;
  userType: 'job_seeker' | 'employer' | 'admin';  // RBAC
  // ...
}

// Dashboard routing (CORRECT)
if (userType === 'job_seeker') render <JobSeekerDashboard />
if (userType === 'employer') render <EmployerDashboard />
if (userType === 'admin') render <AdminDashboard />
```

### Target (Add these fields) ⭐
```typescript
User {
  // ... existing fields
  
  // NEW: Behavior tracking
  behaviorProfile?: {
    // For job seekers
    viewedJobs: number;
    appliedJobs: number;
    savedJobs: number;
    
    // For employers
    postedJobs: number;
    shortlistedCandidates: number;
    
    // General
    timeSpentOnPlatform: number; // minutes
    lastActiveCategories: string[];
    engagementLevel: 'low' | 'medium' | 'high';
    lastActiveAt: string;
  };
  
  // NEW: User preferences
  preferences?: {
    dashboardLayout: 'default' | 'compact';
    recommendationFrequency: 'daily' | 'weekly' | 'none';
    emailNotifications: boolean;
  };
}
```

---

## Implementation Guide

### Step 1: Update Types

**File**: `types.ts`

```typescript
export interface BehaviorProfile {
  viewedJobs: number;
  appliedJobs: number;
  savedJobs: number;
  postedJobs: number;
  timeSpentOnPlatform: number;
  lastActiveCategories: string[];
  engagementLevel: 'low' | 'medium' | 'high';
  lastActiveAt: string;
}

export interface UserPreferences {
  dashboardLayout: 'default' | 'compact';
  recommendationFrequency: 'daily' | 'weekly' | 'none';
  emailNotifications: boolean;
}

export interface User {
  // ... existing fields stay the same
  userType: 'new_user' | 'job_seeker' | 'employer' | 'admin';
  
  // NEW ADDITIONS
  behaviorProfile?: BehaviorProfile;
  preferences?: UserPreferences;
}
```

### Step 2: Update Authentication Response

**File**: `src/api/authApi.ts` (or your login handler)

```typescript
// When user completes registration/login
export interface AuthResponse {
  user: User & {
    behaviorProfile: BehaviorProfile;
    preferences: UserPreferences;
  };
  accessToken: string;
  expiresIn: number;
}

// Example welcome email service
export async function sendWelcomeEmail(user: User): Promise<void> {
  const emailTemplate = getEmailTemplate(user.userType);
  // role-specific template loaded based on userType
  await emailService.send({
    to: user.email,
    subject: emailTemplate.subject,
    html: emailTemplate.body(user),
    // Role-specific onboarding link
    ctaLink: `${appUrl}/onboarding/${user.userType}`
  });
}
```

### Step 3: Track Behavior Events

**File**: `src/utils/behaviorTracking.ts` (NEW)

```typescript
export class BehaviorTracker {
  static trackJobView(userId: string, jobId: string) {
    fetch('/api/behavior/track', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        event: 'job_viewed',
        jobId,
        timestamp: new Date().toISOString()
      })
    });
  }

  static trackJobApply(userId: string, jobId: string) {
    fetch('/api/behavior/track', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        event: 'job_applied',
        jobId,
        timestamp: new Date().toISOString()
      })
    });
  }

  static trackJobSave(userId: string, jobId: string) {
    fetch('/api/behavior/track', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        event: 'job_saved',
        jobId,
        timestamp: new Date().toISOString()
      })
    });
  }
}
```

### Step 4: Update Dashboard Components

**Pattern**: Dashboard stays same, but personalize CONTENT

```typescript
// File: components/dashboard/DashboardOverview.tsx

export const DashboardOverview: React.FC<Props> = ({ user, ... }) => {
  // STEP 1: Dashboard layout is still role-determined (RBAC)
  // This component only renders for job_seeker role users
  
  // STEP 2: Personalize CONTENT based on behavior
  
  const renderRecommendedJobs = () => {
    // Show AI recommendations if user has been active
    if (user.behaviorProfile?.engagementLevel === 'high') {
      return <AIRecommendedJobs />;
    }
    
    // Show trending jobs if new user
    if (user.userType === 'new_user') {
      return <TrendingJobs />;
    }
    
    // Show relevant jobs based on application history
    return <RecommendedJobsByCategory />;
  };

  return (
    <div className="dashboard">
      <div className="recommendations">
        {renderRecommendedJobs()}
      </div>
      
      {user.behaviorProfile?.engagementLevel === 'low' && (
        <MotivationalBanner />
      )}
      
      {user.behaviorProfile?.appliedJobs > 5 && (
        <SkillAssessmentSuggestion />
      )}
    </div>
  );
};
```

### Step 5: Email Onboarding Flow

**Sequence:**
```
1. User Signup
   ├─ Email: "Welcome to JobHub! Complete your profile"
   ├─ Include role-specific onboarding link
   └─ Link: /onboarding/job_seeker (or /employer, /admin)
   
2. Onboarding Page (Role-specific)
   ├─ For job_seeker: "Build your profile, upload resume"
   ├─ For employer: "Create company profile, post first job"
   └─ For admin: "Set up preferences, review pending items"
   
3. Complete Onboarding
   ├─ Redirect to role-specific dashboard
   └─ Start tracking behavior
```

---

## Why This Works (LinkedIn Model)

LinkedIn does exactly this:

| Aspect | LinkedIn | Your JobHub |
|--------|----------|-----------|
| **RBAC** | User type (job seeker, recruiter, admin) | ✓ userType field |
| **Dashboard** | Different for recruiters vs candidates | ✓ JobSeekerDashboard vs EmployerDashboard |
| **Behavior** | Tracks views, applies, saves | → Add behaviorProfile |
| **Personalization** | Recommendations based on behavior | → Show inside existing dashboard |

LinkedIn DOESN'T show recruiters a job seeker dashboard or vice versa. But it DOES personalize the content within each role's dashboard.

---

## FAQ

### Q: Won't this duplicate effort?
**A:** No. You keep your current role-based routing (which is correct). You just add fields to User and track behavior events.

### Q: What if behavior contradicts role?
**A:** It doesn't. Role is primary (who gets access). Behavior is secondary (what they see inside). Example:
- A job seeker role always sees job search features
- But IF they haven't applied to anything, you show onboarding content
- IF they applied to 100 jobs, you show assessment suggestions

### Q: Do I need to change my authentication?
**A:** Only add new fields to the User object. The login flow stays the same. You send back user WITH behaviorProfile populated (initially zeros).

### Q: How do I handle this at the backend?
**A:** Same three tables:
- `users` - core user data
- `user_behavior` - tracks events (can be aggregated daily)
- `user_preferences` - stores preferences

Query pattern:
```sql
SELECT u.*, ub.viewed_jobs, ub.applied_jobs, up.recommendation_frequency
FROM users u
LEFT JOIN user_behavior ub ON u.id = ub.user_id
LEFT JOIN user_preferences up ON u.id = up.user_id
WHERE u.id = ?
```

---

## Summary

| Keep ✓ | Add ⭐ |
|--------|------|
| Role-based dashboard routing | BehaviorProfile tracking |
| Separate dashboards per role | Personalized content within dashboards |
| Welcome emails with role links | Event tracking for views/applies/saves |
| Job seeker/employer/admin features | Engagement level calculation |
| | User preferences storage |

**Your confusion was thinking you had to REPLACE RBAC with behavior. You don't. You ENHANCE it.**

Start with:
1. Add BehaviorProfile and UserPreferences to types
2. Populate them at signup (zeros)
3. Track events when users interact
4. Show conditional content inside dashboards based on behavior

This gives you the best of both worlds!
