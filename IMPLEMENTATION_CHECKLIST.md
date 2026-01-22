# Implementation Checklist: RBAC + Behavior System

## Phase 1: Type System & Foundation (2 hours)

- [ ] **Update `types.ts`**
  - [ ] Create `BehaviorProfile` interface with fields:
    - `viewedJobs: number`
    - `appliedJobs: number`
    - `savedJobs: number`
    - `postedJobs: number`
    - `timeSpentOnPlatform: number`
    - `lastActiveCategories: string[]`
    - `engagementLevel: 'low' | 'medium' | 'high'`
    - `lastActiveAt: string`
  - [ ] Create `UserPreferences` interface with fields:
    - `dashboardLayout: 'default' | 'compact'`
    - `recommendationFrequency: 'daily' | 'weekly' | 'none'`
    - `emailNotifications: boolean`
  - [ ] Add to existing `User` interface:
    - `behaviorProfile?: BehaviorProfile`
    - `preferences?: UserPreferences`

- [ ] **Create `src/utils/behaviorTracking.ts`**
  - [ ] Create `BehaviorEvent` interface
  - [ ] Create `BehaviorTracker` class with methods:
    - [ ] `trackJobView(userId, jobId)`
    - [ ] `trackJobApply(userId, jobId)`
    - [ ] `trackJobSave(userId, jobId)`
    - [ ] `trackJobPosted(userId, jobId)`
    - [ ] `trackTimeSpent(userId, minutes)`
    - [ ] `private sendEvent(event)` - fires to `/api/behavior/track`

- [ ] **Verify compilation**
  ```bash
  npm run build
  # Should have 0 errors
  ```

---

## Phase 2: Authentication & Store Updates (2 hours)

- [ ] **Update `stores/useAuthStore.ts`**
  - [ ] Add `updateBehaviorProfile` action:
    ```typescript
    updateBehaviorProfile: (updates: Partial<BehaviorProfile>) => void
    ```
  - [ ] Add `updatePreferences` action:
    ```typescript
    updatePreferences: (updates: Partial<UserPreferences>) => void
    ```
  - [ ] Ensure behavior persists to localStorage
  - [ ] Initialize new users with `behaviorProfile: { viewedJobs: 0, ... }`

- [ ] **Test store updates**
  - [ ] Login as job seeker
  - [ ] Call `updateBehaviorProfile({ appliedJobs: 1 })`
  - [ ] Verify localStorage updated
  - [ ] Refresh page
  - [ ] Verify behavior persisted

---

## Phase 3: Email Service (1 hour)

- [ ] **Create/Update `src/services/emailService.ts`**
  - [ ] Create `EmailTemplate` interface
  - [ ] Create `getWelcomeTemplate(userType)` returning role-specific templates:
    - [ ] Job Seeker template: "Complete your profile, upload resume"
    - [ ] Employer template: "Post your first job"
    - [ ] Admin template: "Review pending items"
  - [ ] Create `sendWelcomeEmail(user)` function
  - [ ] Include role-specific onboarding link in email

- [ ] **Test email templates**
  - [ ] Log the email template for each role
  - [ ] Verify onboarding links are correct format: `/onboarding/{userType}`

---

## Phase 4: Dashboard Personalization (3 hours)

- [ ] **Update `components/dashboard/DashboardOverview.tsx`**
  - [ ] Add `renderRecommendedJobs()` function:
    - [ ] If `viewedJobs === 0`: show onboarding + trending jobs
    - [ ] Else if `engagementLevel === 'high'`: show AI recommendations
    - [ ] Else if `lastActiveCategories.length > 0`: show category-relevant jobs
    - [ ] Else: show trending jobs
  
  - [ ] Add `renderMotivationalContent()` function:
    - [ ] If `engagementLevel === 'low'` and `viewedJobs === 0`: show motivational banner
    - [ ] Return null otherwise
  
  - [ ] Add `renderSkillAssessmentPrompt()` function:
    - [ ] If `appliedJobs > 3` and no completed assessments: show banner
    - [ ] Return null otherwise
  
  - [ ] Add `renderReferralPrompt()` function:
    - [ ] If `engagementLevel === 'high'` and `appliedJobs > 10`: show referral CTA
    - [ ] Return null otherwise

