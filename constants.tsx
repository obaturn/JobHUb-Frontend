import React from 'react';
import { Job, Category, Testimonial, User, Application, EmployerApplication, Company, FeedItem, SavedSearch, Resume, Notification, Conversation, DirectMessage, Education, SkillAssessment, CompletedAssessment, Referral, CompanyReview, Value, EmployeeVideoTestimonial, UserPost, ConnectionRequest } from './types';
import { RocketLaunchIcon } from './components/icons/RocketLaunchIcon';
import { HeartIcon } from './components/icons/HeartIcon';
import { ScaleIcon } from './components/icons/ScaleIcon';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8084/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
  JOBS: {
    LIST: `${API_BASE_URL}/jobs`,
    CREATE: `${API_BASE_URL}/jobs`,
    DETAILS: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    MY_JOBS: `${API_BASE_URL}/jobs/employer/my-jobs`,
    STATS: `${API_BASE_URL}/jobs/employer/stats`,
  },
  APPLICATIONS: {
    APPLY: `${API_BASE_URL}/applications`,
    MY_APPLICATIONS: `${API_BASE_URL}/applications/my-applications`,
    JOB_APPLICATIONS: (jobId: string) => `${API_BASE_URL}/applications/job/${jobId}`,
    UPDATE_STATUS: (id: string) => `${API_BASE_URL}/applications/${id}/status`,
    STATS: `${API_BASE_URL}/applications/employer/stats`,
  },
  USERS: {
    PROFILE: (id: string) => `${API_BASE_URL}/users/${id}`,
    SEARCH: `${API_BASE_URL}/users/search`,
    STATS: `${API_BASE_URL}/users/admin/stats`,
  },
};

export const BriefcaseIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const CodeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 12" />
    </svg>
);

export const MegaphoneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
    </svg>
);

export const PaintBrushIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

export const BookOpenIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
);

export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);


const detailedJobs: Omit<Job, 'id' | 'title' | 'company' | 'companyId' | 'logo' | 'location' | 'type' | 'salary' | 'posted'> = {
  description: "We are seeking a talented and experienced developer to join our dynamic team. The ideal candidate will be passionate about creating high-quality, user-friendly web applications and eager to work in a collaborative environment.",
  responsibilities: [
    "Develop and maintain web applications using modern technologies.",
    "Collaborate with cross-functional teams to define, design, and ship new features.",
    "Write clean, scalable, and well-documented code.",
    "Troubleshoot, debug, and upgrade existing software.",
    "Participate in code reviews to maintain high-quality code standards."
  ],
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS"],
  benefits: ["Comprehensive health insurance", "401(k) with company match", "Unlimited paid time off", "Remote work flexibility", "Professional development budget"]
};

export const FEATURED_JOBS: Job[] = [
  { id: 1, title: 'Senior Frontend Developer', companyId: 'innovate-inc', company: 'Innovate Inc.', logo: 'https://picsum.photos/seed/innovate/100/100', location: 'San Francisco, CA', type: 'Full-time', salary: '$140k - $180k', posted: '2 days ago', ...detailedJobs, skills: ["React", "TypeScript", "Next.js", "Redux"] },
  { id: 2, title: 'UX/UI Designer', companyId: 'creative-solutions', company: 'Creative Solutions', logo: 'https://picsum.photos/seed/creative/100/100', location: 'New York, NY', type: 'Contract', posted: '5 days ago', ...detailedJobs, skills: ["Figma", "Sketch", "Adobe XD", "User Research"] },
  { id: 3, title: 'Product Manager', companyId: 'tech-giant', company: 'Tech Giant', logo: 'https://picsum.photos/seed/tech/100/100', location: 'Remote', type: 'Full-time', salary: '$160k - $200k', posted: '1 week ago', ...detailedJobs, skills: ["Agile", "Roadmapping", "JIRA", "Market Analysis"] },
  { id: 4, title: 'Data Scientist', companyId: 'data-driven-co', company: 'DataDriven Co.', logo: 'https://picsum.photos/seed/data/100/100', location: 'Austin, TX', type: 'Full-time', salary: '$130k - $170k', posted: '3 days ago', ...detailedJobs, skills: ["Python", "R", "SQL", "Machine Learning", "Tableau"] },
];

