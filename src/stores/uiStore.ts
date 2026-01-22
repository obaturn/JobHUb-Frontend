import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Page } from '../types';

export interface UIState {
  // State
  currentPage: Page;
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  modals: Record<string, boolean>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  showOnboarding: boolean;

  // Actions
  navigate: (page: Page) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string) => void;
  clearError: (key: string) => void;
  clearAllErrors: () => void;
  setShowOnboarding: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentPage: 'landing',
        theme: 'dark',
        sidebarOpen: false,
        modals: {},
        loading: {},
        errors: {},
        showOnboarding: false,

        // Actions
        navigate: (page) => {
          set({ currentPage: page });
          window.scrollTo(0, 0);
        },

        setTheme: (theme) => {
          set({ theme });
          
          // Apply theme to document
          const root = document.documentElement;
          root.classList.remove('light', 'dark');
          
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
            root.style.colorScheme = systemTheme;
          } else {
            root.classList.add(theme);
            root.style.colorScheme = theme;
          }
        },

        toggleTheme: () => {
          const { theme } = get();
          const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
          const currentIndex = themes.indexOf(theme);
          const nextTheme = themes[(currentIndex + 1) % themes.length];
          get().setTheme(nextTheme);
        },

        setSidebarOpen: (open) => {
          set({ sidebarOpen: open });
        },

        toggleSidebar: () => {
          const { sidebarOpen } = get();
          set({ sidebarOpen: !sidebarOpen });
        },

        openModal: (modalId) => {
          set((state) => ({
            modals: { ...state.modals, [modalId]: true },
          }));
        },

        closeModal: (modalId) => {
          set((state) => ({
            modals: { ...state.modals, [modalId]: false },
          }));
        },

        toggleModal: (modalId) => {
          const { modals } = get();
          const isOpen = modals[modalId] || false;
          set({
            modals: { ...modals, [modalId]: !isOpen },
          });
        },

        setLoading: (key, loading) => {
          set((state) => ({
            loading: { ...state.loading, [key]: loading },
          }));
        },

        setError: (key, error) => {
          set((state) => ({
            errors: { ...state.errors, [key]: error },
          }));
        },

        clearError: (key) => {
          set((state) => {
            const { [key]: _, ...rest } = state.errors;
            return { errors: rest };
          });
        },

        clearAllErrors: () => {
          set({ errors: {} });
        },

        setShowOnboarding: (show) => {
          set({ showOnboarding: show });
        },
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);