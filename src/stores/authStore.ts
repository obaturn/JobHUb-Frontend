import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '../../types';
import type { LoginRequest, RegisterRequest } from '../api/authApi';

/**
 * Transform backend user response to frontend User type
 */
const transformUser = (userData: any): User => {
  const firstName = userData.firstName || userData.first_name || '';
  const lastName = userData.lastName || userData.last_name || '';
  
  return {
    id: userData.id,
    email: userData.email,
    name: `${firstName} ${lastName}`,
    avatar: userData.avatar || userData.avatar_url || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
    headline: userData.headline || '',
    location: userData.location || '',
    about: userData.about || '',
    skills: userData.skills || [],
    experience: userData.experience || [],
    education: userData.education || [],
    portfolioUrl: userData.portfolioUrl || userData.portfolio_url,
    yearsOfExperience: userData.yearsOfExperience || userData.years_of_experience,
    completedAssessments: userData.completedAssessments || [],
    userType: (userData.userType || userData.user_type) as 'job_seeker' | 'employer' | 'admin',
    status: userData.status || 'Active',
    createdDate: userData.createdAt || userData.created_at,
  };
};


export interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<User>;
  signup: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmailToken: (token: string) => Promise<void>;

  // Utility Actions
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,

        // Login Action
        login: async (credentials) => {
          console.log('🔐 Starting login for:', credentials.email);
          set({ loading: true, error: null });

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // Mock login - accept any email/password
          if (!credentials.email || !credentials.password) {
            set({
              loading: false,
              error: 'Email and password are required',
            });
            throw new Error('Email and password are required');
          }

          // Check if user exists in registered users
          const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
          const registeredUser = existingUsers[credentials.email];

          // Create mock user (use registered data if available)
          const user = transformUser({
            id: registeredUser?.id || '1',
            email: credentials.email,
            firstName: registeredUser?.firstName || 'John',
            lastName: registeredUser?.lastName || 'Doe',
            userType: registeredUser?.userType || 'job_seeker', // Use stored userType or default
            emailVerified: true,
            status: 'Active',
            avatar: '',
            phone: '',
            location: 'Remote',
          });

          // Save user to localStorage
          localStorage.setItem('user', JSON.stringify(user));

          // Update store state
          set({
            isAuthenticated: true,
            user,
            loading: false,
            error: null,
          });

          // Return user for immediate use
          return user;
        },

        // MFA no longer used in login; keep state clear no-ops

        // Signup Action
        signup: async (userData) => {
          set({ loading: true, error: null });

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          // Mock validation
          if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
            set({
              loading: false,
              error: 'All fields are required',
            });
            throw new Error('All fields are required');
          }

          // Mock signup - accept any email (no duplicate checking)
          const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');

          // Save user registration data
          const userRecord = {
            id: Date.now().toString(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userType: 'new_user', // Mark as new user for onboarding
            createdAt: new Date().toISOString(),
          };
          existingUsers[userData.email] = userRecord;
          localStorage.setItem('mockUsers', JSON.stringify(existingUsers));

          set({
            loading: false,
            error: null,
          });

          // Registration successful - user needs to verify email
          // Don't auto-login, redirect to login page with success message
        },

        // Logout Action
        logout: async () => {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 200));

          // Clear state
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });

          // Clear localStorage
          localStorage.removeItem('user');
        },

        // Fetch Current User
        fetchUser: async () => {
          set({ loading: true, error: null });

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));

          // Get user from localStorage
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            const user = transformUser(userData);

            set({
              user,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            set({
              loading: false,
              error: 'No user found',
            });
            throw new Error('No user found');
          }
        },


        // Forgot Password
        forgotPassword: async (email) => {
          set({ loading: true, error: null });

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          set({
            loading: false,
            error: null,
          });
        },

        // Reset Password
        resetPassword: async (token, password) => {
          set({ loading: true, error: null });

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          set({
            loading: false,
            error: null,
          });
        },

        // Verify Email
        verifyEmailToken: async (token) => {
          set({ loading: true, error: null });

          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));

          set({
            loading: false,
            error: null,
          });
        },

        // Utility Actions
        setUser: (user) => {
          set({ user });
        },

        setLoading: (loading) => {
          set({ loading });
        },

        setError: (error) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);