- [ ] **Update Job Search/View Components**
  - [ ] When user views a job:
    ```typescript
    BehaviorTracker.trackJobView(user.id, job.id);
    ```
  - [ ] When user applies:
    ```typescript
    BehaviorTracker.trackJobApply(user.id, job.id);
    ```
  - [ ] When user saves:
    ```typescript
    BehaviorTracker.trackJobSave(user.id, job.id);
    ```

- [ ] **Test dashboard personalization**
  - [ ] Login as new user (behavior: 0 views, 0 applies)
    - [ ] Verify onboarding content shows
  - [ ] Manually update behavior to: { appliedJobs: 8, engagementLevel: 'high' }
    - [ ] Verify AI recommendations show
  - [ ] Verify assessments prompt shows when applied > 3

---

## Phase 5: Onboarding Pages (2 hours)

- [ ] **Create/Update `pages/OnboardingPage.tsx`**
  - [ ] Accept `userType` prop
  - [ ] Show role-specific steps:
    - [ ] Job Seeker: Profile → Resume → Preferences
    - [ ] Employer: Company Info → Team → First Job
    - [ ] Admin: Admin Preferences → Notifications
  - [ ] Show progress bar
  - [ ] Redirect to appropriate dashboard on completion

- [ ] **Update `App.tsx` routing**
  - [ ] After successful signup, show onboarding page
  - [ ] Pass `userType` to onboarding
  - [ ] After onboarding complete, go to role dashboard

---

## Phase 6: Employer Dashboard (1 hour)

- [ ] **Update `components/employer-dashboard/EmployerOverview.tsx`**
  - [ ] If `postedJobs === 0`: show "Post your first job" CTA
  - [ ] If `postedJobs > 0`: show analytics
  - [ ] If `engagementLevel === 'high'`: show advanced features

---

## Phase 7: Backend Integration (4 hours)

- [ ] **Create Backend Endpoint: `POST /api/behavior/track`**
  ```typescript
  {
    userId: string;
    event: 'job_viewed' | 'job_applied' | 'job_saved' | 'job_posted' | 'time_spent';
    jobId?: string;
    duration?: number;
    timestamp: string;
  }
  // Response: { success: true }
  ```

- [ ] **Create Database Tables**
  - [ ] `user_behavior` table (or aggregated daily):
    ```sql
    user_id | viewed_jobs | applied_jobs | saved_jobs | engagement_level | last_active_at
    ```
  - [ ] `behavior_events` table (raw events):
    ```sql
    user_id | event | job_id | timestamp
    ```

- [ ] **Create Daily Aggregation Job**
  - [ ] Query `behavior_events` table
  - [ ] Group by `user_id`
  - [ ] Calculate metrics:
    - `viewed_jobs`: count where event = 'job_viewed'
    - `applied_jobs`: count where event = 'job_applied'
    - `saved_jobs`: count where event = 'job_saved'
    - `engagement_level`: 'high' if events > 50, 'medium' if > 10, else 'low'
  - [ ] Update `user_behavior` table
  - [ ] Update `users.behavior_profile` JSON field

- [ ] **Update `/api/auth/me` Endpoint**
  - [ ] Include `behaviorProfile` in response
  - [ ] Include `preferences` in response

---

## Phase 8: End-to-End Testing (2 hours)

- [ ] **Complete User Journey - New User**
  - [ ] Sign up as new job seeker
  - [ ] Verify email received with onboarding link
  - [ ] Click email link → onboarding page
  - [ ] Complete onboarding
  - [ ] Redirected to job seeker dashboard
  - [ ] Dashboard shows onboarding content (not AI recommendations)
  - [ ] Behavior profile shows: viewedJobs: 0, appliedJobs: 0, level: low

