/**
 * Authentication Helper Utilities
 * Provides helper functions for authentication flows
 */

import { useAuthStore } from '../stores/authStore';

/**
 * Setup axios interceptor for automatic token refresh
 */
export const setupAuthInterceptor = () => {
  // This will be called when token expires
  // Automatically refresh token and retry failed request
  
  const refreshToken = async () => {
    try {
      const authStore = useAuthStore.getState();
      await authStore.refreshToken();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Logout user if refresh fails
      const authStore = useAuthStore.getState();
      await authStore.logout();
      return false;
    }
  };

  return refreshToken;
};

/**
 * Get authorization header with current access token
 */
export const getAuthHeader = (): { Authorization: string } | {} => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (accessToken) {
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  }
  
  return {};
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const authStore = useAuthStore.getState();
  return authStore.isAuthenticated && !!authStore.accessToken;
};

/**
 * Get current user from store
 */
export const getCurrentUserFromStore = () => {
  const authStore = useAuthStore.getState();
  return authStore.user;
};

/**
 * Handle 401 Unauthorized responses
 */
export const handleUnauthorized = async () => {
  const refreshToken = setupAuthInterceptor();
  const success = await refreshToken();
  
  if (!success) {
    // Redirect to login if needed
    window.location.href = '/login';
  }
};