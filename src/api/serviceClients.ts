/**
 * Service-Specific HTTP Clients
 * Each microservice gets its own HTTP client with proper base URL
 */

import { API_CONFIG } from '../config/apiConfig';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper function to clear tokens
const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Generic service client factory
const createServiceClient = (serviceConfig: { baseUrl: string; timeout?: number }) => {
  return {
    async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
      const token = getAuthToken();
      const fullUrl = `${serviceConfig.baseUrl}${endpoint}`;
      
      console.log(`🌐 [${serviceConfig.baseUrl.split('//')[1]?.split('/')[0]}] Request:`, fullUrl);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token && !endpoint.includes('/login') && !endpoint.includes('/register')) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(fullUrl, {
          ...options,
          headers,
        });

        console.log(`📡 [${serviceConfig.baseUrl.split('//')[1]?.split('/')[0]}] Response:`, response.status);

        // Handle 401 for authenticated endpoints
        if (response.status === 401 && token) {
          console.warn('🔐 Token expired, redirecting to login');
          clearTokens();
          window.location.href = '/login';
          throw new Error('Session expired');
        }

        return response;
      } catch (error) {
        console.error(`❌ [${serviceConfig.baseUrl.split('//')[1]?.split('/')[0]}] Request failed:`, error);
        
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          throw new Error(`Unable to connect to ${serviceConfig.baseUrl.split('//')[1]?.split('/')[0]} service. Please check if the service is running and CORS is configured.`);
        }
        
        throw error;
      }
    },

    async get<T>(endpoint: string): Promise<T> {
      const response = await this.request(endpoint, { method: 'GET' });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GET ${endpoint} failed: ${response.status} - ${errorText}`);
      }
      
      return response.json();
    },

    async post<T>(endpoint: string, body?: unknown): Promise<T> {
      const response = await this.request(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'Unknown error' };
        }
        
        const errorMessage = errorData.message || errorData.error || `POST ${endpoint} failed with status ${response.status}`;
        console.error(`🔴 [POST] Error ${response.status}:`, errorData);
        throw new Error(errorMessage);
      }

      // Handle void responses (like profile updates)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return {} as T;
      }
    },

    async put<T>(endpoint: string, body?: unknown): Promise<T> {
      const response = await this.request(endpoint, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { message: 'Unknown error' };
        }
        
        const errorMessage = errorData.message || errorData.error || `PUT ${endpoint} failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      // Handle void responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return {} as T;
      }
    },

    async delete<T>(endpoint: string): Promise<T> {
      const response = await this.request(endpoint, { method: 'DELETE' });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DELETE ${endpoint} failed: ${response.status} - ${errorText}`);
      }

      // Handle void responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return {} as T;
      }
    }
  };
};

// Service-specific clients
export const authServiceClient = createServiceClient(API_CONFIG.auth);
export const jobsServiceClient = createServiceClient(API_CONFIG.jobs);
export const messagingServiceClient = createServiceClient(API_CONFIG.messaging);
export const notificationsServiceClient = createServiceClient(API_CONFIG.notifications);
export const analyticsServiceClient = createServiceClient(API_CONFIG.analytics);
export const filesServiceClient = createServiceClient(API_CONFIG.files);

// Service health check utility
export const checkAllServicesHealth = async () => {
  const services = [
    { name: 'auth', client: authServiceClient },
    { name: 'jobs', client: jobsServiceClient },
    { name: 'messaging', client: messagingServiceClient },
    { name: 'notifications', client: notificationsServiceClient },
    { name: 'analytics', client: analyticsServiceClient },
    { name: 'files', client: filesServiceClient },
  ];

  const results = await Promise.allSettled(
    services.map(async ({ name, client }) => {
      try {
        await client.get('/health');
        return { service: name, status: 'healthy' };
      } catch (error) {
        return { service: name, status: 'unhealthy', error: error.message };
      }
    })
  );

  return results.map((result, index) => ({
    service: services[index].name,
    ...(result.status === 'fulfilled' ? result.value : { status: 'error', error: result.reason })
  }));
};