export const ALL_JOBS: Job[] = [
    ...FEATURED_JOBS,
    { id: 5, title: 'Backend Engineer', companyId: 'server-systems', company: 'Server Systems', logo: 'https://picsum.photos/seed/server/100/100', location: 'Chicago, IL', type: 'Full-time', salary: '$120k - $160k', posted: '1 day ago', ...detailedJobs, skills: ["Node.js", "Go", "PostgreSQL", "Docker", "Kubernetes"] },
    { id: 6, title: 'Digital Marketer', companyId: 'growth-co', company: 'Growth Co.', logo: 'https://picsum.photos/seed/growth/100/100', location: 'Remote', type: 'Part-time', posted: '10 days ago', ...detailedJobs, skills: ["SEO", "SEM", "Google Analytics", "Content Marketing"] },
    { id: 7, title: 'Graphic Designer', companyId: 'pixel-perfect', company: 'Pixel Perfect', logo: 'https://picsum.photos/seed/pixel/100/100', location: 'Los Angeles, CA', type: 'Freelance', salary: '$50/hr', posted: '2 weeks ago', ...detailedJobs, skills: ["Adobe Illustrator", "Photoshop", "InDesign"] },
    { id: 8, title: 'DevOps Engineer', companyId: 'cloud-net', company: 'CloudNet', logo: 'https://picsum.photos/seed/cloud/100/100', location: 'Seattle, WA', type: 'Full-time', salary: '$150k - $190k', posted: '4 days ago', ...detailedJobs, skills: ["AWS", "Terraform", "CI/CD", "Jenkins", "Python"] },
    { id: 9, title: 'Content Writer', companyId: 'word-smiths', company: 'WordSmiths', logo: 'https://picsum.photos/seed/word/100/100', location: 'Remote', type: 'Contract', posted: '6 days ago', ...detailedJobs, skills: ["Copywriting", "SEO Writing", "Blogging", "Editing"] },
    { id: 10, title: 'HR Generalist', companyId: 'people-first', company: 'PeopleFirst', logo: 'https://picsum.photos/seed/people/100/100', location: 'Boston, MA', type: 'Full-time', salary: '$70k - $90k', posted: '1 week ago', ...detailedJobs, skills: ["Recruiting", "Onboarding", "Employee Relations"] },
    { id: 11, title: 'Mobile Developer (iOS)', companyId: 'appify', company: 'Appify', logo: 'https://picsum.photos/seed/appify/100/100', location: 'San Francisco, CA', type: 'Full-time', salary: '$145k - $185k', posted: '8 days ago', ...detailedJobs, skills: ["Swift", "SwiftUI", "Xcode", "Core Data"] },
    { id: 12, title: 'Customer Support Specialist', companyId: 'help-desk-inc', company: 'HelpDesk Inc.', logo: 'https://picsum.photos/seed/help/100/100', location: 'Remote', type: 'Part-time', salary: '$25/hr', posted: '9 days ago', ...detailedJobs, skills: ["Zendesk", "Communication", "Problem Solving"] },
];

export const JOB_CATEGORIES: Category[] = [
  { name: 'Technology', icon: <CodeIcon className="w-8 h-8 text-primary" /> },
  { name: 'Marketing', icon: <MegaphoneIcon className="w-8 h-8 text-primary" /> },
  { name: 'Design', icon: <PaintBrushIcon className="w-8 h-8 text-primary" /> },
  { name: 'Business', icon: <ChartBarIcon className="w-8 h-8 text-primary" /> },
  { name: 'Writing', icon: <BookOpenIcon className="w-8 h-8 text-primary" /> },
  { name: 'All Jobs', icon: <BriefcaseIcon className="w-8 h-8 text-primary" /> },
];

export const TESTIMONIALS: Testimonial[] = [
    {
        quote: "JobHub made my job search incredibly easy. I found my dream job in just two weeks! The platform is intuitive and full of great opportunities.",
        name: "Sarah Johnson",
        title: "Senior Software Engineer at TechCorp",
        avatar: "https://picsum.photos/seed/sarah/100/100"
    },
    {
        quote: "As an employer, finding qualified candidates has never been faster. JobHub's tools helped us streamline our hiring process and connect with top talent.",
        name: "Michael Chen",
        title: "HR Manager at Innovate Solutions",
        avatar: "https://picsum.photos/seed/michael/100/100"
    },
    {
        quote: "I love the clean interface and the quality of job postings. It's a professional platform that truly understands the needs of both job seekers and employers.",
        name: "Emily Rodriguez",
        title: "Product Designer at Creative Minds",
        avatar: "https://picsum.photos/seed/emily/100/100"
    }
];

