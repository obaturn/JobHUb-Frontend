import { create } from 'zustand';
import { Job } from '../types';
import { ALL_JOBS } from '../constants';

interface JobFilters {
  query?: string;
  type?: string[];
  location?: string;
  experience?: string[];
  salary?: { min?: number; max?: number };
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface JobState {
  // Data
  jobs: Job[];
  featuredJobs: Job[];
  currentJob: Job | null;
  savedJobs: Job[];

  // UI State
  loading: boolean;
  error: string | null;

  // Filters & Pagination
  filters: JobFilters;
  pagination: PaginationState;

  // Actions
  fetchJobs: (filters?: Partial<JobFilters>) => Promise<void>;
  fetchJobById: (id: number) => Promise<void>;
  setFilters: (filters: Partial<JobFilters>) => void;
  setPage: (page: number) => void;
  toggleSaveJob: (job: Job) => void;
  clearFilters: () => void;
  reset: () => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  // Initial state
  jobs: [],
  featuredJobs: ALL_JOBS.slice(0, 4),
  currentJob: null,
  savedJobs: [],

  loading: false,
  error: null,

  filters: {},
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  },

  // Actions
  fetchJobs: async (newFilters = {}) => {
    set({ loading: true, error: null });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const { filters, pagination } = get();

      // Merge filters
      const currentFilters = { ...filters, ...newFilters };
      set({ filters: currentFilters });

      // Apply filters to mock data (this logic will move to backend)
      let filteredJobs = [...ALL_JOBS];

      if (currentFilters.query) {
        const query = currentFilters.query.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills?.some(skill => skill.toLowerCase().includes(query))
        );
      }

      if (currentFilters.type?.length) {
        filteredJobs = filteredJobs.filter(job =>
          currentFilters.type!.includes(job.type)
        );
      }

      if (currentFilters.location) {
        filteredJobs = filteredJobs.filter(job =>
          job.location.toLowerCase().includes(currentFilters.location!.toLowerCase())
        );
      }

      if (currentFilters.experience?.length) {
        // This would be more complex with real data
        filteredJobs = filteredJobs.filter(job =>
          currentFilters.experience!.some(exp =>
            job.title.toLowerCase().includes(exp.toLowerCase().split(' ')[0])
          )
        );
      }

      // Apply pagination
      const total = filteredJobs.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedJobs = filteredJobs.slice(startIndex, startIndex + pagination.limit);

      set({
        jobs: paginatedJobs,
        pagination: {
          ...pagination,
          total,
          totalPages
        },
        loading: false
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
        loading: false
      });
    }
  },

  fetchJobById: async (id: number) => {
    set({ loading: true, error: null });

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const job = ALL_JOBS.find(j => j.id === id);

      if (!job) {
        throw new Error('Job not found');
      }

      set({ currentJob: job, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch job',
        loading: false
      });
    }
  },

  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } // Reset to first page
    }));
  },

  setPage: (page) => {
    set(state => ({
      pagination: { ...state.pagination, page }
    }));
    get().fetchJobs(); // Refetch with new page
  },

  toggleSaveJob: (job) => {
    set(state => {
      const isSaved = state.savedJobs.some(saved => saved.id === job.id);

      if (isSaved) {
        return {
          savedJobs: state.savedJobs.filter(saved => saved.id !== job.id)
        };
      } else {
        return {
          savedJobs: [...state.savedJobs, job]
        };
      }
    });
  },

  clearFilters: () => {
    set({
      filters: {},
      pagination: { ...get().pagination, page: 1 }
    });
  },

  reset: () => {
    set({
      jobs: [],
      currentJob: null,
      savedJobs: [],
      loading: false,
      error: null,
      filters: {},
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      }
    });
  }
}));
