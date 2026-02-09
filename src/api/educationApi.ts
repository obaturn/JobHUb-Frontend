/**
 * Education API - Integrated with Backend ProfileController
 * Connects to your Spring Boot backend /api/v1/auth/profile/education endpoints
 */

import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';

export interface EducationRequest {
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  gpa?: number;
  honors?: string;
}

export interface Education {
  id: string;
  userId: string;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  gpa?: number;
  honors?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all user education records - calls /api/v1/profile/education (gateway rewrites to /api/v1/auth/profile/education)
 */
export const getEducations = async (): Promise<Education[]> => {
  try {
    return await httpGet<Education[]>('/profile/education');
  } catch (error) {
    console.error('Get Educations Error:', error);
    throw new Error('Failed to load education records. Please try again.');
  }
};

/**
 * Create a new education record - calls /api/v1/profile/education (gateway rewrites to /api/v1/auth/profile/education)
 */
export const createEducation = async (educationData: EducationRequest): Promise<Education> => {
  try {
    return await httpPost<Education>('/profile/education', educationData);
  } catch (error) {
    console.error('Create Education Error:', error);
    throw new Error('Failed to add education record. Please try again.');
  }
};

/**
 * Update an existing education record - calls /api/v1/profile/education/{id} (gateway rewrites to /api/v1/auth/profile/education/{id})
 */
export const updateEducation = async (educationId: string, educationData: EducationRequest): Promise<Education> => {
  try {
    return await httpPut<Education>(`/profile/education/${educationId}`, educationData);
  } catch (error) {
    console.error('Update Education Error:', error);
    throw new Error('Failed to update education record. Please try again.');
  }
};

/**
 * Delete an education record - calls /api/v1/profile/education/{id} (gateway rewrites to /api/v1/auth/profile/education/{id})
 */
export const deleteEducation = async (educationId: string): Promise<void> => {
  try {
    await httpDelete<void>(`/profile/education/${educationId}`);
  } catch (error) {
    console.error('Delete Education Error:', error);
    throw new Error('Failed to delete education record. Please try again.');
  }
};