export const MOCK_COMPLETED_ASSESSMENTS: CompletedAssessment[] = [
    {
        assessmentId: 'react-1',
        title: 'React Fundamentals',
        score: 90,
        dateCompleted: '2024-07-28'
    },
    {
        assessmentId: 'typescript-1',
        title: 'TypeScript Basics',
        score: 80,
        dateCompleted: '2024-07-25'
    }
];

export const MOCK_USER: User = {
    id: 'user-123',
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatar: 'https://picsum.photos/seed/alex/200/200',
    headline: 'Senior Frontend Developer | React, TypeScript, Next.js',
    location: 'San Francisco, CA',
    about: "I'm a passionate frontend developer with over 8 years of experience building responsive, high-performance web applications. I specialize in the React ecosystem and am dedicated to creating intuitive user experiences and writing clean, scalable code.",
    skills: ['JavaScript', 'Next.js', 'GraphQL', 'Tailwind CSS', 'Figma', 'Node.js', 'CI/CD'],
    experience: [
        {
            title: 'Senior Frontend Developer',
            company: 'Innovate Inc.',
            period: 'Jan 2021 - Present',
            description: 'Led the development of a new design system, improving component reusability by 60%. Mentored junior developers and conducted code reviews to maintain high code quality.'
        },
        {
            title: 'Frontend Developer',
            company: 'Creative Solutions',
            period: 'Jun 2018 - Dec 2020',
            description: 'Developed and maintained client-facing web applications using React and Redux. Collaborated with UX/UI designers to translate mockups into functional components.'
        },
        {
            title: 'Junior Web Developer',
            company: 'Web Wizards',
            period: 'Jul 2016 - May 2018',
            description: 'Built and styled marketing websites using HTML, CSS, and JavaScript. Gained foundational experience in web development and agile methodologies.'
        }
    ],
    education: [
        {
            institution: 'State University',
            degree: 'B.S. in Computer Science',
            fieldOfStudy: 'Computer Science',
            graduationYear: '2016'
        }
    ],
    portfolioUrl: 'https://alexdoe.dev',
    yearsOfExperience: 8,
    completedAssessments: MOCK_COMPLETED_ASSESSMENTS,
    userType: 'job_seeker',
    status: 'Active',
    createdDate: '2020-01-15',
};

export const INITIAL_APPLICATIONS: Application[] = [
    {
        job: ALL_JOBS[0], // Senior Frontend Developer
        status: 'Interview',
        appliedDate: '2024-07-18',
    },
    {
        job: ALL_JOBS[4], // Backend Engineer
        status: 'Resume Viewed',
        appliedDate: '2024-07-20',
    },
    {
        job: ALL_JOBS[7], // DevOps Engineer
        status: 'Applied',
        appliedDate: '2024-07-22',
    }
];

export const INITIAL_SAVED_JOBS: Job[] = [
    ALL_JOBS[10], // Mobile Developer
    ALL_JOBS[3], // Data Scientist
];

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
    {
        id: 'saved-search-1',
        query: "Senior React Developer",
        filters: { type: ['Full-time', 'Remote'], experience: ['Senior Level'] },
        timestamp: '2024-07-28T10:00:00Z',
    },
    {
        id: 'saved-search-2',
        query: "UX Designer",
        filters: { type: ['Contract'], experience: ['Mid Level'] },
        timestamp: '2024-07-25T14:30:00Z',
    }
];

export const MOCK_RESUME_TEXT = `
Alex Doe
Senior Frontend Developer
San Francisco, CA | (123) 456-7890 | alex.doe@example.com | alexdoe.dev

Summary
Passionate frontend developer with over 8 years of experience in building responsive, high-performance web applications. I specialize in the React ecosystem and am dedicated to creating intuitive user experiences and writing clean, scalable code.

Skills
- React, TypeScript, JavaScript, Next.js
- GraphQL, Tailwind CSS, Figma, Node.js
- CI/CD, Jest, Cypress

Experience

Senior Frontend Developer
Innovate Inc. | Jan 2021 - Present
- Led the development of a new design system.
- Improved component reusability by 60%.
- Mentored junior developers.
- Conducted code reviews to maintain high code quality.

Frontend Developer
Creative Solutions | Jun 2018 - Dec 2020
- Developed and maintained client-facing web applications using React and Redux.
- Collaborated with UX/UI designers to translate mockups into functional components.

Junior Web Developer
Web Wizards | Jul 2016 - May 2018
- Built and styled marketing websites using HTML, CSS, and JavaScript.
- Gained foundational experience in web development and agile methodologies.

Education
State University
B.S. in Computer Science | 2016
`;

