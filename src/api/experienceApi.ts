/**
 * Experience API - Integrated with Backend ProfileController
 * Connects to your Spring Boot backend /api/v1/auth/profile/experience endpoints
 */

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
    console.error('Experience API Error:', error);
    throw error;
  }
};

/**
 * Get all user experiences
 */
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/profile/experience');
    return await response.json();
  } catch (error) {
    console.error('Get Experiences Error:', error);
    throw new Error('Failed to load experiences. Please try again.');
  }
};

/**
 * Create a new experience
 */
export const createExperience = async (experienceData: ExperienceRequest): Promise<Experience> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/profile/experience', {
      method: 'POST',
      body: JSON.stringify(experienceData),
    });
    return await response.json();
  } catch (error) {
    console.error('Create Experience Error:', error);
    throw new Error('Failed to add experience. Please try again.');
  }
};

/**
 * Update an existing experience
 */
export const updateExperience = async (experienceId: string, experienceData: ExperienceRequest): Promise<Experience> => {
  try {
    const response = await makeAuthenticatedRequest(`/auth/profile/experience/${experienceId}`, {
      method: 'PUT',
      body: JSON.stringify(experienceData),
    });
    return await response.json();
  } catch (error) {
    console.error('Update Experience Error:', error);
    throw new Error('Failed to update experience. Please try again.');
  }
};

/**
 * Delete an experience
 */
export const deleteExperience = async (experienceId: string): Promise<void> => {
  try {
    await makeAuthenticatedRequest(`/auth/profile/experience/${experienceId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete Experience Error:', error);
    throw new Error('Failed to delete experience. Please try again.');
  }
};