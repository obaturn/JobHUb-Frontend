# Email Verification Testing Guide

## Quick Start: End-to-End Test

### Prerequisites
- Backend running on `http://localhost:8081`
- Frontend running on `http://localhost:3000`
- Both services connected via Kafka for event publishing

### Step 1: Register New User

1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Fill in form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com` (use a real email for testing)
   - Password: `Test@12345` (meets all requirements)
   - Confirm Password: `Test@12345`
4. Click "Create Account"

**Expected Result:**
- Form validates and submits
- Success screen appears showing "Check your email for verification"
- Email address is displayed
- See "Resend verification" button with instructions

### Step 2: Check Email

#### Development (Mocked Email)
1. Check browser console for logs
2. Look for messages like:
   ```
   📧 [AuthAPI] Sending verification email to: john.doe@example.com
   ✅ [AuthAPI] Email sent successfully
   ```
3. Server logs should show Notification Service composing email

#### Production (Real Email)
1. Check inbox for email from JobHub
2. Subject: "Verify Your Email Address"
3. Email contains:
   - Personalized greeting: "Hi John,"
   - Verification button with link
   - Backup link if button doesn't work
   - Expiration warning (24 hours)
   - Features list and footer

### Step 3: Test Resend Button (Optional)

1. Still on success screen, immediately click "Resend verification"
2. See button disabled with cooldown: "Resend in 60s"
3. See success message: "✓ Verification email resent! Check your inbox and spam folder."
4. Wait 5 seconds (to test countdown)
5. See countdown update: "Resend in 55s"
6. Wait remainder to full 60 seconds (or skip if impatient)
7. See button re-enable: "Resend Verification Email"

**Expected Result:**
- Button disabled immediately after click
- Countdown displayed (updates every second)
- Success message shows
- Button re-enables after 60 seconds

### Step 4: Verify Email

#### Option A: Click Email Link
1. In inbox (or from email console log), find verification link:
   - Format: `http://localhost:3000/verify-email?token=ABC123...`
2. Click the link
3. See "Verifying your email..." message
4. After 1-2 seconds, see success checkmark
5. Message: "Email verified successfully! Redirecting to login..."
6. Auto-redirect to login page (or wait 3 seconds)

#### Option B: Manual URL Navigation
1. Look at email console logs for token
2. Copy the verification link
3. Paste into browser address bar
4. Press Enter
5. Follow same verification flow as Option A

**Expected Result:**
- Page loads with loading state
- Success state shows with checkmark
- Auto-redirect to login page
- No errors displayed

### Step 5: Login

1. On login page, enter credentials:
   - Email: `john.doe@example.com`
   - Password: `Test@12345`
2. Click "Login"

**Expected Result:**
- Login succeeds
- User is authenticated
- Redirected to appropriate dashboard
- NO "Email not verified" error message

## Error Testing

### Test 1: Invalid Token

1. Go to http://localhost:3000/verify-email?token=invalid_token_12345
2. EmailVerificationPage loads
3. Shows "Verifying..." briefly
4. Shows error: "Invalid verification token" or similar
5. Backend returns 400/401

**Expected Behavior:**
- Error message displayed clearly
- No crash or infinite loading
- User can see they need correct token

### Test 2: Missing Token

1. Go to http://localhost:3000/verify-email (no ?token=...)
2. Shows error: "Verification token is missing. Please click the link from your email again."

**Expected Behavior:**
- Error message immediate (no loading state)
- User understands they need to check email

### Test 3: Expired Token

1. If using real backend with 24-hour expiration
2. Wait 24 hours (or admin-reset token)
3. Try to verify with expired token
4. Shows error: "Verification token has expired. Please request a new one."

**Expected Behavior:**
- Clear error message
- User knows to request resend

### Test 4: Already Verified

1. Verify email normally (Step 4 above)
2. Click verification link again (same token)
3. Shows error: "Email already verified" or similar

**Expected Behavior:**
- Graceful error handling
- No duplicate verification

## State Verification

### Check Browser Console

Look for logs with patterns:
```
📧 [SignupPage] Starting registration...
🔐 [SignupPage] Password requirements met
✅ [SignupPage] Registration successful!
✅ [SignupPage] Stored tokens in localStorage

📧 [EmailVerificationPage] Verifying email with token: ABC12...
✅ [AuthAPI] Email verified successfully
🔴 [AuthAPI] Verification error: Token expired
```

### Check Network Tab (DevTools → Network)

