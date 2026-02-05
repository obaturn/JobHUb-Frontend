/**
 * Skills API - Integrated with Backend ProfileController
 * Connects to your Spring Boot backend /api/v1/auth/profile/skills endpoints
 */

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
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error('Skills API Error:', error);
    throw error;
  }
};

/**
 * Get all user skills
 */
export const getSkills = async (): Promise<Skill[]> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/profile/skills');
    return await response.json();
  } catch (error) {
    console.error('Get Skills Error:', error);
    throw new Error('Failed to load skills. Please try again.');
  }
};

/**
 * Create a new skill
 */
export const createSkill = async (skillData: SkillRequest): Promise<Skill> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/profile/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
    return await response.json();
  } catch (error) {
    console.error('Create Skill Error:', error);
    throw new Error('Failed to add skill. Please try again.');
  }
};

/**
 * Update an existing skill
 */
export const updateSkill = async (skillId: string, skillData: SkillRequest): Promise<Skill> => {
  try {
    const response = await makeAuthenticatedRequest(`/auth/profile/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(skillData),
    });
    return await response.json();
  } catch (error) {
    console.error('Update Skill Error:', error);
    throw new Error('Failed to update skill. Please try again.');
  }
};

/**
 * Delete a skill
 */
export const deleteSkill = async (skillId: string): Promise<void> => {
  try {
    await makeAuthenticatedRequest(`/auth/profile/skills/${skillId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete Skill Error:', error);
    throw new Error('Failed to delete skill. Please try again.');
  }
};