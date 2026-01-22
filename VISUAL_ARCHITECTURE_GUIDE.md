# Visual Architecture: RBAC + Behavior System

## 🎯 The Core Insight

You have been confusing **WHAT** the user can do with **WHICH** features they see.

```
┌────────────────────────────────────────────────────────────┐
│                    ROLE-BASED ACCESS (RBAC)                │
│                      (PRIMARY LAYER)                       │
│                                                            │
│  Determines: "Who gets what features?"                    │
│  Implemented via: User.userType                           │
│                                                            │
│  Job Seeker Dashboard    Employer Dashboard   Admin       │
│  ├─ Job Search           ├─ Post Jobs        ├─ Users    │
│  ├─ Applications         ├─ Manage Apps      ├─ Moderate │
│  ├─ Saved Jobs           ├─ View Team        ├─ Analytics│
│  ├─ Networking           └─ Billing          └─ Settings │
│  └─ Messaging                                             │
└────────────────────────────────────────────────────────────┘
                              ↓
                    (Same Role, Different Days)
                              ↓
┌────────────────────────────────────────────────────────────┐
│              BEHAVIOR-BASED PERSONALIZATION                │
│                    (SECONDARY LAYER)                       │
│                                                            │
│  Determines: "What content should they see?"              │
│  Implemented via: User.behaviorProfile                    │
│                                                            │
│  Day 1: NEW user           Day 30: ACTIVE user            │
│  ├─ Show onboarding        ├─ Show AI recommendations     │
│  ├─ Show trending jobs     ├─ Show advanced features      │
│  └─ No advanced features   └─ Show referral program       │
│                                                            │
│  Inside SAME dashboard, but different content!            │
└────────────────────────────────────────────────────────────┘
```

---

## Architecture Layers

### Layer 1: Authentication & Authorization (RBAC)
```
┌─────────────────────────────────────────────────────────┐
│ Authentication: "Is this user who they claim to be?"    │
│ Implementation: Login with email/password or OAuth      │
│ Result: Access token + User object                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Authorization (RBAC): "What can they access?"           │
│ Implementation: Check user.userType                     │
│ Result: Route to appropriate dashboard                  │
│                                                         │
│ if (user.userType === 'job_seeker') {                   │
│   return <JobSeekerDashboard />  // ← FIXED             │
│ } else if (user.userType === 'employer') {              │
│   return <EmployerDashboard />   // ← FIXED             │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ Personalization (Behavior): "What should they see?"     │
│ Implementation: Check user.behaviorProfile              │
│ Result: Conditional content rendering inside dashboard │
│                                                         │
│ if (behavior.engagementLevel === 'low') {               │
│   return <MotivationalBanner />  // ← SHOWN CONDITIONALLY│
│ }                                                       │
│ if (behavior.appliedJobs > 5) {                         │
│   return <SkillAssessmentPromo />  // ← SHOWN CONDITIONALLY │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## User Journey: Side by Side Comparison

### CURRENT (Static)
```
User Signup → Welcome Email → Dashboard → Same content for all

Problem: All job seekers see the same thing regardless of activity
```

### DESIRED (Hybrid RBAC + Behavior)
```
┌─────────────────────────────────────────────────────────┐
│ USER A: DAY 1 (Just signed up)                          │
├─────────────────────────────────────────────────────────┤
│ Role: job_seeker (RBAC)                                 │
│ Behavior: viewedJobs: 0, appliedJobs: 0, level: low    │
│                                                         │
│ Dashboard shows:                                        │
│ • Welcome message                                       │
│ • "Complete your profile" CTA                          │
│ • Trending jobs to explore                             │
│ • No assessments yet (not engaged enough)              │
│                                                         │
│ Content: Onboarding-focused                            │
└─────────────────────────────────────────────────────────┘

                    (User actively uses for 30 days)

┌─────────────────────────────────────────────────────────┐
│ USER A: DAY 30 (Same role, different behavior)          │
├─────────────────────────────────────────────────────────┤
│ Role: job_seeker (RBAC) ← SAME                          │
│ Behavior: viewedJobs: 150, appliedJobs: 15, level: high│
│                                                         │
│ Dashboard shows:                                        │
│ • "AI-Recommended jobs" (based on applied patterns)    │
│ • "Complete a skill assessment to stand out"           │
│ • "Referral program - earn by bringing friends"        │
│ • Interview prep suggestions                           │
│                                                         │
│ Content: Advancement-focused                           │
└─────────────────────────────────────────────────────────┘

Both have SAME role dashboard layout,
but DIFFERENT content based on behavior!
```

---

## Data Model

### Before (Static)
```typescript
User {
  id: string;
  email: string;
  userType: 'job_seeker' | 'employer' | 'admin';
  // That's it!
}

