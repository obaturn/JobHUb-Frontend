/**
 * Profile API Utilities - Integrated with Backend
 * Connects to your Spring Boot backend profile endpoints
 */

import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';

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

/**
 * Get user profile - calls /api/v1/profile (gateway rewrites to /api/v1/auth/profile)
 */
export const getProfile = async (): Promise<UserProfile> => {
  try {
    return await httpGet<UserProfile>('/profile');
  } catch (error) {
    console.error('Get Profile Error:', error);
    throw new Error('Failed to load profile. Please try again.');
  }
};

/**
 * Update user profile - calls your backend /api/v1/profile (gateway rewrites to /api/v1/auth/profile)
 */
export const updateProfile = async (profileData: ProfileUpdateRequest): Promise<void> => {
  try {
    await httpPut<void>('/profile', profileData);
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
    return await httpPost<{ message: string }>('/auth/profile/avatar', avatarData);
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
    return await httpPut<{ message: string }>('/auth/password', passwordData);
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
    await httpDelete<void>('/auth/account');
    
    // Clear local storage after successful deletion
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Delete Account Error:', error);
    throw new Error('Failed to delete account. Please try again.');
  }
};