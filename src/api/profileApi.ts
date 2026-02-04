/**
 * Profile API Utilities - Integrated with Backend
 * Connects to your Spring Boot backend profile endpoints
 */

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add other profile fields as needed
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api/v1';

// Helper function to get auth token
const getAuthToken = (): string => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  console.log('Making API request to:', `${API_BASE_URL}${url}`);
  console.log('With token:', token ? 'Present' : 'Missing');
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check if the backend is running and CORS is configured.');
    }
    throw error;
  }
};

/**
 * Get user profile - calls your backend /api/v1/auth/profile
 */
export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/profile');
    const profile = await response.json();
    
    return profile;
  } catch (error) {
    console.error('Get Profile Error:', error);
    throw new Error('Failed to load profile. Please try again.');
  }
};

/**
 * Update user profile - calls your backend /api/v1/auth/profile
 */
export const updateProfile = async (profileData: ProfileUpdateRequest): Promise<void> => {
  try {
    await makeAuthenticatedRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    throw new Error('Failed to update profile. Please try again.');
  }
};

/**
 * Upload profile avatar - you may need to add this endpoint to your backend
 */
export const uploadAvatar = async (file: File): Promise<{ avatarUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/auth/profile/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload avatar');
    }

    const data = await response.json();
    return { avatarUrl: data.avatarUrl };
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    throw new Error('Failed to upload avatar. Please try again.');
  }
};

/**
 * Delete account - calls your backend /api/v1/auth/account
 */
export const deleteAccount = async (): Promise<void> => {
  try {
    await makeAuthenticatedRequest('/auth/account', {
      method: 'DELETE',
    });
    
    // Clear local storage after successful deletion
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Delete Account Error:', error);
    throw new Error('Failed to delete account. Please try again.');
  }
};