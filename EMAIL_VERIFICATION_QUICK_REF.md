# Email Verification - Quick Reference

## The Correct Flow (After Your Backend Clarification)

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER REGISTRATION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. SIGNUP FORM (SignupPage)
   ├─ User enters: First Name, Last Name, Email, Password
   └─ Submit → POST /api/v1/auth/register
       │
       ├─ Backend creates user with status="pending_verification"
       ├─ Backend generates email_verification_token
       ├─ Backend sends email with link containing token
       └─ Backend returns user object
           │
           └─ Frontend Response: SHOW SUCCESS SCREEN ✅

2. EMAIL VERIFICATION SUCCESS SCREEN (SignupPage - Success State)
   ├─ Shows: "Registration Successful!"
   ├─ Shows: "We've sent a verification email to user@example.com"
   ├─ Shows Instructions:
   │  ├─ 1. Check your email inbox for a verification link
   │  ├─ 2. Click the link to verify your email address
   │  └─ 3. Return here and login with your credentials
   ├─ Button: "Go to Login"
   └─ Button: "Create Another Account"

3. USER CLICKS EMAIL LINK
   └─ Clicks: http://localhost:8080/api/auth/verify-email?token=...
      │
      ├─ Backend endpoint receives request
      ├─ Backend validates token
      ├─ Backend updates: user.email_verified=true, status="active"
      └─ Backend should redirect to: http://localhost:3000/verify-email?token=...
          │
          └─ (Or user manually goes to frontend verify page)

4. EMAIL VERIFICATION PAGE (EmailVerificationPage - NEW)
   ├─ Shows: Loading spinner...
   ├─ Extracts token from URL: ?token=...
   ├─ POST /api/v1/auth/verify-email with { token }
   ├─ Response:
   │  ├─ SUCCESS: Shows green checkmark + success message
   │  │           Auto-redirects to login after 3 seconds
   │  │           OR user clicks "Go to Login Now"
   │  │
   │  └─ ERROR: Shows red error + error message
   │           Shows "Try Signing Up Again" button
   │           Shows "Go to Login" button
   └─ Token expires after X minutes (backend config)

5. LOGIN PAGE (LoginPage)
   ├─ User enters email and password
   ├─ POST /api/v1/auth/login
   ├─ Response:
   │  ├─ IF email_verified=true:
   │  │  ├─ Returns: { accessToken, refreshToken, user }
   │  │  └─ Stores in localStorage
   │  │      Login SUCCESS ✅ → Redirect to dashboard
   │  │
   │  └─ IF email_verified=false:
   │     ├─ Returns: "Email not verified" error
   │     ├─ Frontend shows: "❌ Email not verified. Please check 
   │     │                   your email for the verification link..."
   │     └─ User must verify email first
   └─ No auto-login needed, user verifies then logs in

┌─────────────────────────────────────────────────────────────────┐
│                    COMPONENT RESPONSIBILITY                      │
└─────────────────────────────────────────────────────────────────┘

SignupPage:
├─ Before: Shows registration form
└─ After: Shows email verification success instructions
   └─ NOT auto-logging in anymore

EmailVerificationPage (NEW):
├─ Gets token from URL query parameter
├─ Calls: POST /api/v1/auth/verify-email?token=...
├─ Shows loading → success/error
└─ Auto-redirects to login on success

LoginPage (Updated):
├─ Shows clear error if email not verified
├─ No "Skip verification" button
└─ Requires email to be verified to login

┌─────────────────────────────────────────────────────────────────┐
│                    WHAT CHANGED FROM BEFORE                      │
└─────────────────────────────────────────────────────────────────┘

BEFORE (Incorrect):
├─ After signup, immediately try to login
├─ Login fails with "Email not verified" error
├─ Had "Skip verification" button (development bypass)
└─ Not following proper email verification flow

NOW (Correct):
├─ After signup, show success screen with instructions
├─ User must click email link to verify
├─ New EmailVerificationPage handles verification
├─ Login only works after email is verified
└─ Proper email verification flow implemented ✅

┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL VERIFICATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

Backend Email (from backend logs):
────────────────────────────────────
To: emmyvictor304@gmail.com
Subject: Verify Your Email Address
Body: Please click the link below to verify your email address:
      http://localhost:8080/api/auth/verify-email?token=838d4b0b-eae3-4dd6-8921-3eb409b3bb09

User clicks link ↓

Browser redirects to:
────────────────────────────────────
http://localhost:8080/api/auth/verify-email?token=838d4b0b-eae3-4dd6-8921-3eb409b3bb09

Backend should redirect to:
────────────────────────────────────
http://localhost:3000/verify-email?token=838d4b0b-eae3-4dd6-8921-3eb409b3bb09

Frontend EmailVerificationPage loads ↓

Frontend calls:
────────────────────────────────────
POST /api/v1/auth/verify-email
Body: { token: "838d4b0b-eae3-4dd6-8921-3eb409b3bb09" }

Backend response:
────────────────────────────────────
✅ Success: Email verified, user status changed to "active"

Frontend shows:
────────────────────────────────────
"Email Verified Successfully!"
"You will be redirected to login in a few seconds..."
Auto-redirect to login ↓

User can now login ✅

┌─────────────────────────────────────────────────────────────────┐
│                    FILE LOCATIONS                                │
└─────────────────────────────────────────────────────────────────┘

pages/SignupPage.tsx
├─ Shows registration form
└─ Shows email verification success screen (NEW)

pages/EmailVerificationPage.tsx (NEW FILE)
├─ Handles verification when user clicks email link
├─ Validates token
└─ Shows success or error

pages/LoginPage.tsx
├─ Updated to show clear "Email not verified" error
└─ Removed "Skip verification" logic

src/api/authApi.ts
├─ Added: verifyEmail(token) function
└─ Updated: signup() has retry logic

┌─────────────────────────────────────────────────────────────────┐
│                    TESTING CHECKLIST                             │
└─────────────────────────────────────────────────────────────────┘

✓ Step 1: Go to signup page
✓ Step 2: Fill form with new email
✓ Step 3: Submit form
✓ Step 4: See success screen with email verification instructions
✓ Step 5: Check backend logs for verification email
✓ Step 6: Manually construct verification URL: 
          http://localhost:3000/verify-email?token={TOKEN_FROM_LOGS}
✓ Step 7: Visit that URL in browser
✓ Step 8: See loading → success message → auto-redirect to login
✓ Step 9: Try to login - should work now ✅
✓ Step 10: Check localStorage has accessToken and refreshToken

EDGE CASES:
✓ Invalid token: http://localhost:3000/verify-email?token=invalid
✓ Missing token: http://localhost:3000/verify-email
✓ Expired token: (check backend timeout)
✓ Multiple signup attempts with same email
