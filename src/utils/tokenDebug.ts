/**
 * Token Debug Utilities
 * Helper functions for debugging token-related issues
 */

/**
 * Check and log the current state of tokens in localStorage
 */
export const debugTokens = (): void => {
  console.group('🔍 [TokenDebug] Current Token State');
  
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const user = localStorage.getItem('user');
  
  console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : accessToken);
  console.log('Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : refreshToken);
  console.log('User Data:', user);
  
  // Check for common issues
  const issues: string[] = [];
  
  if (accessToken === 'undefined') issues.push('Access token is string "undefined"');
  if (refreshToken === 'undefined') issues.push('Refresh token is string "undefined"');
  if (user === 'undefined') issues.push('User data is string "undefined"');
  if (accessToken === 'null') issues.push('Access token is string "null"');
  if (refreshToken === 'null') issues.push('Refresh token is string "null"');
  if (user === 'null') issues.push('User data is string "null"');
  
  if (issues.length > 0) {
    console.warn('⚠️ Issues found:', issues);
  } else {
    console.log('✅ No obvious token issues detected');
  }
  
  console.groupEnd();
};

/**
 * Clear all tokens and user data from localStorage
 */
export const clearAllTokens = (): void => {
  console.log('🧹 [TokenDebug] Clearing all tokens and user data');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

/**
 * Check if a token value is valid (not null, undefined, or string versions)
 */
export const isValidToken = (token: string | null): boolean => {
  return token !== null && token !== 'undefined' && token !== 'null' && token.trim() !== '';
};

// Make debug functions available globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).debugTokens = debugTokens;
  (window as any).clearAllTokens = clearAllTokens;
  console.log('🔧 [TokenDebug] Debug functions available: window.debugTokens(), window.clearAllTokens()');
}