/**
 * API Connection Test Utility
 * Use this to test if your backend is reachable
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8084/api/v1';

export const testApiConnection = async () => {
  console.log('Testing API connection to:', API_BASE_URL);
  
  try {
    // Test basic connectivity with a simple endpoint
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Health check response:', response.status);
    return { success: true, status: response.status };
  } catch (error) {
    console.error('API connection test failed:', error);
    
    // Test if it's a CORS issue by trying a simple request
    try {
      const corsTest = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/`, {
        method: 'GET',
        mode: 'no-cors'
      });
      console.log('CORS test completed - server is reachable but CORS may be blocking');
      return { success: false, error: 'CORS configuration needed on backend' };
    } catch (corsError) {
      console.log('Server appears to be unreachable');
      return { success: false, error: 'Backend server not running or unreachable' };
    }
  }
};

export const testAuthenticatedEndpoint = async () => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('No token found for authenticated test');
    return { success: false, error: 'No authentication token' };
  }
  
  console.log('Testing authenticated endpoint with token:', token.substring(0, 20) + '...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    console.log('Profile endpoint response:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Profile data received:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log('Profile endpoint error:', errorText);
      return { success: false, status: response.status, error: errorText };
    }
  } catch (error) {
    console.error('Authenticated endpoint test failed:', error);
    return { success: false, error: error };
  }
};