export const MOCK_RESUMES: Resume[] = [
    { id: 'resume-1', fileName: 'Alex_Doe_Frontend_Resume_2024.pdf', uploadDate: '2024-07-15', isPrimary: true, textContent: MOCK_RESUME_TEXT },
    { id: 'resume-2', fileName: 'Alex_Doe_General_CV.pdf', uploadDate: '2024-06-20', isPrimary: false, textContent: MOCK_RESUME_TEXT.replace('Senior Frontend Developer', 'Full Stack Developer') },
];


// --- NEW SKILL ASSESSMENT DATA ---
export const AVAILABLE_ASSESSMENTS: SkillAssessment[] = [
    { id: 'react-1', title: 'React Fundamentals', topic: 'React', description: 'Test your knowledge of core React concepts like components, state, props, and hooks.', durationMinutes: 15, questionCount: 10 },
    { id: 'typescript-1', title: 'TypeScript Basics', topic: 'TypeScript', description: 'Assess your understanding of TypeScript types, interfaces, and basic features.', durationMinutes: 15, questionCount: 10 },
    { id: 'python-1', title: 'Python for Data Science', topic: 'Python for Data Science', description: 'Evaluate your skills in using Python libraries like Pandas and NumPy for data manipulation.', durationMinutes: 20, questionCount: 10 },
    { id: 'ux-1', title: 'UI/UX Principles', topic: 'UI/UX Principles', description: 'Test your knowledge of fundamental user interface and user experience design principles.', durationMinutes: 15, questionCount: 10 },
    { id: 'sql-1', title: 'SQL Fundamentals', topic: 'SQL', description: 'Assess your ability to write basic SQL queries for data retrieval and manipulation.', durationMinutes: 15, questionCount: 10 },
];


// --- EMPLOYER DATA ---

export const MOCK_EMPLOYER: User = {
    id: 'emp-456',
    name: 'Jane Smith',
    email: 'jane.smith@innovate.com',
    avatar: 'https://picsum.photos/seed/jane/200/200',
    headline: 'Hiring Manager at Innovate Inc.',
    location: 'San Francisco, CA',
    about: "I'm the hiring manager at Innovate Inc., where we're building the future of technology. I'm passionate about connecting talented individuals with meaningful career opportunities. We are always looking for passionate engineers, designers, and product managers to join our team.",
    skills: ['Talent Acquisition', 'Recruiting', 'Human Resources', 'Tech Hiring'],
    experience: [
        {
            title: 'Hiring Manager',
            company: 'Innovate Inc.',
            period: 'Mar 2020 - Present',
            description: 'Leading the recruitment efforts for our engineering and product teams. Responsible for the full hiring lifecycle, from sourcing to onboarding.'
        }
    ],
    education: [],
    userType: 'employer',
    status: 'Active',
    createdDate: '2021-02-10',
};

export const EMPLOYER_JOBS: Job[] = [
    { ...ALL_JOBS[0], status: 'Published', applicationsCount: 12, viewsCount: 1540 }, // Senior Frontend Developer
    { id: 13, title: 'Lead Backend Developer', companyId: 'innovate-inc', company: 'Innovate Inc.', logo: 'https://picsum.photos/seed/innovate/100/100', location: 'San Francisco, CA', type: 'Full-time', salary: '$180k - $220k', posted: '3 days ago', ...detailedJobs, skills: ["Go", "Python", "Kubernetes", "Microservices"], status: 'Published', applicationsCount: 8, viewsCount: 980 },
    { id: 14, title: 'Junior UX Researcher', companyId: 'innovate-inc', company: 'Innovate Inc.', logo: 'https://picsum.photos/seed/innovate/100/100', location: 'Remote', type: 'Contract', posted: '1 week ago', ...detailedJobs, skills: ["User Interviews", "Surveys", "Figma", "Data Analysis"], status: 'Published', applicationsCount: 25, viewsCount: 2100 },
    { id: 15, title: 'Marketing Intern', companyId: 'innovate-inc', company: 'Innovate Inc.', logo: 'https://picsum.photos/seed/innovate/100/100', location: 'San Francisco, CA', type: 'Part-time', posted: '2 months ago', ...detailedJobs, skills: ["Social Media", "Content Creation"], status: 'Closed', applicationsCount: 150, viewsCount: 8500 },
];

