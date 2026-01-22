# ⚡ Quick Reference: RBAC + Behavior System

## TL;DR

**You don't have to choose between RBAC and behavior-based personalization.**

- **RBAC (Role-Based Access Control)** = WHO gets which dashboard
- **Behavior-Based Personalization** = WHAT content they see in that dashboard

They work together, not instead of each other.

---

## The Three Minutes Version

### Current State ✓
```
User registers → Gets assigned role → Sent to role dashboard
```

### Target State ⭐
```
User registers → Gets assigned role → Sent to role dashboard
                                              ↓
                              Show different content based on
                              their behavior (views, applies, saves)
```

**That's literally it.** You're not replacing RBAC. You're adding a personalization layer on top.

---

## Visual Comparison

### RBAC (You already have this)
```
if (user.userType === 'job_seeker') show <JobSeekerDashboard />
if (user.userType === 'employer') show <EmployerDashboard />
if (user.userType === 'admin') show <AdminDashboard />
```

### Behavior (Add this inside)
```
<JobSeekerDashboard>
  {user.behaviorProfile?.appliedJobs === 0 && <Onboarding />}
  {user.behaviorProfile?.engagementLevel === 'high' && <Promotion />}
  {user.behaviorProfile?.timeSpent > 100 && <AssessmentSuggestion />}
</JobSeekerDashboard>
```

---

## What Changes

### Minimal Changes ✅
- Add 2 fields to User type (behaviorProfile, preferences)
- Create 1 utility file (BehaviorTracker)
- Add conditional rendering to existing components
- Track 3-4 events when users interact

### What Stays the Same ✓
- Dashboard routing by role
- Job seeker/employer/admin separation
- Authentication flow
- Authorization checks
- Core features per role

---

## File Changes Needed

```
types.ts
├─ Add BehaviorProfile interface
├─ Add UserPreferences interface
└─ Add to User interface

stores/useAuthStore.ts
├─ Add updateBehaviorProfile()
└─ Add updatePreferences()

NEW: src/utils/behaviorTracking.ts
├─ trackJobView()
├─ trackJobApply()
├─ trackJobSave()
└─ trackJobPosted()

components/dashboard/DashboardOverview.tsx
├─ Add renderRecommendedJobs() with behavior logic
├─ Add renderMotivationalContent()
├─ Add renderSkillAssessmentPrompt()
└─ Add renderReferralPrompt()

src/services/emailService.ts
├─ getWelcomeTemplate(userType) 
└─ sendWelcomeEmail(user)
```

**Total: ~500 lines of code changes**

---

## Data Structure

### Current User
```typescript
{
  id: "user-123",
  email: "user@example.com",
  userType: "job_seeker"
}
```

### Enhanced User
```typescript
{
  id: "user-123",
  email: "user@example.com",
  userType: "job_seeker",  // ← RBAC (unchanged)
  
  behaviorProfile: {       // ← NEW
    viewedJobs: 45,
    appliedJobs: 8,
    savedJobs: 12,
    engagementLevel: "medium",
    lastActiveAt: "2026-01-22T10:30:00Z"
  },
  
  preferences: {           // ← NEW
    dashboardLayout: "default",
    recommendationFrequency: "daily",
    emailNotifications: true
  }
}
```

---

## Events to Track

```typescript
// In BehaviorTracker:
BehaviorTracker.trackJobView(userId, jobId)       // Job seeker browsing
BehaviorTracker.trackJobApply(userId, jobId)      // Job seeker applying
BehaviorTracker.trackJobSave(userId, jobId)       // Job seeker saving
BehaviorTracker.trackJobPosted(userId, jobId)     // Employer posting
BehaviorTracker.trackTimeSpent(userId, minutes)   // General engagement
```

---

## Personalization Rules

### For Job Seekers

```javascript
// New users (viewedJobs === 0)
→ Show onboarding / trending jobs

// Low engagement (appliedJobs < 2)
→ Show motivational banner

// Medium engagement (appliedJobs: 2-5)
→ Show job recommendations

// High engagement (appliedJobs > 5)
→ Show skill assessments + referrals

// Time spent tracking
→ Suggest breaks after 2+ hours
```

### For Employers

```javascript
// New employers (postedJobs === 0)
→ Show "post first job" onboarding

// 1-3 jobs posted
→ Show basic analytics

// 3+ jobs posted
→ Show advanced analytics + team features

// High engagement
→ Show premium features
```

---

## Example: Before & After Component

### Before (Static for all users)
```tsx
const DashboardOverview = ({ user }) => {
  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <RecommendedJobs />
      <SkillAssessments />
      <Referrals />
    </div>
  );
};
// Every job seeker sees the same thing
```

