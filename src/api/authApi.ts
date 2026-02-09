/**
 * Real Authentication API Client
 * Communicates with backend at /api/v1/auth/*
 */

import { httpPost, httpGet, httpClient } from './httpClient';
import { User } from '@/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8084/api/v1';

export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType?: 'job_seeker' | 'employer' | 'admin';
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

/**
 * Login user with email and password
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  console.log('📡 [AuthAPI] Sending login request:', {
    email: credentials.email,
    passwordLength: credentials.password.length,
    passwordBytes: new TextEncoder().encode(credentials.password).length,
    deviceId: credentials.deviceId
  });
  
  // Transform to match backend LoginRequest format
  const loginPayload = {
    email: credentials.email,
    password: credentials.password
  };
  
  return httpPost<LoginResponse>('/auth/login', loginPayload);
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelayMs: number = 500
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable (409 Conflict or 429 Too Many Requests)
      const isRetryable = error instanceof Error && 
        (error.message.includes('409') || 
         error.message.includes('429') || 
         error.message.includes('Concurrent'));
      
      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 500ms, 1000ms, 2000ms
      const delayMs = initialDelayMs * Math.pow(2, attempt);
      console.warn(`⏳ [AuthAPI] Retrying signup in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Register new user
 */
export async function signup(userData: SignupRequest): Promise<SignupResponse> {
  // Transform password to passwordHash for backend compatibility
  const payload = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    passwordHash: userData.password,
    userType: userData.userType || 'job_seeker',
  };
  
  console.log('📡 [AuthAPI] Sending signup request:', { 
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    userType: payload.userType,
    passwordHashLength: payload.passwordHash.length
  });
  
  // Use retry logic to handle concurrent modification errors
  return retryWithBackoff(async () => {
    try {
      // Use httpClient for consistent URL handling
      const response = await httpClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: `HTTP ${response.status}` };
        }
        
        const errorMessage = errorData.message || errorData.error || `Registration failed with status ${response.status}`;
        console.error('🔴 [AuthAPI] Signup error response:', errorData);
        
        // Create error with status code for retry detection
        const error = new Error(errorMessage);
        (error as any).status = response.status;
        throw error;
      }

      const result = await response.json() as SignupResponse;
      console.log('✅ [AuthAPI] Signup response:', result);
      return result;
    } catch (error) {
      console.error('❌ [AuthAPI] Signup error:', error);
      throw error;
    }
  }, 3, 500);
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  return httpGet<User>('/auth/me');
}

/**
 * Verify email with token from email link
 */
export async function verifyEmail(token: string): Promise<{ message: string }> {
  try {
    console.log('📧 [AuthAPI] Verifying email with token:', token.substring(0, 20) + '...');
    
    const response = await httpClient('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `Verification failed with status ${response.status}` };
      }
      
      const errorMessage = errorData.message || errorData.error || 'Email verification failed';
      console.error('🔴 [AuthAPI] Verification error:', errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ [AuthAPI] Email verified successfully');
    return result;
  } catch (error) {
    console.error('❌ [AuthAPI] Verification error:', error);
    throw error;
  }
}

/**
 * Resend verification email to user
 */
export async function resendVerificationEmail(email: string): Promise<{ message: string }> {
  try {
    console.log('📧 [AuthAPI] Requesting resend verification for:', email);
    
    const response = await httpClient('/auth/send-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `Request failed with status ${response.status}` };
      }
      
      const errorMessage = errorData.message || errorData.error || 'Failed to resend verification email';
      console.error('🔴 [AuthAPI] Resend error:', errorData);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ [AuthAPI] Verification email resent successfully');
    return result;
  } catch (error) {
    console.error('❌ [AuthAPI] Resend error:', error);
    throw error;
  }
}
/**
 * Skip email verification (development only)
 */
export async function skipEmailVerification(email: string): Promise<void> {
  try {
    console.log('📧 [AuthAPI] Attempting to skip email verification for development');
    const response = await httpClient('/auth/dev/skip-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP ${response.status}` };
      }
      const errorMessage = errorData.message || errorData.error || 'Failed to skip verification';
      throw new Error(errorMessage);
    }

    console.log('✅ [AuthAPI] Email verification skipped for development');
  } catch (error) {
    console.error('❌ [AuthAPI] Error skipping verification:', error);
    throw error;
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    console.log('📡 [AuthAPI] Sending logout request');
    
    const response = await httpClient('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      let errorMessage = `Logout failed with status ${response.status}`;
      
      try {
        const responseText = await response.text();
        if (responseText.trim()) {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch (e) {
        // If we can't parse the error response, use the default message
        console.warn('Could not parse logout error response');
      }
      
      console.error('🔴 [AuthAPI] Logout failed:', errorMessage);
      throw new Error(errorMessage);
    }

    // Success - check if there's a response body
    try {
      const responseText = await response.text();
      if (responseText.trim()) {
        // If there's a response body, try to parse it
        const result = JSON.parse(responseText);
        console.log('✅ [AuthAPI] Logout successful with response:', result);
      } else {
        // Empty response body is fine for logout
        console.log('✅ [AuthAPI] Logout successful (empty response)');
      }
    } catch (e) {
      // If we can't parse the success response, that's still okay
      console.log('✅ [AuthAPI] Logout successful (non-JSON response)');
    }
  } catch (error) {
    console.error('❌ [AuthAPI] Logout error:', error);
    throw error;
  }
}

/**
 * Refresh access token (called by httpClient interceptor)
 */
export async function refreshToken(
  refreshTokenValue: string
): Promise<RefreshTokenResponse> {
  return httpPost<RefreshTokenResponse>('/auth/refresh', {
    refreshToken: refreshTokenValue,
  });
}
