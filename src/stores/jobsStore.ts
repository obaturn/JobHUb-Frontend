import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Job, Application, SavedSearch } from '../types';
import { INITIAL_APPLICATIONS, INITIAL_SAVED_JOBS, INITIAL_SAVED_SEARCHES, EMPLOYER_JOBS } from '../constants';

export interface JobsState {
  // State
  selectedJob: Job | null;
  applications: Application[];
  savedJobs: Job[];
  savedSearches: SavedSearch[];
  employerJobs: Job[];
  loading: boolean;
  error: string | null;

  // Actions
  setSelectedJob: (job: Job | null) => void;
  applyToJob: (job: Job) => void;
  toggleSaveJob: (job: Job) => void;
  saveSearch: (query: string, filters: any) => void;
  deleteSearch: (searchId: string) => void;
  publishJob: (jobData: Partial<Job>, user: any) => void;
  setApplications: (applications: Application[]) => void;
  setSavedJobs: (jobs: Job[]) => void;
  setEmployerJobs: (jobs: Job[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeJobSeeker: () => void;
  initializeEmployer: () => void;
  clearJobsData: () => void;
}

export const useJobsStore = create<JobsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      selectedJob: null,
      applications: [],
      savedJobs: [],
      savedSearches: INITIAL_SAVED_SEARCHES,
      employerJobs: [],
      loading: false,
      error: null,

      // Actions
      setSelectedJob: (job) => {
        set({ selectedJob: job });
      },

      applyToJob: (job) => {
        const { applications } = get();
        
        // Check if already applied
        if (applications.some(app => app.job.id === job.id)) {
          return;
        }

        const newApplication: Application = {
          job,
          status: 'Applied',
          appliedDate: new Date().toISOString().split('T')[0],
        };

        set({
          applications: [newApplication, ...applications],
        });
      },

      toggleSaveJob: (job) => {
        const { savedJobs } = get();
        
        if (savedJobs.some(saved => saved.id === job.id)) {
          set({
            savedJobs: savedJobs.filter(saved => saved.id !== job.id),
          });
        } else {
          set({
            savedJobs: [job, ...savedJobs],
          });
        }
      },

      saveSearch: (query, filters) => {
        const { savedSearches } = get();
        
        const newSearch: SavedSearch = {
          id: `search-${Date.now()}`,
          query,
          filters,
          timestamp: new Date().toISOString(),
        };

        set({
          savedSearches: [newSearch, ...savedSearches],
        });
      },

      deleteSearch: (searchId) => {
        const { savedSearches } = get();
        set({
          savedSearches: savedSearches.filter(s => s.id !== searchId),
        });
      },

      publishJob: (jobData, user) => {
        if (!user || user.userType !== 'employer') return;

        const { employerJobs } = get();
        
        const newJob: Job = {
          ...jobData,
          id: Date.now(),
          company: user.experience[0]?.company || 'Innovate Inc.',
          companyId: 'innovate-inc',
          logo: user.avatar,
          posted: 'Just now',
          status: 'Published',
          applicationsCount: 0,
          viewsCount: 0,
        } as Job;

        set({
          employerJobs: [newJob, ...employerJobs],
        });
      },

      setApplications: (applications) => {
        set({ applications });
      },

      setSavedJobs: (jobs) => {
        set({ savedJobs: jobs });
      },

      setEmployerJobs: (jobs) => {
        set({ employerJobs: jobs });
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

      initializeJobSeeker: () => {
        set({
          applications: INITIAL_APPLICATIONS,
          savedJobs: INITIAL_SAVED_JOBS,
          savedSearches: INITIAL_SAVED_SEARCHES,
          employerJobs: [],
        });
      },

      initializeEmployer: () => {
        set({
          applications: [],
          savedJobs: [],
          savedSearches: [],
          employerJobs: EMPLOYER_JOBS,
        });
      },

      clearJobsData: () => {
        set({
          selectedJob: null,
          applications: [],
          savedJobs: [],
          savedSearches: INITIAL_SAVED_SEARCHES,
          employerJobs: [],
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'jobs-store',
    }
  )
);