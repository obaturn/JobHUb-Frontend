/**
 * Experience API - Integrated with Backend ProfileController
 * Connects to your Spring Boot backend /api/v1/auth/profile/experience endpoints
 */

import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';

export interface ExperienceRequest {
  companyName: string;
  jobTitle: string;
  location?: string;
  remote: boolean;
  startDate: string;
  endDate?: string;
  currentPosition: boolean;
  description?: string;
  employmentType?: string;
}

export interface Experience {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  location?: string;
  remote: boolean;
  startDate: string;
  endDate?: string;
  currentPosition: boolean;
  description?: string;
  employmentType?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all user experiences - calls /api/v1/profile/experience (gateway rewrites to /api/v1/auth/profile/experience)
 */
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    return await httpGet<Experience[]>('/profile/experience');
  } catch (error) {
    console.error('Get Experiences Error:', error);
    throw new Error('Failed to load experiences. Please try again.');
  }
};

/**
 * Create a new experience - calls /api/v1/profile/experience (gateway rewrites to /api/v1/auth/profile/experience)
 */
export const createExperience = async (experienceData: ExperienceRequest): Promise<Experience> => {
  try {
    return await httpPost<Experience>('/profile/experience', experienceData);
  } catch (error) {
    console.error('Create Experience Error:', error);
    throw new Error('Failed to add experience. Please try again.');
  }
};

/**
 * Update an existing experience - calls /api/v1/profile/experience/{id} (gateway rewrites to /api/v1/auth/profile/experience/{id})
 */
export const updateExperience = async (experienceId: string, experienceData: ExperienceRequest): Promise<Experience> => {
  try {
    return await httpPut<Experience>(`/profile/experience/${experienceId}`, experienceData);
  } catch (error) {
    console.error('Update Experience Error:', error);
    throw new Error('Failed to update experience. Please try again.');
  }
};

/**
 * Delete an experience - calls /api/v1/profile/experience/{id} (gateway rewrites to /api/v1/auth/profile/experience/{id})
 */
export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    await httpDelete<void>(`/profile/experience/${experienceId}`);
  } catch (error) {
    console.error('Delete Experience Error:', error);
    throw new Error('Failed to delete experience. Please try again.');
  }
};