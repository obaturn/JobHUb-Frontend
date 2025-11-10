import { create } from 'zustand';
import { User } from '../types';
import { MOCK_USER, MOCK_EMPLOYER } from '../constants';

interface AuthState {
  // User data
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // UI state
  loading: boolean;
  error: string | null;

  // Actions
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Actions
  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let user: User;
      let token = 'mock_jwt_token';

      // Mock authentication logic
      if (credentials.email === 'alex.doe@example.com') {
        user = { ...MOCK_USER, userType: 'job_seeker' };
      } else if (credentials.email === 'jane.smith@innovate.com') {
        user = { ...MOCK_EMPLOYER, userType: 'employer' };
      } else if (credentials.email === 'admin@jobhub.com') {
        user = {
          ...MOCK_USER,
          id: 'admin-001',
          name: 'Admin User',
          email: 'admin@jobhub.com',
          userType: 'admin',
          headline: 'Platform Administrator'
        };
      } else {
        throw new Error('Invalid credentials');
      }

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        loading: false
      });
      throw error;
    }
  },

  signup: async (userData) => {
    set({ loading: true, error: null });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock signup - create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        avatar: `https://picsum.photos/seed/${userData.email}/200/200`,
        headline: 'New JobHub Member',
        location: '',
        about: '',
        skills: [],
        experience: [],
        education: [],
        userType: 'job_seeker', // Will be set by onboarding
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0]
      };

      const token = 'mock_jwt_token';

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));

      set({
        user: newUser,
        token,
        isAuthenticated: true,
        loading: false
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Signup failed',
        loading: false
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  },

  updateProfile: (updates) => {
    set(state => {
      if (!state.user) return state;

      const updatedUser = { ...state.user, ...updates };

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { user: updatedUser };
    });
  },

  initialize: () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        set({
          user,
          token,
          isAuthenticated: true
        });
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }
}));