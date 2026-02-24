import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job } from '../types';
import { saveJob as saveJobApi, unsaveJob as unsaveJobApi, getSavedJobs as getSavedJobsApi } from '../src/api/jobApi';

interface SavedJobsState {
  savedJobs: Job[];
  loading: boolean;
  error: string | null;
  savedJobIds: Set<number>;
  
  // Actions
  fetchSavedJobs: () => Promise<void>;
  saveJob: (job: Job) => Promise<void>;
  unsaveJob: (job: Job) => Promise<void>;
  isJobSaved: (jobId: number) => boolean;
}

export const useSavedJobsStore = create<SavedJobsState>()(
  persist(
    (set, get) => ({
      savedJobs: [],
      loading: false,
      error: null,
      savedJobIds: new Set<number>(),

      fetchSavedJobs: async () => {
        set({ loading: true, error: null });
        try {
          console.log('📥 [SavedJobsStore] Fetching saved jobs from backend...');
          const response = await getSavedJobsApi();
          
          // Transform the response to get job data
          const jobs: Job[] = response.savedJobs
            ?.map((item: any) => item.job)
            ?.filter(Boolean) || [];
          
          const jobIds = new Set(jobs.map(j => j.id));
          
          set({ 
            savedJobs: jobs, 
            savedJobIds: jobIds,
            loading: false 
          });
          console.log('✅ [SavedJobsStore] Fetched saved jobs:', jobs.length);
        } catch (error) {
          console.error('❌ [SavedJobsStore] Failed to fetch saved jobs:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch saved jobs',
            loading: false 
          });
        }
      },

      saveJob: async (job: Job) => {
        try {
          console.log('💾 [SavedJobsStore] Saving job:', job.id, job.title);
          
          // Call backend API to save job
          await saveJobApi(job.id.toString());
          
          // Update local state
          set(state => ({
            savedJobs: [job, ...state.savedJobs],
            savedJobIds: new Set([...state.savedJobIds, job.id])
          }));
          
          console.log('✅ [SavedJobsStore] Job saved successfully');
        } catch (error) {
          console.error('❌ [SavedJobsStore] Failed to save job:', error);
          // Still update local state even if API fails
          set(state => ({
            savedJobs: [job, ...state.savedJobs],
            savedJobIds: new Set([...state.savedJobIds, job.id])
          }));
        }
      },

      unsaveJob: async (job: Job) => {
        try {
          console.log('🗑️ [SavedJobsStore] Un-saving job:', job.id, job.title);
          
          // Call backend API to unsave job
          await unsaveJobApi(job.id.toString());
          
          // Update local state
          set(state => {
            const newSavedJobIds = new Set(state.savedJobIds);
            newSavedJobIds.delete(job.id);
            
            return {
              savedJobs: state.savedJobs.filter(j => j.id !== job.id),
              savedJobIds: newSavedJobIds
            };
          });
          
          console.log('✅ [SavedJobsStore] Job unsaved successfully');
        } catch (error) {
          console.error('❌ [SavedJobsStore] Failed to unsave job:', error);
          // Still update local state even if API fails
          set(state => {
            const newSavedJobIds = new Set(state.savedJobIds);
            newSavedJobIds.delete(job.id);
            
            return {
              savedJobs: state.savedJobs.filter(j => j.id !== job.id),
              savedJobIds: newSavedJobIds
            };
          });
        }
      },

      isJobSaved: (jobId: number) => {
        return get().savedJobIds.has(jobId);
      }
    }),
    {
      name: 'saved-jobs-storage',
      partialize: (state) => ({ 
        savedJobs: state.savedJobs,
        savedJobIds: Array.from(state.savedJobIds)
      }),
      onRehydrateStorage: () => (state) => {
        // Convert array back to Set after rehydration
        if (state && Array.isArray((state as any).savedJobIds)) {
          (state as any).savedJobIds = new Set((state as any).savedJobIds);
        }
      }
    }
  )
);
