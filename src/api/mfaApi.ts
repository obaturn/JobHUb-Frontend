/**
 * Mock MFA API Utilities
 * All functions are no-ops or local mocks to keep UI functional without backend.
 */

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

const genCodes = () => Array.from({ length: 10 }, () =>
  `${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}-${Math.floor(1000 + Math.random()*9000)}`
);

/**
 * Setup MFA (mock) - returns a placeholder QR and secret
 */
export const setupMFA = async (): Promise<MFASetupResponse> => {
  await new Promise((r) => setTimeout(r, 200));
  const secret = Math.random().toString(36).slice(2).toUpperCase();
  return {
    secret,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=otpauth://totp/JobHub:${encodeURIComponent('user@example.com')}?secret=${secret}&issuer=JobHub`,
    backupSecret: secret,
    setupToken: 'mock-setup-token',
    instructions: [
      'Install an authenticator app',
      'Scan the QR code',
      'Enter the 6-digit code to verify',
    ],
  };
};

/**
 * Verify MFA setup (mock)
 */
export const verifyMFASetup = async (
  _code: string,
  _secret: string
): Promise<MFAVerifyResponse> => {
  await new Promise((r) => setTimeout(r, 200));
  const backupCodes = genCodes();
  localStorage.setItem('mock_mfa_enabled', 'true');
  localStorage.setItem('mock_mfa_backup_codes', JSON.stringify(backupCodes));
  return { mfaEnabled: true, backupCodes, message: 'MFA enabled (mock)' };
};

/**
 * Verify TOTP during login (mock)
 */
export const verifyTOTPForLogin = async (
  _mfaToken: string,
  _totpCode: string
): Promise<MFAVerifyLoginResponse> => {
  await new Promise((r) => setTimeout(r, 150));
  const saved = localStorage.getItem('user');
  const user = saved ? JSON.parse(saved) : { id: 'u1', email: 'alex.doe@example.com' };
  return { user };
};

/**
 * Get MFA status (mock) - read from localStorage
 */
export const getMFAStatus = async (): Promise<MFAStatusResponse> => {
  await new Promise((r) => setTimeout(r, 150));
  const enabled = localStorage.getItem('mock_mfa_enabled') === 'true';
  const codes = JSON.parse(localStorage.getItem('mock_mfa_backup_codes') || '[]');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return { mfaEnabled: enabled, userId: user.id || 'u1', backupCodesCount: codes.length };
};

/**
 * Disable MFA (mock)
 */
export const disableMFA = async (
  _password: string
): Promise<{ mfaEnabled: boolean; message: string }> => {
  await new Promise((r) => setTimeout(r, 150));
  localStorage.removeItem('mock_mfa_enabled');
  localStorage.removeItem('mock_mfa_backup_codes');
  return { mfaEnabled: false, message: 'MFA disabled (mock)' };
};