### After (Personalized by behavior)
```tsx
const DashboardOverview = ({ user }) => {
  const { behaviorProfile } = user;

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      
      {/* Only show onboarding if new */}
      {behaviorProfile?.viewedJobs === 0 && (
        <OnboardingBanner />
      )}
      
      {/* Recommend based on activity */}
      {behaviorProfile?.appliedJobs > 0 && (
        <AIRecommendedJobs />
      )}
      
      {/* Suggest assessments if they've applied a lot */}
      {behaviorProfile?.appliedJobs > 5 && (
        <SkillAssessmentSuggestion />
      )}
      
      {/* Show referrals for power users */}
      {behaviorProfile?.engagementLevel === 'high' && (
        <ReferralProgram />
      )}
    </div>
  );
};
// Each user sees different content based on their behavior
```

---

## Implementation Order

1. **Day 1-2:** Update types (add BehaviorProfile to User)
2. **Day 3:** Create BehaviorTracker utility
3. **Day 4:** Update email service with role-specific templates
4. **Day 5-6:** Update dashboard components with conditional rendering
5. **Day 7:** Backend changes (behavior events table, aggregation)
6. **Day 8-9:** End-to-end testing
7. **Day 10:** Deploy

---

## Common Questions

**Q: This is just showing/hiding things. Is that enough?**
A: Yes! That's personalization. LinkedIn does the same - same dashboard structure, different content based on behavior.

**Q: Do I need separate dashboards?**
A: No. Keep your current separate dashboards per role. Add behavior-based content INSIDE each one.

**Q: What if behavior data is wrong?**
A: It's just for UX. Core access control is still role-based. If behavior is wrong, user just sees suboptimal content, not loses access.

**Q: How do I know which behavior matters?**
A: Start simple:
- viewedJobs > 0 = "they looked"
- appliedJobs > 0 = "they tried"
- appliedJobs > 5 = "they're serious"

Expand later based on metrics.

**Q: Does this require backend changes?**
A: Yes, but minimal:
- Add behavior_events table
- Add /api/behavior/track endpoint
- Add daily aggregation job
- That's it.

---

## LinkedIn Model Applied to Your System

```
LinkedIn                          Your JobHub
─────────────────────────────────────────────────────
Role: Candidate                   Role: job_seeker
├─ Can search jobs                ├─ Can search jobs
├─ Can apply                      ├─ Can apply
└─ Can message recruiters         └─ Can message employers
                                  
Behavior: Viewed 100+ jobs        Behavior: viewed 100+ jobs
├─ Shows AI recommendations       ├─ Shows AI recommendations
├─ Suggests skills to learn       ├─ Suggests skill assessments
└─ Enables premium features       └─ Shows referral program

Role: Recruiter                   Role: employer
├─ Can post jobs                  ├─ Can post jobs
├─ Can review apps                ├─ Can review apps
└─ Can manage team                └─ Can manage team

Behavior: Posted 5+ jobs          Behavior: Posted 5+ jobs
├─ Shows advanced analytics       ├─ Shows advanced analytics
├─ Suggests sourcing tools        ├─ Suggests premium features
└─ Enables campaigns              └─ Enables team invites
```

**Same principle: Role determines access, behavior determines experience.**

---

## Success Criteria

✅ Users sign up → get role → see role dashboard → see behavior-personalized content
✅ Each role has different dashboards (job seeker ≠ employer)
✅ Users in same role see different content based on activity
✅ Behavior doesn't override role (permissions still work)
✅ Backend validates all operations (don't trust frontend)
✅ Welcome emails are role-specific
✅ Onboarding is role-specific

---

## Code Templates

### Track an event
```typescript
import { BehaviorTracker } from '../utils/behaviorTracking';

const handleViewJob = (jobId: string) => {
  BehaviorTracker.trackJobView(user.id, jobId);
  // Show job details
};
```

### Personalize content
```typescript
{user.behaviorProfile?.appliedJobs === 0 ? (
  <OnboardingContent />
) : user.behaviorProfile?.engagementLevel === 'high' ? (
  <AdvancedContent />
) : (
  <StandardContent />
)}
```

### Update behavior
```typescript
const { updateBehaviorProfile } = useAuthStore();

updateBehaviorProfile({
  appliedJobs: currentProfile.appliedJobs + 1
});
```

---

## Bottom Line

**You already have role-based dashboards. Just add smart content inside them.**

```
Current: All job seekers see the same dashboard
Target: Same dashboard structure, different content for each job seeker

= Simple, effective, scalable personalization
```

Done! 🎉
