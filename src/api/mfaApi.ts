/**
 * MFA API Utilities - Integrated with Backend
 * Connects to your Spring Boot backend MFA endpoints
 */

import { httpGet, httpPost } from './httpClient';

export interface MFASetupResponse {
  secret: string;
  qrCode: string;
  backupSecret: string;
  setupToken: string;
  instructions: string[];
}

export interface MFAVerifyResponse {
  mfaEnabled: boolean;
  backupCodes: string[];
  message: string;
}

export interface MFAStatusResponse {
  mfaEnabled: boolean;
  userId: string;
  backupCodesCount: number;
}

export interface MFAVerifyLoginResponse {
  user: any;
}

/**
 * Setup MFA - calls your backend /api/v1/auth/mfa/setup
 */
export const setupMFA = async (): Promise<MFASetupResponse> => {
  try {
    const data = await httpPost<any>('/auth/mfa/setup', {});
    
    return {
      secret: data.secret,
      qrCode: data.qrCode,
      backupSecret: data.secret,
      setupToken: 'setup-in-progress',
      instructions: [
        'Install an authenticator app (Google Authenticator, Authy, etc.)',
        'Scan the QR code with your authenticator app',
        'Enter the 6-digit code from your app to verify setup',
      ],
    };
  } catch (error) {
    console.error('MFA Setup Error:', error);
    throw new Error('Failed to setup MFA. Please try again.');
  }
};

/**
 * Verify MFA setup - calls your backend /api/v1/auth/mfa/enable
 */
export const verifyMFASetup = async (
  code: string,
  _secret: string
): Promise<MFAVerifyResponse> => {
  try {
    await httpPost<void>('/auth/mfa/enable', { code });

    // Generate mock backup codes (in real implementation, backend should provide these)
    const backupCodes = Array.from({ length: 10 }, () =>
      `${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}`
    );

    return { 
      mfaEnabled: true, 
      backupCodes, 
      message: 'MFA enabled successfully!' 
    };
  } catch (error) {
    console.error('MFA Verification Error:', error);
    throw new Error('Failed to verify MFA code. Please check the code and try again.');
  }
};

/**
 * Verify TOTP during login - calls your backend /api/v1/auth/login/mfa
 */
export const verifyTOTPForLogin = async (
  mfaToken: string,
  totpCode: string
): Promise<MFAVerifyLoginResponse> => {
  try {
    const data = await httpPost<any>('/auth/login/mfa', { 
      mfaToken, 
      code: totpCode 
    });
    
    // Store the tokens
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    return { user: data.user || data };
  } catch (error) {
    console.error('MFA Login Verification Error:', error);
    throw new Error('Invalid MFA code. Please try again.');
  }
};

/**
 * Get MFA status - check if user has MFA enabled
 */
export const getMFAStatus = async (): Promise<MFAStatusResponse> => {
  try {
    const profile = await httpGet<any>('/auth/profile');
    
    // Assuming your UserProfile or User entity has mfaEnabled field
    return { 
      mfaEnabled: profile.mfaEnabled || false, 
      userId: profile.id || profile.userId, 
      backupCodesCount: 10 // Mock count, adjust based on your backend
    };
  } catch (error) {
    console.error('MFA Status Error:', error);
    // Return default status if error
    return { 
      mfaEnabled: false, 
      userId: 'unknown', 
      backupCodesCount: 0 
    };
  }
};

/**
 * Disable MFA - you'll need to add this endpoint to your backend
 */
export const disableMFA = async (
  password: string
): Promise<{ mfaEnabled: boolean; message: string }> => {
  try {
    // Note: You'll need to add this endpoint to your backend
    // For now, this is a placeholder implementation
    await httpPost<void>('/auth/mfa/disable', { password });

    return { 
      mfaEnabled: false, 
      message: 'MFA disabled successfully' 
    };
  } catch (error) {
    console.error('MFA Disable Error:', error);
    throw new Error('Failed to disable MFA. Please check your password and try again.');
  }
};
