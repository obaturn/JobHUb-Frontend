/**
 * JWT Token Debug Utility
 */

export const debugJWTToken = () => {
  const token = localStorage.getItem('accessToken');
  
  console.log('🔐 [JWT Debug] Starting token analysis...');
  
  if (!token) {
    console.error('❌ [JWT Debug] No token found in localStorage');
    return;
  }
  
  console.log('✅ [JWT Debug] Token found');
  console.log('📏 [JWT Debug] Token length:', token.length);
  console.log('🔍 [JWT Debug] Token preview:', token.substring(0, 50) + '...');
  
  // Try to decode JWT (basic parsing, not verification)
  try {
    const parts = token.split('.');
    console.log('🧩 [JWT Debug] Token parts:', parts.length);
    
    if (parts.length === 3) {
      // Decode header
      const header = JSON.parse(atob(parts[0]));
      console.log('📋 [JWT Debug] Header:', header);
      
      // Decode payload
      const payload = JSON.parse(atob(parts[1]));
      console.log('📦 [JWT Debug] Payload:', payload);
      
      // Check expiration
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        console.log('⏰ [JWT Debug] Expires at:', expDate);
        console.log('⏰ [JWT Debug] Current time:', now);
        console.log('✅ [JWT Debug] Token valid:', expDate > now);
      }
      
      // Check issuer, audience, etc.
      console.log('🏢 [JWT Debug] Issuer:', payload.iss);
      console.log('👤 [JWT Debug] Subject:', payload.sub);
      console.log('🎯 [JWT Debug] Audience:', payload.aud);
      
    } else {
      console.error('❌ [JWT Debug] Invalid JWT format - should have 3 parts');
    }
    
  } catch (error) {
    console.error('❌ [JWT Debug] Failed to decode token:', error);
  }
  
  console.log('🔐 [JWT Debug] Token analysis completed');
};

// Export with the name App.tsx expects
export const debugTokens = debugJWTToken;

// Clear all tokens utility
export const clearAllTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  console.log('🧹 [JWT Debug] All tokens cleared');
};

// Check if token is valid (basic check)
export const isValidToken = (): boolean => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      return expDate > now;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

// Add to window for easy access
(window as any).debugJWT = debugJWTToken;
(window as any).debugTokens = debugTokens;