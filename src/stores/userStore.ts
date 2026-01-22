import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Resume, CompletedAssessment, UserPost, ConnectionRequest, Conversation } from '../types';
import { MOCK_RESUMES, MOCK_COMPLETED_ASSESSMENTS, MOCK_POSTS, MOCK_CONNECTION_REQUESTS, MOCK_CONVERSATIONS } from '../constants';

export interface UserState {
  // State
  resumes: Resume[];
  completedAssessments: CompletedAssessment[];
  posts: UserPost[];
  connectionRequests: ConnectionRequest[];
  conversations: Conversation[];
  selectedCompanyId: string | null;
  jobToPractice: any | null;

  // Actions
  setResumes: (resumes: Resume[]) => void;
  uploadResume: (fileName: string, fileContent: string) => void;
  deleteResume: (resumeId: string) => void;
  setPrimaryResume: (resumeId: string) => void;
  setCompletedAssessments: (assessments: CompletedAssessment[]) => void;
  completeAssessment: (assessment: CompletedAssessment) => void;
  setPosts: (posts: UserPost[]) => void;
  createPost: (content: string, user: any) => void;
  setConnectionRequests: (requests: ConnectionRequest[]) => void;
  handleConnectionRequest: (requestId: string, action: 'accept' | 'ignore') => void;
  setConversations: (conversations: Conversation[]) => void;
  setSelectedCompanyId: (companyId: string | null) => void;
  setJobToPractice: (job: any | null) => void;
  initializeUserData: (userType: 'job_seeker' | 'employer' | 'admin') => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // Initial state
      resumes: MOCK_RESUMES,
      completedAssessments: MOCK_COMPLETED_ASSESSMENTS,
      posts: MOCK_POSTS,
      connectionRequests: MOCK_CONNECTION_REQUESTS,
      conversations: MOCK_CONVERSATIONS,
      selectedCompanyId: null,
      jobToPractice: null,

      // Actions
      setResumes: (resumes) => {
        set({ resumes });
      },

      uploadResume: (fileName, fileContent) => {
        const { resumes } = get();
        const newResume: Resume = {
          id: `resume-${Date.now()}`,
          fileName,
          uploadDate: new Date().toISOString().split('T')[0],
          isPrimary: resumes.length === 0,
          textContent: fileContent,
        };

        set({
          resumes: [newResume, ...resumes],
        });
      },

      deleteResume: (resumeId) => {
        const { resumes } = get();
        const newResumes = resumes.filter(r => r.id !== resumeId);
        
        // If the deleted resume was primary, make the first one primary
        if (newResumes.length > 0 && !newResumes.some(r => r.isPrimary)) {
          newResumes[0].isPrimary = true;
        }

        set({ resumes: newResumes });
      },

      setPrimaryResume: (resumeId) => {
        const { resumes } = get();
        const updatedResumes = resumes.map(r => ({
          ...r,
          isPrimary: r.id === resumeId,
        }));

        set({ resumes: updatedResumes });
      },

      setCompletedAssessments: (assessments) => {
        set({ completedAssessments: assessments });
      },

      completeAssessment: (assessment) => {
        const { completedAssessments } = get();
        
        // Update if already exists, otherwise add new
        const existingIndex = completedAssessments.findIndex(
          a => a.assessmentId === assessment.assessmentId
        );

        let updatedAssessments;
        if (existingIndex > -1) {
          updatedAssessments = [...completedAssessments];
          updatedAssessments[existingIndex] = assessment;
        } else {
          updatedAssessments = [assessment, ...completedAssessments];
        }

        set({ completedAssessments: updatedAssessments });
      },

      setPosts: (posts) => {
        set({ posts });
      },

      createPost: (content, user) => {
        if (!user) return;

        const { posts } = get();
        const newPost: UserPost = {
          id: `post-${Date.now()}`,
          author: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            headline: user.headline,
          },
          content,
          timestamp: 'Just now',
          likes: 0,
          comments: 0,
        };

        set({
          posts: [newPost, ...posts],
        });
      },

      setConnectionRequests: (requests) => {
        set({ connectionRequests: requests });
      },

      handleConnectionRequest: (requestId, action) => {
        const { connectionRequests } = get();
        const updatedRequests = connectionRequests.filter(req => req.id !== requestId);

        if (action === 'accept') {
          // In a real app, you'd add this user to a "connections" list
          console.log(`Accepted request ${requestId}`);
        }

        set({ connectionRequests: updatedRequests });
      },

      setConversations: (conversations) => {
        set({ conversations });
      },

      setSelectedCompanyId: (companyId) => {
        set({ selectedCompanyId: companyId });
      },

      setJobToPractice: (job) => {
        set({ jobToPractice: job });
      },

      initializeUserData: (userType) => {
        switch (userType) {
          case 'job_seeker':
            set({
              resumes: MOCK_RESUMES,
              completedAssessments: MOCK_COMPLETED_ASSESSMENTS,
              posts: MOCK_POSTS,
              connectionRequests: MOCK_CONNECTION_REQUESTS,
              conversations: MOCK_CONVERSATIONS,
            });
            break;
          case 'employer':
            set({
              resumes: [],
              completedAssessments: [],
              posts: [],
              connectionRequests: [],
              conversations: MOCK_CONVERSATIONS,
            });
            break;
          case 'admin':
            set({
              resumes: [],
              completedAssessments: [],
              posts: [],
              connectionRequests: [],
              conversations: [],
            });
            break;
        }
      },

      clearUserData: () => {
        set({
          resumes: [],
          completedAssessments: [],
          posts: [],
          connectionRequests: [],
          conversations: [],
          selectedCompanyId: null,
          jobToPractice: null,
        });
      },
    }),
    {
      name: 'user-store',
    }
  )
);