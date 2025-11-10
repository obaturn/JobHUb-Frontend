

import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedJobs from './components/FeaturedJobs';
import Stats from './components/Stats';
import JobCategories from './components/JobCategories';
import Testimonials from './components/Testimonials';
import CtaSection from './components/CtaSection';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import JobSearchPage from './pages/JobSearchPage';
import JobDetailsPage from './pages/JobDetailsPage';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load heavy components for better performance
const JobSeekerDashboardPage = lazy(() => import('./pages/JobSeekerDashboardPage'));
const EmployerDashboardPage = lazy(() => import('./pages/EmployerDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const CompanyProfilePage = lazy(() => import('./pages/CompanyProfilePage'));
const MessagingPage = lazy(() => import('./pages/MessagingPage'));
const CreateJobPage = lazy(() => import('./pages/CreateJobPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'));
import ChatBot from './components/ChatBot';
import { User, Job, Application, Company, SavedSearch, Resume, Notification, Conversation, CompletedAssessment, Page, UserPost, ConnectionRequest } from './types';
import { MOCK_USER, INITIAL_APPLICATIONS, INITIAL_SAVED_JOBS, MOCK_EMPLOYER, MOCK_ADMIN, MOCK_COMPANIES, INITIAL_SAVED_SEARCHES, MOCK_RESUMES, MOCK_NOTIFICATIONS, MOCK_CONVERSATIONS, MOCK_COMPLETED_ASSESSMENTS, EMPLOYER_JOBS, MOCK_POSTS, MOCK_CONNECTION_REQUESTS } from './constants';
import WhyChooseUs from './components/WhyChooseUs';
import HowItWorks from './components/HowItWorks';
import VideoHighlights from './components/VideoHighlights';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'job_seeker' | 'employer' | 'admin' | null>(null);
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(INITIAL_SAVED_SEARCHES);
  const [resumes, setResumes] = useState<Resume[]>(MOCK_RESUMES);
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
    window.scrollTo(0, 0);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser(MOCK_USER);
    setUserType('job_seeker');
    setApplications(INITIAL_APPLICATIONS);
    setSavedJobs(INITIAL_SAVED_JOBS);
    setNotifications(MOCK_NOTIFICATIONS);
    setConversations(MOCK_CONVERSATIONS);
    setCompletedAssessments(MOCK_USER.completedAssessments || []);
    setConnectionRequests(MOCK_CONNECTION_REQUESTS);
    navigate('job_seeker_dashboard');
  };

  const handleEmployerLogin = () => {
    setIsAuthenticated(true);
    setUser(MOCK_EMPLOYER);
    setUserType('employer');
    setApplications([]);
    setSavedJobs([]);
    setNotifications(MOCK_NOTIFICATIONS.slice(0,1)); // Simpler notifications
    setConversations(MOCK_CONVERSATIONS);
    navigate('employer_dashboard');
  };

  const handleAdminLogin = () => {
    setIsAuthenticated(true);
    setUser(MOCK_ADMIN);
    setUserType('admin');
    setApplications([]);
    setSavedJobs([]);
    setNotifications([]);
    setConversations([]);
    navigate('admin_dashboard');
  };

  const handleLogout = () => {
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

  const handleOnboardingComplete = (selectedUserType: 'job_seeker' | 'employer') => {
    setUserType(selectedUserType);
    setIsAuthenticated(true);
    setUser(selectedUserType === 'job_seeker' ? MOCK_USER : MOCK_EMPLOYER);
    setShowOnboarding(false);
    if (selectedUserType === 'job_seeker') {
      navigate('job_seeker_dashboard');
    } else {
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
  
  const handleApplyJob = (job: Job) => {
    if (applications.some(app => app.job.id === job.id)) return;
    const newApplication: Application = {
        job,
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
    };
    setApplications(prev => [newApplication, ...prev]);
  };
  
  const handleToggleSaveJob = (job: Job) => {
    if (savedJobs.some(saved => saved.id === job.id)) {
        setSavedJobs(prev => prev.filter(saved => saved.id !== job.id));
    } else {
        setSavedJobs(prev => [job, ...prev]);
    }
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
    setResumes(prev => [newResume, ...prev]);
  };
  
  const handleDeleteResume = (resumeId: string) => {
    setResumes(prev => {
        const newResumes = prev.filter(r => r.id !== resumeId);
        // If the deleted resume was primary, make the first one primary
        if (newResumes.length > 0 && !newResumes.some(r => r.isPrimary)) {
            newResumes[0].isPrimary = true;
        }
        return newResumes;
    });
  };

  const handleSetPrimaryResume = (resumeId: string) => {
    setResumes(prev => prev.map(r => ({ ...r, isPrimary: r.id === resumeId })));
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

  const handlePublishJob = (newJobData: Partial<Job>) => {
    if (!user || user.userType !== 'employer') return;
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
    navigate('employer_dashboard');
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
    // After successful signup, show onboarding
    setShowOnboarding(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'signup':
        return <SignupPage onNavigate={navigate} onLoginSuccess={handleSignupSuccess} />;
      case 'forgot_password':
        return <ForgotPasswordPage onNavigate={navigate} />;
      case 'job_search':
        return <JobSearchPage onViewJobDetails={handleViewJobDetails} onViewCompanyProfile={handleViewCompanyProfile} onSaveSearch={handleSaveSearch} />;
      case 'job_details':
        if (!selectedJob) {
            navigate('job_search');
            return null;
        }
        return <JobDetailsPage
                    job={selectedJob}
                    onBack={() => navigate(userType === 'employer' ? 'employer_dashboard' : 'job_search')}
                    onApply={isAuthenticated ? handleApplyJob : () => navigate('login')}
                    onToggleSave={isAuthenticated ? handleToggleSaveJob : () => navigate('login')}
                    isSaved={savedJobs.some(j => j.id === selectedJob.id)}
                    isAuthenticated={isAuthenticated}
                    onLoginRedirect={() => navigate('login')}
                    onViewCompanyProfile={handleViewCompanyProfile}
                    onStartPracticeInterview={handleStartPracticeInterview}
                />;
      case 'company_profile':
        {
          if (!selectedCompanyId) {
            navigate('job_search');
            return null;
          }
          const company = MOCK_COMPANIES.find(c => c.id === selectedCompanyId);
          if (!company) {
            navigate('job_search');
            return null;
          }
          return <CompanyProfilePage 
                      company={company}
                      onViewJobDetails={handleViewJobDetails}
                      onBack={() => navigate('job_search')}
                      onViewCompanyProfile={handleViewCompanyProfile}
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
            />
        ) : <LoginPage onNavigate={navigate} onLoginSuccess={handleLogin} onEmployerLogin={handleEmployerLogin} onAdminLogin={handleAdminLogin} />;
      case 'employer_dashboard':
        return isAuthenticated && user && userType === 'employer' ? (
            <EmployerDashboardPage 
                user={user}
                employerJobs={employerJobs}
                onViewJobDetails={handleViewJobDetails}
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
      case 'landing':
      default:
        return (
          <>
            <Hero onNavigate={navigate} />
            <FeaturedJobs onViewJobDetails={handleViewJobDetails} onViewCompanyProfile={handleViewCompanyProfile} onNavigate={navigate}/>
            <WhyChooseUs />
            <Stats />
            <HowItWorks />
            <JobCategories />
            <VideoHighlights />
            <Testimonials />
            <CtaSection />
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
      <div className={`bg-white text-neutral-dark flex flex-col min-h-screen ${currentPage !== 'landing' ? 'bg-neutral-light' : ''}`}>
        <Header
          onNavigate={navigate}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          user={user}
          userType={userType}
          notifications={notifications}
          onMarkAllRead={handleMarkAllNotificationsRead}
        />
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <main className="flex-grow">
            {renderPage()}
          </main>
        </Suspense>
        <Footer onNavigate={navigate} />
        <ChatBot />
      </div>
    </ErrorBoundary>
  );
}

export default App;