import { create } from 'zustand';
import { User } from '@/types';
import * as authApi from '@/src/api/authApi';

interface MFAState {
  requiresMFA: boolean;
  mfaToken: string | null;
  mfaMethods: string[];
}

interface AuthState {
  // User data
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // MFA state
  mfaState: MFAState;

  // UI state
  loading: boolean;
  error: string | null;

  // Actions
  login: (credentials: { email: string; password: string; deviceId?: string }) => Promise<void>;
  completeMFALogin: (tokens: { accessToken: string; user: any; expiresIn: number }) => void;
  signup: (userData: { name: string; email: string; password: string; userType?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  initialize: () => Promise<void>;
  clearMFAState: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  mfaState: {
    requiresMFA: false,
    mfaToken: null,
    mfaMethods: [],
  },
  loading: false,
  error: null,

  // Clear MFA state
  clearMFAState: () => {
    set({
      mfaState: {
        requiresMFA: false,
        mfaToken: null,
        mfaMethods: [],
      },
    });
  },

  // Set token (called by httpClient interceptor)
  setToken: (token: string) => {
    set({ token });
    localStorage.setItem('accessToken', token);
  },

  // Actions
  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const response = await authApi.login({
        email: credentials.email,
        password: credentials.password,
      });

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        loading: false,
        mfaState: { requiresMFA: false, mfaToken: null, mfaMethods: [] },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({
        error: message,
        loading: false,
      });
      throw error;
    }
  },

  // Complete MFA login
  completeMFALogin: (tokens) => {
    const { accessToken, user, expiresIn } = tokens;

    // Store tokens and user data
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    set({
      user,
      token: accessToken,
      isAuthenticated: true,
      mfaState: {
        requiresMFA: false,
        mfaToken: null,
        mfaMethods: [],
      },
    });
  },

  signup: async (userData) => {
    set({ loading: true, error: null });

    try {
      const response = await authApi.signup({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        userType: userData.userType || 'job_seeker',
      });

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.accessToken,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      set({ error: message, loading: false });
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refreshToken(refreshToken);

      // Store new tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      set({ token: response.accessToken });
    } catch (error) {
      // Refresh failed, clear auth state and redirect to login
      get().logout();
      throw error;
    }
  },

  logout: async () => {
    try {
      // Attempt to call logout endpoint (best effort)
      await authApi.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    }

    // Clear local state
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      mfaState: {
        requiresMFA: false,
        mfaToken: null,
        mfaMethods: [],
      },
      loading: false,
      error: null,
    });
  },

  updateProfile: (updates) => {
    set((state) => {
      if (!state.user) return state;

      const updatedUser = { ...state.user, ...updates };

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { user: updatedUser };
    });
  },

  initialize: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      const userString = localStorage.getItem('user');

      // Try to restore session from tokens
      if (accessToken && userString) {
        try {
          const user = JSON.parse(userString);
          set({
            user,
            token: accessToken,
            isAuthenticated: true,
          });
          return; // Session restored from localStorage
        } catch (error) {
          console.warn('Failed to parse stored user:', error);
        }
      }

      // If access token expired but refresh token exists, try to refresh
      if (refreshToken && !accessToken) {
        try {
          await get().refreshToken();
          return; // Session restored via refresh
        } catch (error) {
          console.warn('Failed to refresh token on initialization:', error);
        }
      }

      // If we have both tokens, try to refresh to get current user data
      if (refreshToken && accessToken) {
        try {
          const response = await authApi.refreshToken(refreshToken);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          // Get current user
          const user = await authApi.getCurrentUser();
          localStorage.setItem('user', JSON.stringify(user));

          set({
            user,
            token: response.accessToken,
            isAuthenticated: true,
          });
          return;
        } catch (error) {
          console.warn('Failed to refresh session:', error);
        }
      }

      // No valid session
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error during auth initialization:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },
}));