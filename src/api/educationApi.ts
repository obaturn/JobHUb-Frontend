/**
 * Education API - Integrated with Backend ProfileController
 * Connects to your Spring Boot backend /api/v1/auth/profile/education endpoints
 */

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
    console.error('Education API Error:', error);
    throw error;
  }
};

/**
 * Get all user education records
 */
export const getEducations = async (): Promise<Education[]> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/profile/education');
    return await response.json();
  } catch (error) {
    console.error('Get Educations Error:', error);
    throw new Error('Failed to load education records. Please try again.');
  }
};

/**
 * Create a new education record
 */
export const createEducation = async (educationData: EducationRequest): Promise<Education> => {
  try {
    const response = await makeAuthenticatedRequest('/auth/profile/education', {
      method: 'POST',
      body: JSON.stringify(educationData),
    });
    return await response.json();
  } catch (error) {
    console.error('Create Education Error:', error);
    throw new Error('Failed to add education record. Please try again.');
  }
};

/**
 * Update an existing education record
 */
export const updateEducation = async (educationId: string, educationData: EducationRequest): Promise<Education> => {
  try {
    const response = await makeAuthenticatedRequest(`/auth/profile/education/${educationId}`, {
      method: 'PUT',
      body: JSON.stringify(educationData),
    });
    return await response.json();
  } catch (error) {
    console.error('Update Education Error:', error);
    throw new Error('Failed to update education record. Please try again.');
  }
};

/**
 * Delete an education record
 */
export const deleteEducation = async (educationId: string): Promise<void> => {
  try {
    await makeAuthenticatedRequest(`/auth/profile/education/${educationId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Delete Education Error:', error);
    throw new Error('Failed to delete education record. Please try again.');
  }
};