Requests should show:
1. **POST /api/v1/auth/register**
   - Status: 200
   - Response: `{ token, refreshToken, user }`

2. **POST /api/v1/auth/resend-verification**
   - Status: 200
   - Response: `{ message: "..." }`

3. **POST /api/v1/auth/verify-email**
   - Status: 200
   - Response: `{ message: "..." }`

### Check LocalStorage

After registration, should contain:
```javascript
localStorage.getItem('authToken') // JWT token
localStorage.getItem('refreshToken') // Refresh token
localStorage.getItem('user') // User object
```

After email verification and login, same tokens remain with verified user.

## UI/UX Verification

### Success Screen Elements

- ✓ Green checkmark icon (bg-success-100)
- ✓ "Registration Successful!" heading
- ✓ Email address displayed
- ✓ Blue instruction box with next steps
- ✓ "Resend Verification Email" button (amber styling)
- ✓ "Go to Login" button (primary color)
- ✓ "Create Another Account" button (outline style)
- ✓ Development helper section with verification instructions

### Resend Button States

- **Normal**: Amber background, readable text
  ```
  Resend Verification Email
  ```
- **Loading**: Gray background, spinner + "Sending..."
- **Cooldown**: Gray background, disabled, countdown
  ```
  Resend in 60s
  Resend in 59s
  ...
  Resend in 1s
  ```
- **Message Success**: Green/amber background
  ```
  ✓ Verification email resent! Check your inbox and spam folder.
  ```
- **Message Error**: Red/error background
  ```
  ✕ Failed to resend verification email
  ```

### Email Verification Page States

- **Loading**: Spinner + "Verifying your email..."
- **Success**: 
  - Green checkmark icon
  - "Email verified successfully!"
  - "Redirecting to login..." (or 3-second countdown)
- **Error**:
  - Red X icon
  - Error message from backend
  - Explanation of what went wrong

## Performance Checks

### Network Performance
- Registration: < 2 seconds
- Verify email: < 1 second  
- Resend: < 1 second
- No loading states longer than 3 seconds (unless server slow)

### UI Responsiveness
- Buttons respond immediately to clicks
- Cooldown countdown updates every second
- Typing in form fields is responsive
- No jank or stuttering

## Accessibility Checks

### Color Contrast
- Success messages readable (check text on background)
- Error messages readable
- Button text readable

### Focus States
- Tab through form: all inputs focusable
- Disabled buttons not focusable
- Links have visible focus indicators

### Screen Reader (Optional)
- Read page title and headings
- Understand form labels
- Know what buttons do
- Understand error messages

## Cross-Browser Testing (Optional)

Test on:
- Chrome/Chromium
- Firefox
- Safari
- Edge

Expected results: same behavior across all browsers

## Mobile Testing (Optional)

Test on:
- iPhone (Safari)
- Android (Chrome)
- Tablet (any browser)

Expected:
- Form responsive and readable
- Buttons easy to tap (not too small)
- Email link works on mobile
- Success screen readable at all sizes
- Cooldown countdown visible

## Cleanup After Testing

To test registration again:
1. Clear browser cache/cookies
2. Or clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Close browser tab
4. Backend may need user record deleted from database for email reuse

## Common Issues & Solutions

### Issue: "Email already exists"
- **Cause**: Registering with email already in database
- **Solution**: Use different email address, or delete user from backend first

### Issue: "Verification token is invalid"
- **Cause**: Token modified in URL or expired
- **Solution**: Click fresh link from email, or resend verification

### Issue: Stuck on "Verifying..." screen
- **Cause**: Backend not responding, network timeout
- **Solution**: Check backend is running, reload page, check browser console for errors

### Issue: "Resend" button stays disabled
- **Cause**: Cooldown timer still running
- **Solution**: Wait 60 seconds, or check browser console for errors

### Issue: Email not received
- **Cause**: Email service mocked in development
- **Solution**: Check browser console and backend logs for email preview, or check spam folder

### Issue: Login still says "Email not verified"
- **Cause**: Verification didn't complete or database not updated
- **Solution**: Verify email again, check backend logs, ensure email_verified flag updated in DB

## Success Criteria

All tests passing means:
- ✅ Registration flow works
- ✅ Email verification works
- ✅ Login requires verified email
- ✅ Resend verification works with cooldown
- ✅ UI is responsive and clear
- ✅ Error handling is graceful
- ✅ User experience is intuitive
