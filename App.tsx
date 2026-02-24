

import React, { useState, useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useUserStore } from './src/stores/userStore';
import { useSharedJobsStore } from './stores/useSharedJobsStore';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedJobs from './components/FeaturedJobs';
import RotatingCarousel from './components/RotatingCarousel';
import Stats from './components/Stats';
import JobCategories from './components/JobCategories';
import Testimonials from './components/Testimonials';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import JobSearchPage from './pages/JobSearchPage';
import JobDetailsPage from './pages/JobDetailsPage';
import AboutPage from './pages/AboutPage';
import ForEmployersPage from './pages/ForEmployersPage';
import ForJobSeekersPage from './pages/ForJobSeekersPage';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import LazySection from './src/components/LazySection';
import MarketInsightsSection from './src/components/InsightsSection';
import { debugTokens, clearAllTokens } from './src/utils/tokenDebug';
import analytics from './src/utils/analytics';

// Lazy load heavy components for better performance
const JobSeekerDashboardPage = lazy(() => import('./pages/JobSeekerDashboardPage'));
const EmployerDashboardPage = lazy(() => import('./pages/EmployerDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const UniversalDashboardPage = lazy(() => import('./pages/UniversalDashboardPage'));
const CompanyProfilePage = lazy(() => import('./components/company/CompanyProfilePage'));
const CompaniesDirectoryPage = lazy(() => import('./pages/CompaniesDirectoryPage'));
const LinkedInStyleDashboard = lazy(() => import('./components/LinkedInStyleDashboard'));
const TestFeaturesPage = lazy(() => import('./pages/TestFeaturesPage'));
const MessagingPage = lazy(() => import('./pages/MessagingPage'));
const CreateJobPage = lazy(() => import('./pages/CreateJobPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
import ChatBot from './components/ChatBot';
import { User, Job, Application, Company, SavedSearch, Resume, Notification, Conversation, CompletedAssessment, Page, UserPost, ConnectionRequest } from './types';
import { MOCK_USER, INITIAL_APPLICATIONS, INITIAL_SAVED_JOBS, MOCK_EMPLOYER, MOCK_ADMIN, MOCK_COMPANIES, INITIAL_SAVED_SEARCHES, MOCK_RESUMES, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS, MOCK_COMPLETED_ASSESSMENTS, EMPLOYER_JOBS, MOCK_POSTS, MOCK_CONNECTION_REQUESTS } from './constants';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import VideoHighlights from './components/VideoHighlights';
import ChooseYourPath from './components/ChooseYourPath';

const App: React.FC = () => {
  // Auth store
  const {
    isAuthenticated: storeIsAuthenticated,
    user: storeUser,
    initialize
  } = useAuthStore();

  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(storeIsAuthenticated);
  const [user, setUser] = useState<User | null>(storeUser);
  const [userType, setUserType] = useState<'new_user' | 'job_seeker' | 'employer' | 'admin' | null>(
    storeUser?.userType || null
  );
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(INITIAL_SAVED_SEARCHES);
  const { resumes: userResumes, setResumes: setUserResumes } = useUserStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  
  // Initialize resumes from userStore on mount
  useEffect(() => {
    if (userResumes && userResumes.length > 0) {
      setResumes(userResumes);
    }
  }, [userResumes]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [completedAssessments, setCompletedAssessments] = useState<CompletedAssessment[]>(MOCK_COMPLETED_ASSESSMENTS);
  const [posts, setPosts] = useState<UserPost[]>(MOCK_POSTS);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>(MOCK_CONNECTION_REQUESTS);
  const [jobToPractice, setJobToPractice] = useState<Job | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // State for employer jobs
  const [employerJobs, setEmployerJobs] = useState<Job[]>(EMPLOYER_JOBS);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    
    // Track page navigation
    analytics.trackPageView(page);
    
    // Update browser URL to match the page
    const urlMap: Record<Page, string> = {
      'landing': '/',
      'login': '/login',
      'signup': '/signup',
      'email_verification': '/verify-email',
      'forgot_password': '/forgot-password',
      'onboarding': '/onboarding',
      'job_search': '/job-search',
      'companies_directory': '/companies',
      'job_details': '/job-details',
      'company_profile': '/company-profile',
      'messaging': '/messaging',
      'universal_dashboard': '/dashboard',
      'adaptive_dashboard': '/dashboard/adaptive',
      'linkedin_dashboard': '/dashboard/linkedin',
      'test_features': '/test-features',
      'job_seeker_dashboard': '/dashboard/job-seeker',
      'employer_dashboard': '/dashboard/employer',
      'admin_dashboard': '/dashboard/admin',
      'create_job': '/create-job',
      'about': '/about',
      'for_employers': '/for-employers',
      'for_job_seekers': '/for-job-seekers'
    };
    
    const newUrl = urlMap[page] || '/';
    
    // Update URL without triggering a page reload
    if (window.location.pathname !== newUrl) {
      window.history.pushState({}, '', newUrl);
      console.log('🔗 [App] Updated URL to:', newUrl);
    }
    
    window.scrollTo(0, 0);
  };

  // Sync auth state with store
  useEffect(() => {
    setIsAuthenticated(storeIsAuthenticated);
    setUser(storeUser);
    setUserType(storeUser?.userType || null);
  }, [storeIsAuthenticated, storeUser]);

  // Initialize auth on app mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Debug tokens in development
        if (process.env.NODE_ENV === 'development') {
          debugTokens();
        }
        
        // Clear any invalid tokens first
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');
        
        // Helper to check token validity
        const isValidTokenStr = (token: string | null): boolean => {
          return token !== null && token !== 'undefined' && token !== 'null' && token.trim() !== '';
        };
        
        // Clear invalid tokens
        if (!isValidTokenStr(refreshToken)) {
          console.warn('🧹 [App] Clearing invalid refresh token:', refreshToken);
          localStorage.removeItem('refreshToken');
        }
        if (!isValidTokenStr(accessToken)) {
          console.warn('🧹 [App] Clearing invalid access token:', accessToken);
          localStorage.removeItem('accessToken');
        }
        
        await initialize();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initAuth();
  }, [initialize]);

  // Check URL for routing on page load/refresh
  useEffect(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    console.log('🔗 [App] Checking URL for routing:', { path, search: window.location.search });
    
    // Route based on URL path - More comprehensive routing
    if (path === '/verify-email' && searchParams.has('token')) {
      console.log('🔐 [App] Detected email verification link, navigating to email_verification page');
      setCurrentPage('email_verification');
    } else if (path === '/login') {
      console.log('🔐 [App] Detected login page, navigating to login');
      setCurrentPage('login');
    } else if (path === '/signup') {
      console.log('🔐 [App] Detected signup page, navigating to signup');
      setCurrentPage('signup');
    } else if (path === '/forgot-password') {
      console.log('🔐 [App] Detected forgot password page, navigating to forgot_password');
      setCurrentPage('forgot_password');
    } else if (path === '/job-search') {
      console.log('🔐 [App] Detected job search page, navigating to job_search');
      setCurrentPage('job_search');
    } else if (path === '/companies') {
      console.log('🔐 [App] Detected companies directory page, navigating to companies_directory');
      setCurrentPage('companies_directory');
    } else if (path === '/about') {
      console.log('🔐 [App] Detected about page, navigating to about');
      setCurrentPage('about');
    } else if (path === '/dashboard/job-seeker' || path === '/dashboard') {
      console.log('🔐 [App] Detected job seeker dashboard, checking auth');
      if (isAuthenticated && userType === 'job_seeker') {
        setCurrentPage('job_seeker_dashboard');
      } else {
        setCurrentPage('login');
      }
    } else if (path === '/dashboard/employer') {
      console.log('🔐 [App] Detected employer dashboard, checking auth');
      if (isAuthenticated && userType === 'employer') {
        setCurrentPage('employer_dashboard');
      } else {
        setCurrentPage('login');
      }
    } else if (path === '/dashboard/admin') {
      console.log('🔐 [App] Detected admin dashboard, checking auth');
      if (isAuthenticated && userType === 'admin') {
        setCurrentPage('admin_dashboard');
      } else {
        setCurrentPage('login');
      }
    } else if (path === '/messaging') {
      console.log('🔐 [App] Detected messaging page, checking auth');
      if (isAuthenticated) {
        setCurrentPage('messaging');
      } else {
        setCurrentPage('login');
      }
    } else if (path === '/create-job') {
      console.log('🔐 [App] Detected create job page, checking auth');
      if (isAuthenticated && userType === 'employer') {
        setCurrentPage('create_job');
      } else {
        setCurrentPage('login');
      }
    } else {
      console.log('🔐 [App] Default route, staying on landing page');
      setCurrentPage('landing');
    }
    
    window.scrollTo(0, 0);
  }, [isAuthenticated, userType]); // Add dependencies

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      
      console.log('🔙 [App] Browser navigation detected:', { path, search: window.location.search });
      
      // Route based on URL path
      if (path === '/verify-email' && searchParams.has('token')) {
        setCurrentPage('email_verification');
      } else if (path === '/login') {
        setCurrentPage('login');
      } else if (path === '/signup') {
        setCurrentPage('signup');
      } else if (path === '/forgot-password') {
        setCurrentPage('forgot_password');
      } else if (path === '/job-search') {
        setCurrentPage('job_search');
      } else if (path === '/companies') {
        setCurrentPage('companies_directory');
      } else if (path === '/about') {
        setCurrentPage('about');
      } else {
        setCurrentPage('landing');
      }
      
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogin = async () => {
    console.log('Login success callback triggered');

    // Get current user from store (should be set by login function)
    const currentUser = useAuthStore.getState().user;
    console.log('Current user from store:', currentUser);

    if (currentUser) {
      setIsAuthenticated(true);
      setUser(currentUser);
      setUserType(currentUser.userType);

      // Track login event
      analytics.setUserId(currentUser.id);
      analytics.trackLogin('email');

      // Navigate based on user type
      if (currentUser.userType === 'new_user') {
        console.log('New user detected, showing onboarding');
        setShowOnboarding(true);
      } else if (currentUser.userType === 'job_seeker') {
        console.log('Navigating to job seeker dashboard');
        
        // Fetch real applications from backend for this user
        try {
          const { getUserApplications } = await import('./src/api/applicationApi');
          const response = await getUserApplications();
          
          console.log('🔍 [App] Backend response:', response);
          console.log('🔍 [App] Response.applications:', response.applications);
          console.log('🔍 [App] Response type:', typeof response);
          console.log('🔍 [App] Response keys:', Object.keys(response));
          
          // Map backend applications to frontend format
          const mappedApplications = response.applications.map(app => {
            console.log('🔍 [App] Mapping application:', {
              id: app.id,
              jobId: app.jobId,
              jobTitle: app.jobTitle,
              status: app.status
            });
            
            return {
              jobId: app.jobId, // Store backend jobId for comparison
              job: {
                id: app.jobId,
                title: app.jobTitle || 'Job Title',
                company: app.companyName || 'Company',
                companyId: '',
                logo: 'https://via.placeholder.com/100',
                location: 'Location',
                type: 'Full-time' as const,
                posted: 'Recently',
                description: '',
                skills: []
              },
              status: app.status === 'APPLIED' ? 'APPLIED' as const :
                     app.status === 'RESUME_VIEWED' ? 'RESUME_VIEWED' as const :
                     app.status === 'IN_REVIEW' ? 'IN_REVIEW' as const :
                     app.status === 'SHORTLISTED' ? 'SHORTLISTED' as const :
                     app.status === 'INTERVIEW' ? 'INTERVIEW' as const :
                     app.status === 'OFFERED' ? 'OFFERED' as const :
                     app.status === 'REJECTED' ? 'REJECTED' as const :
                     app.status === 'WITHDRAWN' ? 'WITHDRAWN' as const :
                     'APPLIED' as const,
              appliedDate: app.appliedDate
            };
          });
          
          console.log('✅ Fetched user applications:', mappedApplications.length, 'applications');
          console.log('📋 Application job IDs:', mappedApplications.map(a => a.jobId));
          setApplications(mappedApplications);
        } catch (error) {
          console.error('❌ Failed to fetch applications, using empty array:', error);
          setApplications([]); // Start fresh instead of mock data
        }
        
        setSavedJobs(INITIAL_SAVED_JOBS);
        setNotifications(MOCK_NOTIFICATIONS);
        setConversations(MOCK_CONVERSATIONS);
        setCompletedAssessments(MOCK_USER.completedAssessments || []);
        setConnectionRequests(MOCK_CONNECTION_REQUESTS);
        navigate('job_seeker_dashboard');
      } else if (currentUser.userType === 'employer') {
        console.log('Navigating to employer dashboard');
        setApplications([]);
        setSavedJobs([]);
        setNotifications(MOCK_NOTIFICATIONS.slice(0,1));
        setConversations(MOCK_CONVERSATIONS);
        navigate('employer_dashboard');
      } else if (currentUser.userType === 'admin') {
        console.log('Navigating to admin dashboard');
        setApplications([]);
        setSavedJobs([]);
        setNotifications([]);
        setConversations([]);
        navigate('admin_dashboard');
      }
    } else {
      console.error('No user found in store after login!');
    }
  };

  const handleEmployerLogin = handleLogin;
  const handleAdminLogin = handleLogin;

  const handleLogout = async () => {
    // Track logout event
    analytics.trackLogout();
    analytics.clearUserId();
    
    // Call store logout
    await useAuthStore.getState().logout();
    
    // Clear local state
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
    setApplications([]);
    setSavedJobs([]);
    setSelectedJob(null);
    setSelectedCompanyId(null);
    setNotifications([]);
    setConversations([]);
    setConnectionRequests([]);
    setShowOnboarding(false);
    navigate('landing');
  };

  const handleOnboardingComplete = async (selectedUserType: 'job_seeker' | 'employer') => {
    // Update user type in store
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, userType: selectedUserType };
      useAuthStore.getState().updateProfile({ userType: selectedUserType });

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update local state
      setUserType(selectedUserType);
      setUser(updatedUser);
    }

    setShowOnboarding(false);
    if (selectedUserType === 'job_seeker') {
      // Fetch real applications from backend
      try {
        const { getUserApplications } = await import('./src/api/applicationApi');
        const response = await getUserApplications();
        
        const mappedApplications = response.applications.map(app => ({
          jobId: app.jobId, // Store backend jobId for comparison
          job: {
            id: app.jobId,
            title: app.jobTitle || 'Job Title',
            company: app.companyName || 'Company',
            companyId: '',
            logo: 'https://via.placeholder.com/100',
            location: 'Location',
            type: 'Full-time' as const,
            posted: 'Recently',
            description: '',
            skills: []
          },
          status: app.status === 'APPLIED' ? 'APPLIED' as const :
                 app.status === 'RESUME_VIEWED' ? 'RESUME_VIEWED' as const :
                 app.status === 'IN_REVIEW' ? 'IN_REVIEW' as const :
                 app.status === 'SHORTLISTED' ? 'SHORTLISTED' as const :
                 app.status === 'INTERVIEW' ? 'INTERVIEW' as const :
                 app.status === 'OFFERED' ? 'OFFERED' as const :
                 app.status === 'REJECTED' ? 'REJECTED' as const :
                 app.status === 'WITHDRAWN' ? 'WITHDRAWN' as const :
                 'APPLIED' as const,
          appliedDate: app.appliedDate
        }));
        
        console.log('✅ Fetched user applications:', mappedApplications.length, 'applications');
        setApplications(mappedApplications);
      } catch (error) {
        console.error('❌ Failed to fetch applications:', error);
        setApplications([]); // Start with empty for new users
      }
      
      setSavedJobs(INITIAL_SAVED_JOBS);
      setNotifications(MOCK_NOTIFICATIONS);
      setConversations(MOCK_CONVERSATIONS);
      setCompletedAssessments(MOCK_USER.completedAssessments || []);
      setConnectionRequests(MOCK_CONNECTION_REQUESTS);
      navigate('job_seeker_dashboard');
    } else {
      setApplications([]);
      setSavedJobs([]);
      setNotifications(MOCK_NOTIFICATIONS.slice(0,1));
      setConversations(MOCK_CONVERSATIONS);
      navigate('employer_dashboard');
    }
  };
  
  const handleViewJobDetails = (job: Job) => {
    setSelectedJob(job);
    navigate('job_details');
  };

  const handleViewCompanyProfile = (companyId: string) => {
    setSelectedCompanyId(companyId);
    navigate('company_profile');
  };
  
  // REMOVED: localStorage loading for applications (backend is source of truth)
  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('jobhub_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        console.log('📂 Loaded notifications from localStorage:', parsed.length);
      } catch (e) {
        console.error('Failed to parse notifications from localStorage:', e);
      }
    }
  }, []);

  // REMOVED: Save applications to localStorage (backend is source of truth)
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('jobhub_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const handleApplyJob = async (job: Job, applicationData?: any) => {
    // Check if already applied using jobId (more reliable than job.id)
    const jobIdToCheck = typeof job.id === 'number' ? job.id : parseInt(String(job.id), 10);
    if (applications.some(app => app.jobId === jobIdToCheck || app.job.id === job.id)) {
      alert('⚠️ You have already applied to this job!');
      return;
    }
    
    try {
      const { submitApplication } = await import('./src/api/applicationApi');
      
      // Convert jobId to number (backend expects Long)
      const jobIdNumber = job.id;
      
      // Get user info from auth store
      const currentUser = useAuthStore.getState().user;
      
      const result = await submitApplication({
        jobId: jobIdNumber,
        resumeId: applicationData?.resumeId || resumes.find(r => r.isPrimary)?.id,
        resumeFile: applicationData?.resumeFile, // Pass the actual resume file
        resumeFileName: applicationData?.resumeFile?.name || resumes.find(r => r.id === (applicationData?.resumeId || resumes.find(r => r.isPrimary)?.id))?.fileName,
        coverLetter: applicationData?.coverLetter,
        applicantName: currentUser?.name || currentUser?.email?.split('@')[0] || 'Unknown User',
        applicantEmail: currentUser?.email || ''
      });
      
      const newApplication: Application = {
        jobId: jobIdNumber, // Store backend jobId
        job,
        status: 'APPLIED',
        appliedDate: result.appliedDate,
      };
      setApplications(prev => [newApplication, ...prev]);
      console.log('✅ Application submitted:', result);
      console.log('📋 Updated applications, now have:', applications.length + 1, 'applications');
      
      // Show personalized congratulation notification with JobHub branding
      setNotifications(prev => [{
        id: `notif-${Date.now()}`,
        type: 'application',
        text: `Congratulations! 🎉 Your application for ${job.title} at ${job.company} has been submitted successfully. The company will review it and get back to you soon. Good luck! 🍀`,
        timestamp: 'Just now',
        isRead: false
      }, ...prev]);
      
      // Show a toast notification instead of alert
      console.log('✅ Application submitted successfully!');
      
    } catch (error: any) {
      console.error('❌ Failed to apply:', error);
      
      // Handle specific error cases
      const errorMessage = error.message || 'Failed to submit application';
      
      if (errorMessage.includes('already applied')) {
        // User already applied (409 Conflict)
        alert('⚠️ Already Applied\n\nYou have already submitted an application for this job.\n\nCheck your "My Applications" tab to track its status.');
        
        // Add to local state if not already there
        if (!applications.some(app => app.job.id === job.id)) {
          const existingApplication: Application = {
            job,
            status: 'APPLIED',
            appliedDate: new Date().toISOString().split('T')[0],
          };
          setApplications(prev => [existingApplication, ...prev]);
        }
      } else if (errorMessage.includes('not found')) {
        // Job not found (404)
        alert('❌ Job Not Found\n\nThis job posting is no longer available.\n\nIt may have been removed or filled by the employer.');
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('login')) {
        // Not authenticated (401)
        alert('🔐 Login Required\n\nPlease log in to apply for jobs.');
        navigate('login');
      } else {
        // Generic error
        alert(`❌ Application Failed\n\n${errorMessage}\n\nPlease try again or contact support if the problem persists.`);
      }
    }
  };
  
  const handleToggleSaveJob = async (job: Job) => {
    const isSaved = savedJobs.some(saved => saved.id === job.id);
    
    try {
      const { saveJob, unsaveJob } = await import('./src/api/jobApi');
      
      // Convert jobId to number (backend expects Long)
      const jobIdNumber = job.id;
      
      if (isSaved) {
        await unsaveJob(jobIdNumber.toString());
        setSavedJobs(prev => prev.filter(saved => saved.id !== job.id));
        console.log('✅ Job unsaved:', job.title);
      } else {
        await saveJob(jobIdNumber.toString());
        setSavedJobs(prev => [job, ...prev]);
        console.log('✅ Job saved:', job.title);
      }
    } catch (error) {
      console.error('❌ Failed to toggle save:', error);
      // Fallback to local state
      if (isSaved) {
        setSavedJobs(prev => prev.filter(saved => saved.id !== job.id));
      } else {
        setSavedJobs(prev => [job, ...prev]);
      }
    }
  };

  const handleFollowCompany = (companyId: string) => {
    // Add company to followed companies list
    const followedCompanies = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    if (!followedCompanies.includes(companyId)) {
      followedCompanies.push(companyId);
      localStorage.setItem('followedCompanies', JSON.stringify(followedCompanies));
    }
  };

  const handleUnfollowCompany = (companyId: string) => {
    // Remove company from followed companies list
    const followedCompanies = JSON.parse(localStorage.getItem('followedCompanies') || '[]');
    const updatedCompanies = followedCompanies.filter((id: string) => id !== companyId);
    localStorage.setItem('followedCompanies', JSON.stringify(updatedCompanies));
  };

  const handleSaveSearch = () => {
    const newSearch: SavedSearch = {
        id: `search-${Date.now()}`,
        query: 'Frontend Developer',
        filters: { type: ['Full-time'], experience: ['Senior Level'] },
        timestamp: new Date().toISOString()
    };
    setSavedSearches(prev => [newSearch, ...prev]);
  };

  const handleDeleteSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const handleUploadResume = (fileName: string, fileContent: string) => {
    const newResume: Resume = {
        id: `resume-${Date.now()}`,
        fileName: fileName,
        uploadDate: new Date().toISOString().split('T')[0],
        isPrimary: resumes.length === 0,
        textContent: fileContent,
    };
    const updatedResumes = [newResume, ...resumes];
    setResumes(updatedResumes);
    setUserResumes(updatedResumes); // Sync with userStore
  };
  
  const handleDeleteResume = (resumeId: string) => {
    const newResumes = resumes.filter(r => r.id !== resumeId);
    // If the deleted resume was primary, make the first one primary
    if (newResumes.length > 0 && !newResumes.some(r => r.isPrimary)) {
        newResumes[0].isPrimary = true;
    }
    setResumes(newResumes);
    setUserResumes(newResumes); // Sync with userStore
  };

  const handleSetPrimaryResume = (resumeId: string) => {
    const updatedResumes = resumes.map(r => ({ ...r, isPrimary: r.id === resumeId }));
    setResumes(updatedResumes);
    setUserResumes(updatedResumes); // Sync with userStore
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleCompleteAssessment = (assessment: CompletedAssessment) => {
    setCompletedAssessments(prev => {
        // Update if already exists, otherwise add new
        const existingIndex = prev.findIndex(a => a.assessmentId === assessment.assessmentId);
        if (existingIndex > -1) {
            const newAssessments = [...prev];
            newAssessments[existingIndex] = assessment;
            return newAssessments;
        }
        return [assessment, ...prev];
    });
    // Also update the user object if it's set
    if (user) {
        const existingIndex = user.completedAssessments?.findIndex(a => a.assessmentId === assessment.assessmentId) ?? -1;
        const newAssessments = [...(user.completedAssessments || [])];
        if (existingIndex > -1) {
            newAssessments[existingIndex] = assessment;
        } else {
            newAssessments.unshift(assessment);
        }
        setUser({ ...user, completedAssessments: newAssessments });
    }
  };

  const handlePublishJob = async (newJobData: Partial<Job>) => {
    if (!user || user.userType !== 'employer') return;
    
    try {
      // Prepare job data for backend
      const jobPayload = {
        ...newJobData,
        companyId: user.companyId || 'innovate-inc',
        employerId: user.id,
        company: user.experience[0]?.company || 'Innovate Inc.',
        logo: user.avatar,
        status: 'Published'
      };

      console.log('📤 [App] Posting job to backend:', jobPayload.title);

      // Post job to backend API using httpClient for consistency
      const { httpPost } = await import('./src/api/httpClient');
      const newJobResult = await httpPost('/jobs', jobPayload) as Job;
      console.log('✅ [App] Job posted successfully:', newJobResult.id);

      // Add to shared store (makes it available to job seekers immediately!)
      const { addJob } = useSharedJobsStore.getState();
      addJob(newJobResult);

      // Also add to employer's local list
      setEmployerJobs(prev => [newJobResult, ...prev]);

      // Show success message
      alert('✅ Job posted successfully! Job seekers can now see it.');
      navigate('employer_dashboard');
    } catch (error) {
      console.error('❌ [App] Failed to post job:', error);
      
      // Fallback: Create job locally if backend fails
      const newJob: Job = {
        ...newJobData,
        id: Date.now(),
        company: user.experience[0]?.company || 'Innovate Inc.',
        companyId: 'innovate-inc',
        logo: user.avatar,
        posted: 'Just now',
        status: 'Published',
        applicationsCount: 0,
        viewsCount: 0
      } as Job;
      
      setEmployerJobs(prev => [newJob, ...prev]);
      alert('⚠️ Job created locally. Backend connection failed.');
      navigate('employer_dashboard');
    }
  };

  const handleCreatePost = (content: string) => {
    if (!user) return;
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
    setPosts(prev => [newPost, ...prev]);
  };

  const handleConnectionRequest = (requestId: string, action: 'accept' | 'ignore') => {
      setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
      if (action === 'accept') {
          // In a real app, you'd add this user to a "connections" list
          console.log(`Accepted request ${requestId}`);
      }
  };

  const handleStartPracticeInterview = (job: Job) => {
    setJobToPractice(job);
    navigate('job_seeker_dashboard');
  };

  const handleSignupSuccess = () => {
    // After successful signup, redirect to login
    navigate('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'signup':
        return <SignupPage onNavigate={navigate} onLoginSuccess={handleSignupSuccess} />;
      case 'email_verification':
        return <EmailVerificationPage onNavigate={navigate} />;
      case 'forgot_password':
        return <ForgotPasswordPage onNavigate={navigate} />;
      case 'job_search':
        return <JobSearchPage onViewJobDetails={handleViewJobDetails} onViewCompanyProfile={handleViewCompanyProfile} onSaveSearch={handleSaveSearch} />;
      case 'job_details':
        if (!selectedJob) {
            navigate('job_search');
            return null;
        }
        const hasApplied = applications.some(app => app.job.id === selectedJob.id);
        
        return <JobDetailsPage
                    job={selectedJob}
                    onBack={() => navigate(userType === 'employer' ? 'employer_dashboard' : 'job_search')}
                    onApply={isAuthenticated ? handleApplyJob : () => navigate('login')}
                    onToggleSave={isAuthenticated ? handleToggleSaveJob : () => navigate('login')}
                    isSaved={savedJobs.some(j => j.id === selectedJob.id)}
                    isApplied={hasApplied}
                    isAuthenticated={isAuthenticated}
                    onLoginRedirect={() => navigate('login')}
                    onViewCompanyProfile={handleViewCompanyProfile}
                    onStartPracticeInterview={handleStartPracticeInterview}
                    userResumes={resumes}
                    userEmail={user?.email || ''}
                    userPhone={user?.phone || ''}
                />;
      case 'companies_directory':
        return <CompaniesDirectoryPage 
                    onViewCompanyProfile={handleViewCompanyProfile}
                    onNavigate={navigate}
                />;
      case 'company_profile':
        {
          if (!selectedCompanyId) {
            navigate('job_search');
            return null;
          }
          return <CompanyProfilePage 
                      companyId={selectedCompanyId}
                      user={user || {} as User}
                      onFollowCompany={handleFollowCompany}
                      onUnfollowCompany={handleUnfollowCompany}
                      onApplyJob={handleApplyJob}
                      onViewJobDetails={handleViewJobDetails}
                      onBack={() => navigate(userType === 'job_seeker' ? 'job_seeker_dashboard' : 'job_search')}
                  />;
        }
      case 'messaging':
        return isAuthenticated && user ? (
          <MessagingPage 
            currentUser={user}
            conversations={conversations}
            onBack={() => navigate(userType === 'employer' ? 'employer_dashboard' : 'job_seeker_dashboard')}
          />
        ) : <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'test_features':
        return <TestFeaturesPage onNavigate={navigate} user={user} />;
      case 'linkedin_dashboard':
        return isAuthenticated && user ? (
          <LinkedInStyleDashboard
            user={user}
            onNavigate={navigate}
            onViewJobDetails={handleViewJobDetails}
            onViewCompanyProfile={handleViewCompanyProfile}
          />
        ) : <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'universal_dashboard':
        return isAuthenticated && user && userType === 'new_user' ? (
          <UniversalDashboardPage
            onNavigate={navigate}
            onViewJobDetails={handleViewJobDetails}
            onViewCompanyProfile={handleViewCompanyProfile}
          />
        ) : <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'job_seeker_dashboard':
        return isAuthenticated && user && userType === 'job_seeker' ? (
            <JobSeekerDashboardPage 
                user={user}
                applications={applications}
                savedJobs={savedJobs}
                savedSearches={savedSearches}
                resumes={resumes}
                completedAssessments={completedAssessments}
                posts={posts}
                connectionRequests={connectionRequests}
                jobToPractice={jobToPractice}
                onNavigate={navigate}
                onViewJobDetails={handleViewJobDetails}
                onViewCompanyProfile={handleViewCompanyProfile}
                onDeleteSearch={handleDeleteSearch}
                onUploadResume={handleUploadResume}
                onDeleteResume={handleDeleteResume}
                onSetPrimaryResume={handleSetPrimaryResume}
                onCompleteAssessment={handleCompleteAssessment}
                onCreatePost={handleCreatePost}
                onConnectionRequestAction={handleConnectionRequest}
                onPracticeHandled={() => setJobToPractice(null)}
                onApplyJob={handleApplyJob}
                onSaveJob={handleToggleSaveJob}
                onFollowCompany={(companyId) => {
                  console.log('Following company:', companyId);
                  // Add company follow logic here
                }}
                onUnfollowCompany={(companyId) => {
                  console.log('Unfollowing company:', companyId);
                  // Add company unfollow logic here
                }}
            />
        ) : <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'employer_dashboard':
        return isAuthenticated && user && userType === 'employer' ? (
            <EmployerDashboardPage 
                user={user}
                onNavigate={navigate}
            />
        ) : <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'create_job':
         return isAuthenticated && user && userType === 'employer' ? (
            <CreateJobPage 
              user={user}
              onBack={() => navigate('employer_dashboard')}
              onPublish={handlePublishJob}
            />
        ) : <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'admin_dashboard':
        return isAuthenticated && user && userType === 'admin' ? (
            <AdminDashboardPage 
                user={user}
            />
        ) : <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'for_employers':
        return <ForEmployersPage onNavigate={navigate} />;
      case 'for_job_seekers':
        return <ForJobSeekersPage onNavigate={navigate} />;
      case 'landing':
      default:
        return (
          <>
            <div id="hero">
              <Hero onNavigate={navigate} />
            </div>
            <LazySection>
              <div id="choose-path">
                <ChooseYourPath onNavigate={navigate} />
              </div>
            </LazySection>
            <LazySection>
              <div id="companies">
                <RotatingCarousel onNavigate={navigate} />
              </div>
            </LazySection>
            <LazySection>
              <div id="jobs">
                <FeaturedJobs onViewJobDetails={handleViewJobDetails} onViewCompanyProfile={handleViewCompanyProfile} onNavigate={navigate}/>
              </div>
            </LazySection>
            <LazySection>
              <div id="features">
                <WhyChooseUs />
              </div>
            </LazySection>
            <LazySection>
              <div id="stats">
                <Stats />
              </div>
            </LazySection>
            <LazySection>
              <div id="insights">
                <MarketInsightsSection />
              </div>
            </LazySection>
            <LazySection>
              <div id="how-it-works">
                <HowItWorks />
              </div>
            </LazySection>
            <LazySection>
              <div id="categories">
                <JobCategories />
              </div>
            </LazySection>
            <LazySection>
              <div id="videos">
                <VideoHighlights />
              </div>
            </LazySection>
            <LazySection>
              <div id="testimonials">
                <Testimonials />
              </div>
            </LazySection>
            <LazySection>
              <div id="cta">
                <CtaSection />
              </div>
            </LazySection>
          </>
        );
    }
  };

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <OnboardingPage
        onComplete={handleOnboardingComplete}
        onNavigate={navigate}
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className={`bg-white dark:bg-neutral-dark text-neutral-dark dark:text-white flex flex-col min-h-screen ${currentPage !== 'landing' ? 'bg-neutral-light dark:bg-neutral-dark' : ''}`}>
        {/* Hide header on auth pages */}
        {!['login', 'signup', 'email_verification', 'forgot_password'].includes(currentPage) && (
          <Header
            onNavigate={navigate}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            user={user}
            userType={userType}
            notifications={notifications}
            onMarkAllRead={handleMarkAllNotificationsRead}
          />
        )}
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <main className={`flex-grow ${!['login', 'signup', 'email_verification', 'forgot_password'].includes(currentPage) && currentPage !== 'landing' ? 'pt-16' : ''}`}>
            {renderPage()}
          </main>
        </Suspense>
        {/* Hide footer on auth pages and dashboard pages */}
        {!['login', 'signup', 'email_verification', 'forgot_password', 'job_seeker_dashboard', 'employer_dashboard'].includes(currentPage) && (
          <Footer onNavigate={navigate} />
        )}
        <ChatBot />
      </div>
    </ErrorBoundary>
  );
}

export default App;