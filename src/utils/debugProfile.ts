/**
 * Debug utility to test profile API endpoints
 */

export const debugProfileEndpoints = async () => {
  const token = localStorage.getItem('accessToken');
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8084/api/v1';
  
  console.log('🔍 [Debug] Starting profile endpoint tests...');
  console.log('🔍 [Debug] Base URL:', baseUrl);
  console.log('🔍 [Debug] Token present:', !!token);
  console.log('🔍 [Debug] Token preview:', token ? token.substring(0, 20) + '...' : 'None');
  
  const endpoints = [
    '/profile',
    '/profile/skills',
    '/profile/experience',
    '/profile/education'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🌐 [Debug] Testing: ${baseUrl}${endpoint}`);
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log(`📡 [Debug] ${endpoint} - Status:`, response.status);
      console.log(`📡 [Debug] ${endpoint} - OK:`, response.ok);
      console.log(`📡 [Debug] ${endpoint} - Headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`❌ [Debug] ${endpoint} - Error:`, errorText);
      } else {
        const data = await response.json();
        console.log(`✅ [Debug] ${endpoint} - Success:`, data);
      }
      
    } catch (error) {
      console.error(`💥 [Debug] ${endpoint} - Network Error:`, error);
      
      // Check if it's a CORS error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error(`🚫 [Debug] ${endpoint} - Likely CORS or network connectivity issue`);
      }
    }
  }
  
  console.log('\n🔍 [Debug] Profile endpoint tests completed');
};

// Add to window for easy access in browser console
(window as any).debugProfile = debugProfileEndpoints;