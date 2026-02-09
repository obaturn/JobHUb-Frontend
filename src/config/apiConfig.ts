/**
 * Microservices API Configuration
 * Manages different service endpoints and base URLs
 */

export interface ServiceConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

export interface ApiConfig {
  auth: ServiceConfig;
  jobs: ServiceConfig;
  messaging: ServiceConfig;
  notifications: ServiceConfig;
  analytics: ServiceConfig;
  files: ServiceConfig;
}

// TEMPORARY: Testing direct connection to backend (bypassing API Gateway)
// Change back to 8084 after testing
const USE_DIRECT_BACKEND = false; // Set to false to use API Gateway

// Default configuration for local development
const DEFAULT_CONFIG: ApiConfig = {
  auth: {
    // TESTING: Direct connection to auth service on 8081
    baseUrl: USE_DIRECT_BACKEND 
      ? (process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8081/api/v1')
      : (process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8084/api/v1'),
    timeout: 10000,
    retries: 3
  },
  jobs: {
    baseUrl: process.env.REACT_APP_JOBS_SERVICE_URL || 'http://localhost:8084/api/v1',
    timeout: 15000,
    retries: 2
  },
  messaging: {
    baseUrl: process.env.REACT_APP_MESSAGING_SERVICE_URL || 'http://localhost:8084/api/v1',
    timeout: 10000,
    retries: 3
  },
  notifications: {
    baseUrl: process.env.REACT_APP_NOTIFICATIONS_SERVICE_URL || 'http://localhost:8084/api/v1',
    timeout: 5000,
    retries: 2
  },
  analytics: {
    baseUrl: process.env.REACT_APP_ANALYTICS_SERVICE_URL || 'http://localhost:8084/api/v1',
    timeout: 20000,
    retries: 1
  },
  files: {
    baseUrl: process.env.REACT_APP_FILES_SERVICE_URL || 'http://localhost:8084/api/v1',
    timeout: 30000,
    retries: 2
  }
};

// Production configuration example
const PRODUCTION_CONFIG: ApiConfig = {
  auth: {
    baseUrl: process.env.REACT_APP_AUTH_SERVICE_URL || 'https://auth-service.yourcompany.com/api/v1',
    timeout: 10000,
    retries: 3
  },
  jobs: {
    baseUrl: process.env.REACT_APP_JOBS_SERVICE_URL || 'https://jobs-service.yourcompany.com/api/v1',
    timeout: 15000,
    retries: 2
  },
  messaging: {
    baseUrl: process.env.REACT_APP_MESSAGING_SERVICE_URL || 'https://messaging-service.yourcompany.com/api/v1',
    timeout: 10000,
    retries: 3
  },
  notifications: {
    baseUrl: process.env.REACT_APP_NOTIFICATIONS_SERVICE_URL || 'https://notifications-service.yourcompany.com/api/v1',
    timeout: 5000,
    retries: 2
  },
  analytics: {
    baseUrl: process.env.REACT_APP_ANALYTICS_SERVICE_URL || 'https://analytics-service.yourcompany.com/api/v1',
    timeout: 20000,
    retries: 1
  },
  files: {
    baseUrl: process.env.REACT_APP_FILES_SERVICE_URL || 'https://files-service.yourcompany.com/api/v1',
    timeout: 30000,
    retries: 2
  }
};

// Get configuration based on environment
const getApiConfig = (): ApiConfig => {
  const environment = process.env.NODE_ENV || 'development';
  
  if (environment === 'production') {
    return PRODUCTION_CONFIG;
  }
  
  return DEFAULT_CONFIG;
};

export const API_CONFIG = getApiConfig();

// Helper functions to get service URLs
export const getAuthServiceUrl = () => API_CONFIG.auth.baseUrl;
export const getJobsServiceUrl = () => API_CONFIG.jobs.baseUrl;
export const getMessagingServiceUrl = () => API_CONFIG.messaging.baseUrl;
export const getNotificationsServiceUrl = () => API_CONFIG.notifications.baseUrl;
export const getAnalyticsServiceUrl = () => API_CONFIG.analytics.baseUrl;
export const getFilesServiceUrl = () => API_CONFIG.files.baseUrl;

// Service health check URLs
export const getServiceHealthUrls = () => ({
  auth: `${API_CONFIG.auth.baseUrl}/health`,
  jobs: `${API_CONFIG.jobs.baseUrl}/health`,
  messaging: `${API_CONFIG.messaging.baseUrl}/health`,
  notifications: `${API_CONFIG.notifications.baseUrl}/health`,
  analytics: `${API_CONFIG.analytics.baseUrl}/health`,
  files: `${API_CONFIG.files.baseUrl}/health`,
});

// Debug information
export const getApiDebugInfo = () => ({
  environment: process.env.NODE_ENV || 'development',
  services: {
    auth: {
      url: API_CONFIG.auth.baseUrl,
      configured: !!process.env.REACT_APP_AUTH_SERVICE_URL,
    },
    jobs: {
      url: API_CONFIG.jobs.baseUrl,
      configured: !!process.env.REACT_APP_JOBS_SERVICE_URL,
    },
    messaging: {
      url: API_CONFIG.messaging.baseUrl,
      configured: !!process.env.REACT_APP_MESSAGING_SERVICE_URL,
    },
    notifications: {
      url: API_CONFIG.notifications.baseUrl,
      configured: !!process.env.REACT_APP_NOTIFICATIONS_SERVICE_URL,
    },
    analytics: {
      url: API_CONFIG.analytics.baseUrl,
      configured: !!process.env.REACT_APP_ANALYTICS_SERVICE_URL,
    },
    files: {
      url: API_CONFIG.files.baseUrl,
      configured: !!process.env.REACT_APP_FILES_SERVICE_URL,
    },
  },
});