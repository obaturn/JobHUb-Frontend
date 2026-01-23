# Email Verification Flow - Complete Implementation

## Overview
After user registration, an email verification flow is required before they can login. This document explains how the frontend and backend work together.

## Complete Flow

### 1. Registration (SignupPage)
```
User fills form with:
- First Name
- Last Name  
- Email
- Password (validated: 8+, uppercase, lowercase, number, special char)
- Confirm Password

↓ Form submitted to /api/v1/auth/register
↓ Backend creates user with status = "pending_verification"
↓ Email verification token generated
↓ Verification email sent to user
```

**Frontend Response**: Shows success screen with instructions
- Displays email address where verification link was sent
- Shows step-by-step instructions
- Provides button to go to login page
- Shows "Create Another Account" button

### 2. Email Verification (Backend sends email)
```
Backend sends email with link:
http://localhost:8080/api/auth/verify-email?token={UUID}

Note: This is backend's email URL, not frontend
Frontend will handle this at a different route
```

### 3. User Clicks Email Link (EmailVerificationPage)
```
User clicks link in email and gets redirected to frontend:
http://localhost:3000/verify-email?token={UUID}

↓ Frontend EmailVerificationPage component loads
↓ Extracts token from URL query parameter
↓ Sends verification request to /api/v1/auth/verify-email
↓ Backend validates token and updates user status to "active"
↓ Frontend shows success message
↓ Auto-redirects to login after 3 seconds
```

### 4. Login (LoginPage)
```
User can now login with email and password

If email is not verified:
- Backend returns: "Email not verified"
- Frontend shows error message
- User must verify email first before logging in
```

## Frontend Components

### SignupPage.tsx
- Handles user registration form
- Validates passwords and confirms match
- After successful signup:
  - Shows email verification success screen
  - Displays registered email
  - Shows instructions to verify
  - Provides links to login or create another account

### EmailVerificationPage.tsx (NEW)
- Handles email verification via link click
- Extracts token from URL
- Shows loading state while verifying
- Shows success or error message
- Auto-redirects to login on success
- Allows retry on failure

### LoginPage.tsx
- Updated to show clear error message if email not verified
- Error message: "❌ Email not verified. Please check your email for the verification link..."
- User must verify email first

## API Endpoints (Backend)

### Registration
- **Endpoint**: `POST /api/v1/auth/register`
- **Request**: `{ firstName, lastName, email, passwordHash, userType }`
- **Response**: User object with tokens
- **Side Effect**: Sends verification email

### Email Verification (Called by Frontend)
- **Endpoint**: `POST /api/v1/auth/verify-email`
- **Request**: `{ token }`
- **Response**: Success message or error
- **Side Effect**: Updates user status to "active"

### Email Verification Link (Called by Email)
- **Endpoint**: `GET /api/auth/verify-email?token={token}`
- **Side Effect**: Updates user status to "active"
- **Redirect**: Should redirect to frontend verification page or success page

### Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Request**: `{ email, password, deviceId }`
- **Response**: `{ accessToken, refreshToken, user }`
- **Error**: Returns "Email not verified" if user.emailVerified = false

## Development Testing

### Test Scenario 1: Complete Flow
1. Go to Signup page
2. Fill form with new email
3. Submit form
4. See success message with verification instructions
5. Check backend logs for email details and verification link format
6. Manually simulate email click by visiting: `http://localhost:3000/verify-email?token={TOKEN_FROM_LOGS}`
7. Should see success and auto-redirect to login
8. Login should now work

### Test Scenario 2: Email Not Verified Error
1. Try to login without verifying email
2. Should get error: "❌ Email not verified..."
3. Verify email using link
4. Try login again - should succeed

### Test Scenario 3: Invalid Token
1. Try visiting verify page with invalid token: `http://localhost:3000/verify-email?token=invalid`
2. Should show error message
3. Should show retry options

### Test Scenario 4: Missing Token
1. Try visiting verify page without token: `http://localhost:3000/verify-email`
2. Should show error message: "Verification token is missing..."

## Backend Logs To Monitor

### During Registration
```
Hibernate: insert into users (...)
Hibernate: insert into user_profiles (...)
Hibernate: insert into user_roles (...)
Hibernate: insert into audit_logs (...)

INFO: Sending Email:
To: user@example.com
Subject: Verify Your Email Address
Body: http://localhost:8080/api/auth/verify-email?token=...
```

### During Verification
```
Hibernate: update users set email_verified=true, status='active' where id=?
```

### During Login (Before Verification)
```
ERROR: java.lang.IllegalStateException: Email not verified
```

### During Login (After Verification)
```
Hibernate: update users set last_login_at=... where id=?
INFO: User logged in successfully
```

## Files Modified

- ✅ **pages/SignupPage.tsx** - Shows email verification success screen after signup
- ✅ **pages/LoginPage.tsx** - Shows clear error message for email verification required
- ✅ **pages/EmailVerificationPage.tsx** - NEW - Handles email verification link clicks
- ✅ **src/api/authApi.ts** - Contains verifyEmail() function
- ✅ **App.tsx** - Should add route for /verify-email → EmailVerificationPage

## Router Update Needed

Add this route to App.tsx if using React Router:

```typescript
import EmailVerificationPage from './pages/EmailVerificationPage';

// In your route configuration:
{
    path: '/verify-email',
    element: <EmailVerificationPage onNavigate={handleNavigate} />
}
```

Or if using custom navigation:
```typescript
case 'verify_email':
    return <EmailVerificationPage onNavigate={onNavigate} />;
```

## Notes

- The verification email is sent by backend, not frontend
- Frontend only handles the click verification flow
- Tokens have expiration time (check backend configuration)
- Multiple signup attempts with same email will generate new verification tokens
- Email can only be used once verified (backend constraint)
