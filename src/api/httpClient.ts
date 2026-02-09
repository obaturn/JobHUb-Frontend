/**
 * HTTP Client with Token Refresh Interceptor
 * Handles 401 errors by automatically refreshing tokens and retrying requests
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8084/api/v1';

interface RequestConfig extends RequestInit {
  url: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

/**
 * Get the current access token from localStorage
 */
function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

/**
 * Get the current refresh token from localStorage
 */
function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

/**
 * Store tokens in localStorage
 */
function storeTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

/**
 * Clear all tokens from storage
 */
function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

/**
 * Refresh tokens using the refresh token
 */
async function refreshAccessToken(): Promise<RefreshTokenResponse> {
  const refreshToken = getRefreshToken();
  
  // Check if refresh token is valid
  if (!refreshToken || refreshToken === 'undefined' || refreshToken === 'null' || refreshToken.trim() === '') {
    console.warn('No valid refresh token available for refresh');
    clearTokens();
    window.location.href = '/login';
    throw new Error('No refresh token available');
  }

  console.log('🔄 [httpClient] Attempting token refresh...');

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken } as RefreshTokenRequest),
  });

  if (!response.ok) {
    console.error('❌ [httpClient] Token refresh failed with status:', response.status);
    clearTokens();
    window.location.href = '/login';
    throw new Error('Token refresh failed');
  }

  const data = (await response.json()) as RefreshTokenResponse;
  console.log('✅ [httpClient] Token refresh successful');
  storeTokens(data.accessToken, data.refreshToken);
  return data;
}

/**
 * Main HTTP client with interceptor
 */
export async function httpClient(
  url: string,
  config?: RequestInit
): Promise<Response> {
  const accessToken = getAccessToken();

  // Convert relative URLs to absolute URLs
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  console.log('🌐 [httpClient] Making request to:', fullUrl);

  // Add authorization header if token exists
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(fullUrl, {
    ...config,
    headers,
  });

  console.log('📡 [httpClient] Response status:', response.status);

  // Handle 401 Unauthorized
  if (response.status === 401) {
    try {
      // Prevent multiple simultaneous refresh attempts
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }

      await refreshPromise;
      refreshPromise = null;

      // Get new token and retry request
      const newAccessToken = getAccessToken();
      const retryHeaders = {
        'Content-Type': 'application/json',
        ...config?.headers,
      };

      if (newAccessToken) {
        retryHeaders['Authorization'] = `Bearer ${newAccessToken}`;
      }

      response = await fetch(fullUrl, {
        ...config,
        headers: retryHeaders,
      });
    } catch (error) {
      refreshPromise = null;
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
  }

  return response;
}

/**
 * Helper for GET requests
 */
export async function httpGet<T>(url: string): Promise<T> {
  const response = await httpClient(url, { method: 'GET' });

  if (!response.ok) {
    throw new Error(`GET ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Helper for POST requests
 */
export async function httpPost<T>(
  url: string,
  body?: unknown
): Promise<T> {
  const response = await httpClient(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorData;
    let responseText = '';
    
    try {
      responseText = await response.text();
      if (responseText) {
        errorData = JSON.parse(responseText);
      } else {
        errorData = { message: `HTTP ${response.status}` };
      }
    } catch (e) {
      errorData = { 
        message: responseText || `HTTP ${response.status}`,
        status: response.status,
        statusText: response.statusText
      };
    }
    
    // Handle specific error cases
    let errorMessage = errorData.message || errorData.error || `POST ${url} failed with status ${response.status}`;
    
    // Handle validation errors (400 status)
    if (response.status === 400 && errorData) {
      if (typeof errorData === 'object') {
        // Handle field validation errors
        const fieldErrors = Object.entries(errorData)
          .filter(([key, value]) => key !== 'message' && key !== 'error')
          .map(([field, error]) => `${field}: ${error}`)
          .join(', ');
        
        if (fieldErrors) {
          errorMessage = fieldErrors;
        }
      }
    }
    
    // Handle authentication errors (403 status)
    if (response.status === 403) {
      if (url.includes('/login')) {
        errorMessage = 'Email not verified. Please check your email for the verification link and click it to activate your account.';
      } else {
        errorMessage = 'Access denied. Please check your credentials.';
      }
    }
    
    console.error(`🔴 [httpPost] Error ${response.status}:`, {
      url,
      status: response.status,
      statusText: response.statusText,
      responseText,
      errorData,
      finalMessage: errorMessage
    });
    
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/**
 * Helper for PUT requests
 */
export async function httpPut<T>(
  url: string,
  body?: unknown
): Promise<T> {
  const response = await httpClient(url, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`PUT ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Helper for DELETE requests
 */
export async function httpDelete<T>(url: string): Promise<T> {
  const response = await httpClient(url, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(`DELETE ${url} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