export const MOCK_APPLICANTS: User[] = [
    MOCK_USER, // Alex Doe
    {
        id: 'user-789',
        name: 'Maria Garcia',
        email: 'maria.g@example.com',
        avatar: 'https://picsum.photos/seed/maria/200/200',
        headline: 'Backend Developer | Go, Python, Microservices',
        location: 'Austin, TX',
        about: "Experienced backend developer focused on building scalable and resilient systems.",
        skills: ['Go', 'Python', 'Kubernetes', 'Microservices', 'PostgreSQL', 'AWS'],
        experience: [],
        education: [
            {
                institution: 'Tech Institute',
                degree: 'M.S. in Software Engineering',
                fieldOfStudy: 'Software Engineering',
                graduationYear: '2019'
            }
        ],
        portfolioUrl: 'https://mariagarcia.io',
        yearsOfExperience: 5,
        userType: 'job_seeker',
        status: 'Active',
        createdDate: '2022-05-20',
    },
    {
        id: 'user-101',
        name: 'David Lee',
        email: 'david.lee@example.com',
        avatar: 'https://picsum.photos/seed/david/200/200',
        headline: 'Recent Computer Science Graduate',
        location: 'Remote',
        about: "Eager to apply my academic knowledge and passion for user experience research in a professional setting.",
        skills: ['User Research', 'Data Analysis', 'Figma', 'Prototyping'],
        experience: [],
        education: [
             {
                institution: 'Design College',
                degree: 'B.A. in Human-Computer Interaction',
                fieldOfStudy: 'HCI',
                graduationYear: '2023'
            }
        ],
        portfolioUrl: 'https://davidleedesign.com',
        yearsOfExperience: 1,
        userType: 'job_seeker',
        status: 'Active',
        createdDate: '2023-08-01',
    }
];

export const EMPLOYER_APPLICATIONS: EmployerApplication[] = [
    { applicant: MOCK_APPLICANTS[0], job: EMPLOYER_JOBS[0], status: 'Reviewing', appliedDate: '2024-07-25', matchPercentage: 92 },
    { applicant: MOCK_APPLICANTS[1], job: EMPLOYER_JOBS[1], status: 'Shortlisted', appliedDate: '2024-07-24', matchPercentage: 88 },
    { applicant: MOCK_APPLICANTS[2], job: EMPLOYER_JOBS[2], status: 'New', appliedDate: '2024-07-26', matchPercentage: 75 },
    { applicant: { ...MOCK_APPLICANTS[0], name: 'John Appleseed', avatar: 'https://picsum.photos/seed/john/200/200' }, job: EMPLOYER_JOBS[1], status: 'New', appliedDate: '2024-07-26', matchPercentage: 65 },
];

// --- ADMIN DATA ---
export const MOCK_ADMIN: User = {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@jobhub.com',
    avatar: 'https://picsum.photos/seed/admin/200/200',
    headline: 'Platform Administrator',
    location: 'System-wide',
    about: "Responsible for maintaining the integrity and quality of the JobHub platform.",
    skills: ['Moderation', 'System Administration', 'User Support'],
    experience: [],
    education: [],
    userType: 'admin',
    status: 'Active',
    createdDate: '2019-01-01',
};

export const MOCK_ALL_USERS: User[] = [
    MOCK_USER,
    MOCK_EMPLOYER,
    MOCK_ADMIN,
    ...MOCK_APPLICANTS.slice(1), // a few more users
    { ...MOCK_APPLICANTS[1], id: 'user-999', name: 'Chris Green', email: 'chris.g@example.com', avatar: 'https://picsum.photos/seed/chris/200/200', status: 'Suspended', createdDate: '2022-11-30' },
    { ...MOCK_EMPLOYER, id: 'emp-888', name: 'Rachel Blue', email: 'rachel.b@creative.com', avatar: 'https://picsum.photos/seed/rachel/200/200', headline: 'Lead Recruiter at Creative Solutions', createdDate: '2021-07-19' }
];

