import { create } from 'zustand';
import { Job } from '../types';
import { httpGet } from '../src/api/httpClient';

interface SharedJobsState {
  allJobs: Job[];
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
  
  // Actions
  fetchAllJobs: () => Promise<void>;
  addJob: (job: Job) => void;
  updateJob: (jobId: number, updates: Partial<Job>) => void;
  deleteJob: (jobId: number) => void;
  refreshJobs: () => Promise<void>;
  clearJobs: () => void;
}

export const useSharedJobsStore = create<SharedJobsState>((set, get) => ({
  allJobs: [],
  loading: false,
  error: null,
  lastFetched: null,

  // Fetch all published jobs from backend using httpClient
  fetchAllJobs: async () => {
    set({ loading: true, error: null });
    
    try {
      console.log('🔍 [SharedJobsStore] Fetching jobs from backend...');
      
      // Use httpClient for consistent URL handling and auth
      const data = await httpGet('/jobs?status=Published');
      
      // Handle both array response and object with jobs array
      const jobs = Array.isArray(data) ? data : (data as any).jobs || [];
      
      console.log('✅ [SharedJobsStore] Fetched jobs:', jobs.length);
      
      set({ 
        allJobs: jobs, 
        loading: false,
        lastFetched: new Date()
      });
    } catch (error) {
      console.error('❌ [SharedJobsStore] Failed to fetch jobs:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
        loading: false 
      });
    }
  },

  // Add newly posted job immediately to the store
  addJob: (job: Job) => {
    console.log('➕ [SharedJobsStore] Adding new job:', job.title);
    set(state => ({
      allJobs: [job, ...state.allJobs]  // Add to beginning (most recent first)
    }));
  },

  // Update existing job in the store
  updateJob: (jobId: number, updates: Partial<Job>) => {
    console.log('📝 [SharedJobsStore] Updating job:', jobId);
    set(state => ({
      allJobs: state.allJobs.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      )
    }));
  },

  // Delete job from the store
  deleteJob: (jobId: number) => {
    console.log('🗑️ [SharedJobsStore] Deleting job:', jobId);
    set(state => ({
      allJobs: state.allJobs.filter(job => job.id !== jobId)
    }));
  },

  // Refresh jobs from backend (force reload)
  refreshJobs: async () => {
    console.log('🔄 [SharedJobsStore] Refreshing jobs...');
    await get().fetchAllJobs();
  },

  // Clear all jobs from store
  clearJobs: () => {
    console.log('🧹 [SharedJobsStore] Clearing all jobs');
    set({ allJobs: [], lastFetched: null });
  }
}));
