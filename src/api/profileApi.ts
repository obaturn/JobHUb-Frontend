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
 * Upload profile avatar - calls your backend /api/v1/auth/profile/avatar
 */
export const uploadAvatar = async (avatarData: { avatarUrl: string }): Promise<{ message: string }> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/profile/avatar', {
      method: 'POST',
      body: JSON.stringify(avatarData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    throw new Error('Failed to upload avatar. Please try again.');
  }
};

/**
 * Upload avatar file (for file uploads - converts to URL first)
 * This is a helper function that would typically upload to a file service first
 */
export const uploadAvatarFile = async (file: File): Promise<{ message: string; avatarUrl: string }> => {
  try {
    // In a real implementation, you would:
    // 1. Upload file to a file storage service (AWS S3, Cloudinary, etc.)
    // 2. Get the URL back
    // 3. Then call uploadAvatar with the URL
    
    // For now, we'll create a temporary URL (you'll need to implement actual file upload)
    const tempUrl = URL.createObjectURL(file);
    
    // Call your backend with the avatar URL
    const result = await uploadAvatar({ avatarUrl: tempUrl });
    
    return {
      message: result.message,
      avatarUrl: tempUrl
    };
  } catch (error) {
    console.error('Upload Avatar File Error:', error);
    throw new Error('Failed to upload avatar file. Please try again.');
  }
};

/**
 * Change user password - calls your backend /api/v1/auth/password
 */
export const changePassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Change Password Error:', error);
    throw new Error('Failed to change password. Please try again.');
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