export const MODERATION_JOBS: Job[] = [
    { ...EMPLOYER_JOBS[0], id: 101, status: 'Published' },
    { ...EMPLOYER_JOBS[1], id: 102, status: 'Published' },
    { id: 103, title: 'SEO Guru Needed', companyId: 'marketing-wizards', company: 'Marketing Wizards', logo: 'https://picsum.photos/seed/wizards/100/100', location: 'Remote', type: 'Contract', posted: '1 day ago', status: 'Pending Approval', ...detailedJobs },
    { id: 104, title: 'Junior Developer (Urgent!!)', companyId: 'startup-x', company: 'Startup X', logo: 'https://picsum.photos/seed/startupx/100/100', location: 'New York, NY', type: 'Full-time', posted: '2 days ago', status: 'Flagged', ...detailedJobs, description: "This job post contains potentially problematic language and needs review." },
    { id: 105, title: 'Data Entry Clerk', companyId: 'data-corp', company: 'Data Corp', logo: 'https://picsum.photos/seed/datacorp/100/100', location: 'Remote', type: 'Part-time', posted: '5 days ago', status: 'Removed', ...detailedJobs },
    { id: 106, title: 'Social Media Manager', companyId: 'growth-co', company: 'Growth Co.', logo: 'https://picsum.photos/seed/growth/100/100', location: 'Remote', type: 'Full-time', posted: '6 days ago', status: 'Published', ...detailedJobs },
];

