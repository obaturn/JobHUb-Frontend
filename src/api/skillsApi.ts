/**
 * Skills API - Integrated with Backend ProfileController
 * Connects to your Spring Boot backend /api/v1/auth/profile/skills endpoints
 */

import { httpGet, httpPost, httpPut, httpDelete } from './httpClient';

export interface SkillRequest {
  name: string;
  category?: string;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
}

export interface Skill {
  id: string;
  userId: string;
  name: string;
  category?: string;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all user skills - calls /api/v1/profile/skills (gateway rewrites to /api/v1/auth/profile/skills)
 */
export const getSkills = async (): Promise<Skill[]> => {
  try {
    return await httpGet<Skill[]>('/profile/skills');
  } catch (error) {
    console.error('Get Skills Error:', error);
    throw new Error('Failed to load skills. Please try again.');
  }
};

/**
 * Create a new skill - calls /api/v1/profile/skills (gateway rewrites to /api/v1/auth/profile/skills)
 */
export const createSkill = async (skillData: SkillRequest): Promise<Skill> => {
  try {
    return await httpPost<Skill>('/profile/skills', skillData);
  } catch (error) {
    console.error('Create Skill Error:', error);
    throw new Error('Failed to add skill. Please try again.');
  }
};

/**
 * Update an existing skill - calls /api/v1/profile/skills/{id} (gateway rewrites to /api/v1/auth/profile/skills/{id})
 */
export const updateSkill = async (skillId: string, skillData: SkillRequest): Promise<Skill> => {
  try {
    return await httpPut<Skill>(`/profile/skills/${skillId}`, skillData);
  } catch (error) {
    console.error('Update Skill Error:', error);
    throw new Error('Failed to update skill. Please try again.');
  }
};

/**
 * Delete a skill - calls /api/v1/profile/skills/{id} (gateway rewrites to /api/v1/auth/profile/skills/{id})
 */
export const deleteSkill = async (skillId: string): Promise<void> => {
  try {
    await httpDelete<void>(`/profile/skills/${skillId}`);
  } catch (error) {
    console.error('Delete Skill Error:', error);
    throw new Error('Failed to delete skill. Please try again.');
  }
};