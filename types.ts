import React from 'react';
import type { ReactElement } from 'react';

export type Page = 'landing' | 'login' | 'signup' | 'forgot_password' | 'job_search' | 'job_details' | 'job_seeker_dashboard' | 'employer_dashboard' | 'admin_dashboard' | 'company_profile' | 'messaging' | 'create_job';

export interface Job {
  id: number;
  title: string;
  company: string;
  companyId: string;
  logo: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  salary?: string;
  posted: string;
  description?: string;
  responsibilities?: string[];
  skills?: string[];
  benefits?: string[];
  status?: 'Published' | 'Closed' | 'Draft' | 'Pending Approval' | 'Flagged' | 'Removed';
  applicationsCount?: number;
  viewsCount?: number;
  seniority?: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
}

export interface Value {
  title: string;
  description: string;
  icon: React.ReactElement<{ className?: string }>;
}

export interface EmployeeVideoTestimonial {
  id: number;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  employeeName: string;
  employeeTitle: string;
}


export interface Company {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  about: string;
  website: string;
  location: string;
  size: string;
  industry: string;
  values?: Value[];
  dayInTheLife?: string;
  photoGallery?: string[];
  employeeTestimonials?: EmployeeVideoTestimonial[];
  benefits?: string[];
}

export interface UserPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    headline: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

export interface FeedItem {
  id: string;
  type: 'job_recommendation' | 'company_update' | 'article' | 'user_post';
  timestamp: string;
  // Content
  job?: Job;
  company?: {
    id: string;
    name: string;
    logo: string;
  };
  updateText?: string;
  article?: {
    title: string;
    snippet: string;
    image: string;
  };
  userPost?: UserPost;
}

export interface SavedSearch {
    id: string;
    query: string;
    filters: {
        type: string[];
        experience: string[];
    };
    timestamp: string;
}

export interface Category {
  name: string;
  icon: React.ReactElement<{ className?: string }>;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  avatar: string;
}

export interface ChatMessage {
    text: string;
    sender: 'user' | 'bot';
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface AssessmentQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface SkillAssessment {
  id: string;
  title: string;
  topic: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
}

export interface CompletedAssessment {
  assessmentId: string;
  title: string;
  score: number; // e.g., 80 for 80%
  dateCompleted: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  location: string;
  about: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: Education[];
  portfolioUrl?: string;
  yearsOfExperience?: number;
  completedAssessments?: CompletedAssessment[];
  userType?: 'job_seeker' | 'employer' | 'admin';
  status?: 'Active' | 'Suspended' | 'Banned';
  createdDate?: string;
}

export interface ConnectionRequest {
  id: string;
  user: User;
  mutualConnections: number;
  timestamp: string;
}

export interface Application {
  job: Job;
  status: 'Applied' | 'Resume Viewed' | 'In Review' | 'Shortlisted' | 'Interview' | 'Offered' | 'Rejected';
  appliedDate: string;
}

export interface Resume {
  id: string;
  fileName: string;
  uploadDate: string;
  isPrimary: boolean;
  textContent?: string;
}

export interface EmployerApplication {
  applicant: User;
  job: Job;
  status: 'New' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Hired';
  appliedDate: string;
  matchPercentage: number;
}

export interface Notification {
  id: string;
  type: 'message' | 'application' | 'system';
  text: string;
  timestamp: string;
  isRead: boolean;
  linkTo?: string; // Optional link for navigation
}

export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: DirectMessage[];
  unreadCount: number;
}

export interface Referral {
  id: string;
  referredUserName: string;
  status: 'Pending' | 'Signed Up' | 'Hired';
  reward: string;
  date: string;
}

export type JobSeekerDashboardTab = 'overview' | 'my_network' | 'applications' | 'saved_jobs' | 'saved_searches' | 'resume_management' | 'profile' | 'messages' | 'skill_assessments' | 'career_explorer' | 'referrals' | 'interview_practice';

// Career Path Explorer types
export interface CareerStep {
    title: string;
    description: string;
    skills_to_acquire: string[];
}

export interface CareerPath {
    path_name: string;
    steps: CareerStep[];
}

export type AdminDashboardTab = 'job_moderation' | 'user_management' | 'analytics';

export interface CompanyReview {
  id: string;
  companyId: string;
  authorName: string;
  authorTitle: string; // e.g., "Current Employee", "Former Employee"
  rating: number; // 1-5
  title: string;
  pros: string;
  cons: string;
  timestamp: string;
}

// Interview Practice types
export interface InterviewQuestion {
    type: 'behavioral' | 'technical';
    question: string;
}