const INNOVATE_INC_EXTENDED_DATA = {
    values: [
        { title: 'Innovate Fearlessly', description: 'We embrace experimentation and aren\'t afraid to challenge the status quo to create groundbreaking solutions.', icon: <RocketLaunchIcon className="w-8 h-8"/> },
        { title: 'Customer-Obsessed', description: 'Our customers are at the core of everything we do. We work tirelessly to earn and keep their trust.', icon: <HeartIcon className="w-8 h-8"/> },
        { title: 'Integrity and Inclusion', description: 'We build a diverse, inclusive, and trusting environment where everyone can do their best work.', icon: <ScaleIcon className="w-8 h-8"/> },
    ],
    dayInTheLife: "A typical day at Innovate Inc. starts with a team stand-up, where we sync up on our projects over coffee. Much of the day is spent in deep-focus work, whether it's coding, designing, or strategizing. We break for lunch together, often playing a quick game of ping-pong. Afternoons are for collaboration, with breakout sessions and cross-functional meetings to keep our projects moving forward. We value work-life balance, so we wrap up our days at a reasonable time, feeling accomplished and ready for tomorrow.",
    photoGallery: [
        'https://picsum.photos/seed/gallery1/800/600',
        'https://picsum.photos/seed/gallery2/800/600',
        'https://picsum.photos/seed/gallery3/800/600',
        'https://picsum.photos/seed/gallery4/800/600',
        'https://picsum.photos/seed/gallery5/800/600',
        'https://picsum.photos/seed/gallery6/800/600',
    ],
    employeeTestimonials: [
        { id: 1, thumbnailUrl: 'https://picsum.photos/seed/emptest1/800/450', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', title: 'My Growth Journey', employeeName: 'Maria Garcia', employeeTitle: 'Lead Backend Engineer' },
        { id: 2, thumbnailUrl: 'https://picsum.photos/seed/emptest2/800/450', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', title: 'A Culture of Collaboration', employeeName: 'David Lee', employeeTitle: 'UX Researcher' },
    ],
    benefits: [
        "Top-tier medical, dental, and vision insurance",
        "Generous 401(k) matching program",
        "Flexible paid time off and parental leave",
        "Annual budget for professional development",
        "Free daily catered lunches and snacks",
        "On-site fitness center and wellness programs",
    ]
};

export const MOCK_COMPANIES: Company[] = [
    { id: 'innovate-inc', name: 'Innovate Inc.', logo: 'https://picsum.photos/seed/innovate/100/100', tagline: 'Building the Future of Technology', about: 'Innovate Inc. is a leading technology company specializing in cloud computing, artificial intelligence, and sustainable tech solutions. We are committed to pushing the boundaries of innovation and creating products that make a positive impact on the world.', website: 'innovate-inc.com', location: 'San Francisco, CA', size: '1,001-5,000 employees', industry: 'Information Technology', ...INNOVATE_INC_EXTENDED_DATA },
    { id: 'creative-solutions', name: 'Creative Solutions', logo: 'https://picsum.photos/seed/creative/100/100', tagline: 'Design That Inspires', about: 'Creative Solutions is a full-service design agency that helps brands tell their story. From UX/UI design to branding and digital marketing, we craft experiences that are beautiful, functional, and user-centric.', website: 'creative-solutions.design', location: 'New York, NY', size: '51-200 employees', industry: 'Design' },
    { id: 'tech-giant', name: 'Tech Giant', logo: 'https://picsum.photos/seed/tech/100/100', tagline: 'Connecting the World', about: 'Tech Giant is a multinational technology company that focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence. Our mission is to be Earth\'s most customer-centric company.', website: 'tech-giant.com', location: 'Seattle, WA', size: '10,001+ employees', industry: 'Internet' },
];

export const MOCK_REVIEWS: CompanyReview[] = [
  { id: 'review-1', companyId: 'innovate-inc', authorName: 'Current Employee', authorTitle: 'Software Engineer', rating: 5, title: 'Excellent place to grow', pros: 'Great culture, smart people, interesting projects. Lots of opportunities for learning and development.', cons: 'Can be fast-paced, which might not be for everyone. Work-life balance can be a challenge during crunch times.', timestamp: '2 weeks ago' },
  { id: 'review-2', companyId: 'innovate-inc', authorName: 'Former Employee', authorTitle: 'Product Manager', rating: 4, title: 'Good experience, but large company bureaucracy', pros: 'Good benefits and compensation. Stable work environment.', cons: 'Decision-making can be slow due to the size of the company. It can be hard to make a big impact individually.', timestamp: '3 months ago' },
  { id: 'review-3', companyId: 'creative-solutions', authorName: 'Current Employee', authorTitle: 'UX Designer', rating: 5, title: 'A truly creative and supportive environment', pros: 'Management trusts the design team and gives us creative freedom. The team is collaborative and friendly.', cons: 'The office snacks could be better!', timestamp: '1 month ago' },
];

export const MOCK_POSTS: UserPost[] = [
    {
        id: 'post-1',
        author: {
            id: 'user-789',
            name: 'Maria Garcia',
            avatar: 'https://picsum.photos/seed/maria/200/200',
            headline: 'Backend Developer | Go, Python, Microservices'
        },
        content: "Excited to share that I've just open-sourced a new Go library for simplifying microservice communication! Check it out on my GitHub. #golang #opensource #backend",
        timestamp: '2 hours ago',
        likes: 42,
        comments: 8,
    },
    {
        id: 'post-2',
        author: {
            id: MOCK_USER.id,
            name: MOCK_USER.name,
            avatar: MOCK_USER.avatar,
            headline: MOCK_USER.headline
        },
        content: "Just passed the React Fundamentals assessment here on JobHub with a 90%! The skill assessments are a great way to validate your knowledge. Highly recommend giving them a try if you haven't yet. #reactjs #frontend #skills",
        timestamp: '1 day ago',
        likes: 128,
        comments: 15,
    }
];

export const MOCK_FEED_ITEMS: FeedItem[] = [
    {
        id: 'feed-1',
        type: 'job_recommendation',
        timestamp: '2 hours ago',
        job: { ...ALL_JOBS[0], title: 'Frontend Engineer' }
    },
    {
        id: 'feed-2',
        type: 'company_update',
        timestamp: '8 hours ago',
        company: { id: 'innovate-inc', name: 'Innovate Inc.', logo: MOCK_COMPANIES[0].logo },
        updateText: "We're excited to announce our new campus expansion, focused on sustainable energy and green spaces for our employees! We believe in creating an environment where innovation can thrive. #Innovation #GreenTech"
    },
    {
        id: 'feed-3',
        type: 'article',
        timestamp: '1 day ago',
        article: {
            title: '5 Tips for Nailing Your Next Remote Job Interview',
            snippet: 'Remote interviews are the new norm. Discover key strategies to make a lasting impression through the screen, from setting up your tech to answering common questions with confidence.',
            image: 'https://picsum.photos/seed/interview/800/400'
        }
    },
    {
        id: 'feed-4',
        type: 'job_recommendation',
        timestamp: '2 days ago',
        job: ALL_JOBS[2]
    },
    {
        id: 'feed-5',
        type: 'job_recommendation',
        timestamp: '3 days ago',
        job: ALL_JOBS[4] // Backend Engineer
    },
    {
        id: 'feed-6',
        type: 'article',
        timestamp: '4 days ago',
        article: {
            title: 'How to Build a Standout Portfolio as a Developer',
            snippet: 'Your portfolio is often the first impression you make. Learn how to showcase your projects effectively and tell a compelling story about your skills and experience.',
            image: 'https://picsum.photos/seed/portfolio/800/400'
        }
    },
    {
        id: 'feed-7',
        type: 'company_update',
        timestamp: '5 days ago',
        company: { id: 'tech-giant', name: 'Tech Giant', logo: MOCK_COMPANIES[2].logo },
        updateText: "We're proud to be named one of the top workplaces for innovators for the third year in a row! A huge thank you to our incredible team for making this possible. Join us on our mission! #TopWorkplace #Hiring"
    },
];

// --- NEW DATA FOR MESSAGING AND NOTIFICATIONS ---
export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        type: 'message',
        text: "Jane Smith sent you a message about the Senior Frontend Developer role.",
        timestamp: '2 hours ago',
        isRead: false,
    },
    {
        id: 'notif-2',
        type: 'application',
        text: "Your application for Backend Engineer was viewed by Server Systems.",
        timestamp: '1 day ago',
        isRead: false,
    },
    {
        id: 'notif-3',
        type: 'system',
        text: "Welcome to JobHub! Complete your profile to get better recommendations.",
        timestamp: '3 days ago',
        isRead: true,
    }
];