- [ ] **Complete User Journey - Active User**
  - [ ] Login as active user
  - [ ] View 5+ jobs
  - [ ] Apply to 2+ jobs
  - [ ] Backend aggregates behavior (run daily job manually if needed)
  - [ ] Re-login (or wait for next fetch)
  - [ ] Dashboard shows personalized content (AI recommendations if high engagement)

- [ ] **Verify Role Separation**
  - [ ] Job seeker cannot see employer dashboard (RBAC)
  - [ ] Employer cannot see job seeker dashboard (RBAC)
  - [ ] Admin can see admin dashboard only (RBAC)
  - [ ] Roles are independent of behavior (behavior doesn't change roles)

- [ ] **Verify Behavior Doesn't Override Role**
  - [ ] Even if job seeker has high engagement, they still can't post jobs (role-based)
  - [ ] Employer can post regardless of their behavior level

---

## Phase 9: Browser Testing (1 hour)

- [ ] **Signup Flow**
  - [ ] Chrome (signup, verify behavior initializes to 0)
  - [ ] Firefox (same)
  - [ ] Safari (same)

- [ ] **Behavior Tracking**
  - [ ] Open DevTools → Network
  - [ ] View a job
  - [ ] Verify POST `/api/behavior/track` is called with event: 'job_viewed'
  - [ ] Apply to job
  - [ ] Verify POST with event: 'job_applied'

- [ ] **Personalization**
  - [ ] Open two browser windows: one as new user, one as active user
  - [ ] Compare dashboards
  - [ ] New user should show different content than active user

---

## Phase 10: Performance & Monitoring (1 hour)

- [ ] **Verify No Performance Issues**
  - [ ] Dashboard load time < 2s
  - [ ] Behavior tracking doesn't block UI (fire and forget)
  - [ ] No console errors

- [ ] **Add Monitoring**
  - [ ] Track behavior event failures (if /api/behavior/track fails)
  - [ ] Alert if > 1% of tracking requests fail
  - [ ] Monitor dashboard render time

---

## Phase 11: Documentation (30 minutes)

- [ ] **README Updates**
  - [ ] Document behavior tracking system
  - [ ] Document personalization rules
  - [ ] Document role vs behavior distinction

- [ ] **Code Comments**
  - [ ] Comment why behavior is secondary to RBAC
  - [ ] Comment conditional rendering logic

---

## Definition of Done

User Story: "As a job seeker, I should see personalized content based on my activity"

Acceptance Criteria:
- [ ] User signs up → sees onboarding content
- [ ] After viewing 10+ jobs → sees AI recommendations
- [ ] After applying to 5+ jobs → sees skill assessment suggestion
- [ ] Role-based access control still works (can't access wrong dashboard)
- [ ] Each role has separate dashboard
- [ ] Backend validates all operations
- [ ] No console errors
- [ ] Works on Chrome, Firefox, Safari

---

## Quick Commands

```bash
# Type check
npm run build

# Test behavior tracking
# Open DevTools → Network tab → view a job → check POST /api/behavior/track

# Run end-to-end test
npm run test:e2e

# Check dashboard behavior
# localStorage.getItem('user') → check behaviorProfile field
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Behavior not persisting | Check localStorage in DevTools, verify updateBehaviorProfile updates state |
| Dashboard shows same content for all users | Check behaviorProfile is populated, verify conditional rendering logic |
| Email not sent | Check EmailService.sendWelcomeEmail() is called after signup |
| Backend not receiving tracking | Check /api/behavior/track endpoint exists and is not returning 404 |
| Onboarding link 404 | Check route `/onboarding/{userType}` exists in App.tsx |

---

## Time Estimate

- Phase 1-2: 4 hours
- Phase 3-4: 4 hours
- Phase 5-6: 3 hours
- Phase 7: 4 hours
- Phase 8-11: 4 hours

**Total: ~19 hours** (2-3 days for one developer)

---

## Success Metrics

Track these in your analytics:

- % of new users who complete onboarding
- % of active users who see personalized content
- Time to first engagement (view job)
- Completion rate of suggested assessments
- Referral program signup rate (for high engagement users)

Goal: Users who see personalized content should have 2x engagement vs generic content.