// All job seekers treated the same
```

### After (Dynamic)
```typescript
User {
  id: string;
  email: string;
  
  // ✓ RBAC - Stays the same
  userType: 'job_seeker' | 'employer' | 'admin';
  
  // ⭐ NEW - Behavior tracking
  behaviorProfile: {
    // What they've done (job seeker specific)
    viewedJobs: 150,
    appliedJobs: 15,
    savedJobs: 42,
    
    // What they've done (employer specific)
    postedJobs: 3,
    shortlistedCandidates: 27,
    
    // General behavior
    timeSpentOnPlatform: 2340, // minutes
    lastActiveCategories: ['Software Engineering', 'Product Management'],
    engagementLevel: 'high', // Calculated from above
    lastActiveAt: '2026-01-22T10:30:00Z'
  };
  
  // ⭐ NEW - User preferences
  preferences: {
    dashboardLayout: 'default',
    recommendationFrequency: 'daily',
    emailNotifications: true
  };
}
```

---

## How LinkedIn Does It

LinkedIn's model:

```
┌────────────────────────────────────┐
│ ROLE (What you can do)             │
├────────────────────────────────────┤
│ • Job Seeker Role:                 │
│   - Search jobs                    │
│   - Apply                          │
│   - Connect with recruiters        │
│                                    │
│ • Recruiter Role:                  │
│   - Post jobs                      │
│   - Review applications            │
│   - Messaging                      │
│                                    │
│ → DIFFERENT DASHBOARDS             │
│ → DIFFERENT FEATURES               │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ BEHAVIOR (How the page looks)      │
├────────────────────────────────────┤
│ • Shows recommended jobs based on: │
│   - Jobs you've viewed             │
│   - Jobs you've saved              │
│   - Similar users' activity        │
│                                    │
│ • Shows notifications based on:    │
│   - Your search preferences        │
│   - Your engagement level          │
│   - Your past interactions         │
│                                    │
│ → SAME DASHBOARD                   │
│ → DIFFERENT CONTENT                │
└────────────────────────────────────┘
```

**Key point:** LinkedIn doesn't show recruiters job search or job seekers posting jobs. That's RBAC. But among job seekers, different people see different content. That's behavior-based personalization.

---

## Implementation Timeline

### Week 1: Foundation
```
Day 1-2: Update types.ts
├─ Add BehaviorProfile interface
├─ Add UserPreferences interface
└─ Update User interface

Day 3-4: Update auth store
├─ Add updateBehaviorProfile action
├─ Add updatePreferences action
└─ Persist to localStorage

Day 5: Create BehaviorTracker utility
├─ trackJobView()
├─ trackJobApply()
├─ trackJobSave()
└─ Send to backend endpoint
```

### Week 2: Integration
```
Day 6-8: Update email service
├─ Create role-specific templates
├─ Send welcome emails
└─ Include onboarding links

Day 9: Update dashboard components
├─ Add conditional rendering for behavior
├─ Show different content for new vs active users
└─ Add motivational banners
```

### Week 3: Backend
```
Day 10-12: Backend changes
├─ Create behavior_events table
├─ Create daily aggregation job
├─ Create /api/behavior/track endpoint
└─ Update /api/auth/me response

Day 13-14: Testing & refinement
├─ Test full flow
├─ Verify behavior tracking
└─ Verify personalization
```

---

## Query Pattern

### Frontend: Display Component
```typescript
// This doesn't change based on behavior
if (user.userType !== 'job_seeker') {
  return <NotAuthorized />;  // RBAC
}

// This changes based on behavior
if (user.behaviorProfile?.appliedJobs === 0) {
  return <OnboardingContent />;  // First time
}

if (user.behaviorProfile?.engagementLevel === 'high') {
  return <AdvancedContent />;  // Power user
}

return <StandardContent />;  // Regular user
```

### Backend: Behavior Aggregation
```sql
-- Daily job: aggregate behavior events
INSERT INTO user_behavior (user_id, viewed_jobs, applied_jobs, engagement_level)
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE event = 'job_viewed') as viewed_jobs,
  COUNT(*) FILTER (WHERE event = 'job_applied') as applied_jobs,
  CASE 
    WHEN COUNT(*) > 50 THEN 'high'
    WHEN COUNT(*) > 10 THEN 'medium'
    ELSE 'low'
  END as engagement_level
FROM behavior_events
WHERE DATE(timestamp) = TODAY()
GROUP BY user_id
```

---

## Common Concerns Addressed

### Q1: "Won't I lose track of features?"
**A:** No, because:
- RBAC (role) determines WHICH features exist
- Behavior only determines WHEN/HOW they're shown
- Each role still has all its core features

### Q2: "What if behavior is wrong?"
**A:** 
- Behavior is only for UX suggestions
- All core permissions still based on role
- Manual override available via preferences panel
- Backend validates all operations anyway

### Q3: "Do I need to change authentication?"
**A:**
- No, authentication stays the same
- Just add new fields to User object
- Initialize behaviorProfile with zeros at signup

### Q4: "What's the MVP?"
**A:**
- Add BehaviorProfile to User type
- Initialize with zeros at signup
- Track 2-3 key events (view, apply, save)
- Show/hide 2-3 UI elements based on behavior
- That's it! Everything else is refinement

---

## Summary Table

| Aspect | RBAC | Behavior | Example |
|--------|------|----------|---------|
| **Determines** | WHO can access | WHAT they see | Role=job_seeker gets job search. Behavior=inactive gets onboarding content. |
| **Stored in** | user.userType | user.behaviorProfile | "employer" vs {viewedJobs: 100} |
| **Checked at** | Route rendering | Component rendering | App.tsx routes, Dashboard personalizes |
| **Can override** | No (security) | Yes (preferences) | User can disable recommendations |
| **Changes** | Never after signup | Constantly | Dashboard looks different each day |
| **LinkedIn equivalent** | Candidate vs Recruiter | Job recommendations | Same recruiter sees different recommended candidates based on past searches |

---

## Next Steps

1. **Read RBAC_WITH_BEHAVIOR_GUIDE.md** - Full architecture explanation
2. **Review IMPLEMENTATION_CODE_EXAMPLES.ts** - Copy-paste ready code
3. **Update types.ts** - Add BehaviorProfile and UserPreferences
4. **Update auth store** - Add behavior update actions
5. **Create BehaviorTracker** - Event tracking utility
6. **Update dashboard components** - Add conditional rendering
7. **Test end-to-end** - Registration → email → onboarding → dashboard

You've got this! The key insight is: **role determines access, behavior determines presentation.** They work together perfectly.