const mockMessages: DirectMessage[] = [
    { id: 'msg-1', senderId: 'emp-456', text: "Hi Alex, thanks for applying for the Senior Frontend Developer position. Your profile looks impressive! I'd love to chat about your experience with Next.js.", timestamp: '2 hours ago' },
    { id: 'msg-2', senderId: 'user-123', text: "Hi Jane, thank you for reaching out! I'm definitely interested. I've been working with Next.js for the past 3 years and recently led a project migration to Next 14.", timestamp: '1 hour ago' },
    { id: 'msg-3', senderId: 'emp-456', text: "That's great to hear. Are you available for a brief call tomorrow afternoon?", timestamp: '5 minutes ago' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'convo-1',
        participant: MOCK_EMPLOYER,
        messages: mockMessages,
        unreadCount: 1,
    },
    {
        id: 'convo-2',
        participant: { ...MOCK_APPLICANTS[1] },
        messages: [{ id: 'msg-4', senderId: 'user-789', text: "Hi Alex, I saw we both applied for roles at Innovate Inc. Good luck!", timestamp: '3 days ago' }],
        unreadCount: 0,
    }
];

// --- REFERRAL DATA ---
export const MOCK_REFERRALS: Referral[] = [
    { id: 'ref-1', referredUserName: 'Chris Green', status: 'Hired', reward: '$50 Credit', date: '2024-07-20' },
    { id: 'ref-2', referredUserName: 'Rachel Blue', status: 'Signed Up', reward: 'Pending', date: '2024-07-25' },
    { id: 'ref-3', referredUserName: 'John Appleseed', status: 'Pending', reward: 'Pending', date: '2024-07-28' },
];

// --- NETWORK DATA ---
export const MOCK_CONNECTION_REQUESTS: ConnectionRequest[] = [
    {
        id: 'req-1',
        user: MOCK_APPLICANTS[1], // Maria Garcia
        mutualConnections: 5,
        timestamp: '2 days ago',
    },
    {
        id: 'req-2',
        user: MOCK_EMPLOYER, // Jane Smith
        mutualConnections: 2,
        timestamp: '1 week ago',
    }
];

export const MOCK_PEOPLE_YOU_MAY_KNOW: User[] = [
    MOCK_APPLICANTS[2], // David Lee
    { ...MOCK_EMPLOYER, id: 'emp-888', name: 'Rachel Blue', email: 'rachel.b@creative.com', avatar: 'https://picsum.photos/seed/rachel/200/200', headline: 'Lead Recruiter at Creative Solutions' },
    { ...MOCK_APPLICANTS[1], id: 'user-999', name: 'Chris Green', email: 'chris.g@example.com', avatar: 'https://picsum.photos/seed/chris/200/200', headline: 'Full Stack Engineer at Tech Solutions' },
    { ...MOCK_APPLICANTS[0], id: 'user-111', name: 'Emily White', email: 'emily.w@example.com', avatar: 'https://picsum.photos/seed/emily/200/200', headline: 'UX Designer at Pixel Perfect' },
];