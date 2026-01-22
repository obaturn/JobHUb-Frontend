# User Service - Complete PRD (Authentication + Profile Management)

## 📋 **Product Overview**

The User Service is the core service responsible for user authentication, authorization, profile management, professional networking, skill verification, and all user-related functionality for the JobHub platform.

## 🎯 **Business Objectives**

- Provide secure user authentication and authorization
- Enable comprehensive user profile management
- Support professional networking capabilities
- Manage skill verification through assessments
- Handle resume uploads and parsing
- Track user professional development
- Enable career progression insights
- Support multiple user roles (job seekers, employers, admins)

## 👥 **User Personas**

### Job Seeker
- Registers and manages account securely
- Creates and maintains professional profile
- Showcases skills and experience
- Networks with other professionals
- Takes skill assessments for verification
- Manages multiple resumes

### Employer
- Registers company account
- Views candidate profiles and skills
- Accesses verified candidate data
- Networks with potential hires
- Manages team member accounts

### Administrator
- Manages all user accounts
- Moderates professional content
- Oversees skill assessment integrity
- Handles security and compliance

## 🏗️ **System Architecture**

### **Service Overview**
```
┌─────────────────────────────────────────────────────────────┐
│                    User Service                             │
├─────────────────────────────────────────────────────────────┤
│  Authentication Module:                                     │
│  ├── Registration & Email Verification                     │
│  ├── Login/Logout & Session Management                     │
│  ├── JWT Token Management (Access + Refresh)               │
│  ├── Multi-Factor Authentication (TOTP)                    │
│  ├── Password Management & Reset                           │
│  └── OAuth Integration (Google, LinkedIn)                  │
│                                                            │
│  Profile Module:                                           │
│  ├── User Profiles & Personal Information                  │
│  ├── Skills Management & Endorsements                      │
│  ├── Work Experience & Achievements                        │
│  ├── Education & Certifications                           │
│  └── Resume Management & Parsing                          │
│                                                            │
│  Networking Module:                                        │
│  ├── Professional Connections                             │
│  ├── Connection Requests & Management                      │
│  ├── Professional Posts & Updates                         │
│  └── Network Analytics                                    │
│                                                            │
│  Assessment Module:                                        │
│  ├── Skill Assessments & Testing                          │
│  ├── Certification Management                             │
│  ├── Results Tracking & Verification                      │
│  └── Skill Badges & Credentials                           │
└─────────────────────────────────────────────────────────────┘
```

### **External Dependencies**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│  User Service   │────│  File Storage   │
│                 │    │                 │    │   (S3/MinIO)    │
│ - Rate Limiting │    │ - All User Data │    │ - Resumes       │
│ - Load Balancer │    │ - Authentication│    │ - Avatars       │
└─────────────────┘    │ - Profiles      │    │ - Certificates  │
                       │ - Networking    │    └─────────────────┘
┌─────────────────┐    │ - Assessments   │    ┌─────────────────┐
│  Kafka Events   │────│                 │────│   PostgreSQL    │
│                 │    └─────────────────┘    │                 │
│ - User Events   │                           │ - user_db       │
│ - Auth Events   │    ┌─────────────────┐    │ - Single DB     │
│ - Profile Events│────│     Redis       │────│ - All Tables    │
└─────────────────┘    │                 │    └─────────────────┘
                       │ - Sessions      │    ┌─────────────────┐
┌─────────────────┐    │ - Cache         │────│  Email Service  │
│   Vault/Secrets │────│ - Online Status │    │                 │
│                 │    └─────────────────┘    │ - Verification  │
│ - JWT Keys      │                           │ - Password Reset│
│ - Encryption    │                           │ - Notifications │
└─────────────────┘                           └─────────────────┘
```

## 🔐 **Functional Requirements**

## **PART 1: AUTHENTICATION MODULE**

### **1.1 User Registration**

#### **1.1.1 Email/Password Registration**
- **Endpoint**: `POST /api/v1/users/register`
- **Authentication**: None (Public)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "userType": "job_seeker",
  "acceptTerms": true,
  "marketingConsent": false,
  "referralCode": "REF123456"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123-456-789",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "userType": "job_seeker",
      "emailVerified": false,
      "status": "pending_verification",
      "profileCompleteness": 15
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  },
  "meta": {
    "message": "Registration successful. Please check your email to verify your account.",
    "nextStep": "email_verification"
  }
}
```

**Business Rules:**
- Email must be unique across platform
- Password: 8+ chars, uppercase, lowercase, number, special char
- User type: job_seeker, employer, admin
- Terms acceptance required
- Email verification required before full access
- Automatic profile creation with basic info

#### **1.1.2 OAuth Registration (Google)**
- **Endpoint**: `POST /api/v1/users/register/google`

**Request Body:**
```json
{
  "googleToken": "google_oauth_token_here",
  "userType": "job_seeker",
  "acceptTerms": true,
  "marketingConsent": false
}
```

### **1.2 Email Verification**

#### **1.2.1 Send Verification Email**
- **Endpoint**: `POST /api/v1/users/verify-email/send`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

#### **1.2.2 Verify Email**
- **Endpoint**: `POST /api/v1/users/verify-email`

**Request Body:**
```json
{
  "token": "verification_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123-456",
      "emailVerified": true,
      "status": "active"
    }
  },
  "meta": {
    "message": "Email verified successfully"
  }
}
```

### **1.3 User Authentication**

#### **1.3.1 Login**
- **Endpoint**: `POST /api/v1/users/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "rememberMe": true,
  "deviceInfo": {
    "deviceType": "web",
    "browser": "Chrome",
    "os": "macOS",
    "ipAddress": "192.168.1.100"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123-456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "userType": "job_seeker",
      "emailVerified": true,
      "mfaEnabled": false,
      "roles": ["job_seeker"],
      "permissions": ["jobs:read", "jobs:apply", "profile:update"],
      "profileCompleteness": 85,
      "avatarUrl": "https://cdn.jobhub.com/avatars/user-123.jpg"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900,
    "sessionId": "session-789-012"
  }
}
```

**MFA Required Response (202 Accepted):**
```json
{
  "success": false,
  "requiresMFA": true,
  "data": {
    "mfaToken": "temp_mfa_token_here",
    "methods": ["totp", "backup_code"]
  },
  "meta": {
    "message": "Multi-factor authentication required"
  }
}
```

#### **1.3.2 MFA Verification**
- **Endpoint**: `POST /api/v1/users/login/mfa`

**Request Body:**
```json
{
  "mfaToken": "temp_mfa_token_here",
  "code": "123456",
  "method": "totp"
}
```

#### **1.3.3 OAuth Login**
- **Endpoint**: `POST /api/v1/users/login/google`

**Request Body:**
```json
{
  "googleToken": "google_oauth_token_here"
}
```

### **1.4 Token Management**

#### **1.4.1 Refresh Token**
- **Endpoint**: `POST /api/v1/users/token/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### **1.4.2 Logout**
- **Endpoint**: `POST /api/v1/users/logout`
- **Authentication**: Required

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "logoutAllDevices": false
}
```

### **1.5 Multi-Factor Authentication**

#### **1.5.1 Setup TOTP**
- **Endpoint**: `POST /api/v1/users/mfa/totp/setup`
- **Authentication**: Required

**Response:**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "backupCodes": [
      "12345678",
      "87654321",
      "11223344",
      "55667788",
      "99001122"
    ]
  }
}
```

#### **1.5.2 Enable MFA**
- **Endpoint**: `POST /api/v1/users/mfa/enable`

**Request Body:**
```json
{
  "code": "123456",
  "backupCodesConfirmed": true
}
```

### **1.6 Password Management**

#### **1.6.1 Change Password**
- **Endpoint**: `PUT /api/v1/users/password/change`
- **Authentication**: Required

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewSecurePass123!"
}
```

#### **1.6.2 Forgot Password**
- **Endpoint**: `POST /api/v1/users/password/forgot`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

#### **1.6.3 Reset Password**
- **Endpoint**: `POST /api/v1/users/password/reset`

**Request Body:**
```json
{
  "token": "reset_token_here",
  "newPassword": "NewSecurePass123!"
}
```

### **1.7 Session Management**

#### **1.7.1 Get Active Sessions**
- **Endpoint**: `GET /api/v1/users/sessions`
- **Authentication**: Required

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session-123-456",
        "deviceInfo": {
          "deviceType": "web",
          "browser": "Chrome",
          "os": "macOS"
        },
        "ipAddress": "192.168.1.100",
        "location": "San Francisco, CA",
        "isCurrent": true,
        "lastAccessedAt": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-15T09:00:00Z"
      }
    ]
  }
}
```

#### **1.7.2 Revoke Session**
- **Endpoint**: `DELETE /api/v1/users/sessions/{sessionId}`
- **Authentication**: Required

## **PART 2: PROFILE MODULE**

### **2.1 Profile Management**

#### **2.1.1 Get User Profile**
- **Endpoint**: `GET /api/v1/users/profile`
- **Authentication**: Required

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user-123-456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "headline": "Senior Frontend Developer | React Expert",
      "bio": "Passionate developer with 8+ years of experience building scalable web applications...",
      "location": "San Francisco, CA",
      "avatarUrl": "https://cdn.jobhub.com/avatars/user-123.jpg",
      "websiteUrl": "https://johndoe.dev",
      "portfolioUrl": "https://portfolio.johndoe.dev",
      "socialLinks": {
        "github": "https://github.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe",
        "twitter": "https://twitter.com/johndoe"
      },
      "yearsOfExperience": 8,
      "currentSalaryRange": "140k-180k",
      "desiredSalaryRange": "160k-200k",
      "availability": "within_2_weeks",
      "remotePreference": "hybrid",
      "willingToRelocate": false,
      "profileVisibility": "public",
      "profileCompleteness": 85,
      "lastActiveAt": "2024-01-15T09:45:00Z",
      "memberSince": "2020-01-15T00:00:00Z"
    },
    "stats": {
      "profileViews": 1250,
      "connectionsCount": 89,
      "endorsementsReceived": 45,
      "assessmentsCompleted": 12
    }
  }
}
```

#### **2.1.2 Update Profile**
- **Endpoint**: `PUT /api/v1/users/profile`
- **Authentication**: Required

**Request Body:**
```json
{
  "headline": "Senior Full-Stack Developer | React & Node.js Expert",
  "bio": "Updated bio with new achievements...",
  "location": "New York, NY",
  "websiteUrl": "https://johndoe.dev",
  "portfolioUrl": "https://portfolio.johndoe.dev",
  "socialLinks": {
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe"
  },
  "availability": "immediately",
  "remotePreference": "remote_only",
  "desiredSalaryRange": "180k-220k"
}
```

#### **2.1.3 Upload Avatar**
- **Endpoint**: `POST /api/v1/users/profile/avatar`
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required

**Request:**
```
file: [avatar.jpg]
```

### **2.2 Skills Management**

#### **2.2.1 Add Skill**
- **Endpoint**: `POST /api/v1/users/skills`
- **Authentication**: Required

**Request Body:**
```json
{
  "skillName": "React",
  "proficiencyLevel": "expert",
  "yearsOfExperience": 5,
  "isPrimary": true,
  "lastUsed": "2024-01-15"
}
```

#### **2.2.2 Get User Skills**
- **Endpoint**: `GET /api/v1/users/skills`
- **Authentication**: Required

**Response:**
```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "id": "user-skill-123",
        "skill": {
          "id": "skill-react-001",
          "name": "React",
          "category": "frontend",
          "description": "JavaScript library for building user interfaces"
        },
        "proficiencyLevel": "expert",
        "yearsOfExperience": 5,
        "isPrimary": true,
        "endorsedCount": 12,
        "lastUsed": "2024-01-15",
        "assessmentScore": 92,
        "isVerified": true,
        "createdAt": "2024-01-10T10:30:00Z"
      }
    ],
    "summary": {
      "totalSkills": 25,
      "primarySkills": 8,
      "verifiedSkills": 15,
      "averageEndorsements": 6.2
    }
  }
}
```

#### **2.2.3 Endorse Skill**
- **Endpoint**: `POST /api/v1/users/{userId}/skills/{skillId}/endorse`
- **Authentication**: Required

### **2.3 Experience Management**

#### **2.3.1 Add Experience**
- **Endpoint**: `POST /api/v1/users/experience`
- **Authentication**: Required

**Request Body:**
```json
{
  "companyName": "Tech Corp Inc.",
  "companyId": "company-123-456",
  "jobTitle": "Senior Frontend Developer",
  "employmentType": "full_time",
  "location": "San Francisco, CA",
  "isRemote": false,
  "startDate": "2021-01-15",
  "endDate": null,
  "isCurrent": true,
  "description": "Led frontend development team of 5 developers, architected scalable React applications...",
  "achievements": [
    "Improved application performance by 40%",
    "Implemented new design system used across 10+ products",
    "Mentored 3 junior developers to senior level"
  ],
  "skillsUsed": ["skill-react-001", "skill-typescript-002", "skill-nodejs-003"]
}
```

#### **2.3.2 Get User Experience**
- **Endpoint**: `GET /api/v1/users/experience`
- **Authentication**: Required

### **2.4 Education Management**

#### **2.4.1 Add Education**
- **Endpoint**: `POST /api/v1/users/education`
- **Authentication**: Required

**Request Body:**
```json
{
  "institutionName": "Stanford University",
  "degreeType": "Bachelor",
  "fieldOfStudy": "Computer Science",
  "grade": "3.8 GPA",
  "startDate": "2012-09-01",
  "endDate": "2016-06-01",
  "isCurrent": false,
  "description": "Focused on software engineering, algorithms, and machine learning",
  "activities": [
    "Computer Science Club President",
    "Hackathon Winner 2015",
    "Teaching Assistant for Data Structures"
  ]
}
```

### **2.5 Resume Management**

#### **2.5.1 Upload Resume**
- **Endpoint**: `POST /api/v1/users/resumes`
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required

**Request:**
```
file: [resume.pdf]
isPrimary: true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resume": {
      "id": "resume-123-456",
      "fileName": "John_Doe_Resume_2024.pdf",
      "originalFileName": "My Resume.pdf",
      "fileSize": 2048576,
      "fileType": "application/pdf",
      "fileUrl": "https://cdn.jobhub.com/resumes/user-123/resume-456.pdf",
      "isPrimary": true,
      "uploadedAt": "2024-01-15T10:30:00Z",
      "parsingStatus": "processing",
      "downloadCount": 0
    }
  }
}
```

#### **2.5.2 Get Resumes**
- **Endpoint**: `GET /api/v1/users/resumes`
- **Authentication**: Required

## **PART 3: NETWORKING MODULE**

### **3.1 Connection Management**

#### **3.1.1 Send Connection Request**
- **Endpoint**: `POST /api/v1/users/network/connect`
- **Authentication**: Required

**Request Body:**
```json
{
  "userId": "user-789-012",
  "message": "Hi John, I'd like to connect with you. We worked together at Tech Corp and I'd love to stay in touch."
}
```

#### **3.1.2 Get Connections**
- **Endpoint**: `GET /api/v1/users/network/connections`
- **Authentication**: Required

**Response:**
```json
{
  "success": true,
  "data": {
    "connections": [
      {
        "id": "conn-123-456",
        "user": {
          "id": "user-789-012",
          "firstName": "Jane",
          "lastName": "Smith",
          "headline": "Product Manager at Startup Inc.",
          "avatarUrl": "https://cdn.jobhub.com/avatars/user-789.jpg",
          "location": "New York, NY"
        },
        "mutualConnections": 5,
        "connectedAt": "2024-01-10T15:20:00Z",
        "connectionSource": "job_application"
      }
    ]
  }
}
```

#### **3.1.3 Manage Connection Request**
- **Endpoint**: `PUT /api/v1/users/network/requests/{requestId}`
- **Authentication**: Required

**Request Body:**
```json
{
  "action": "accept",
  "message": "Great to connect with you!"
}
```

### **3.2 Professional Posts**

#### **3.2.1 Create Post**
- **Endpoint**: `POST /api/v1/users/posts`
- **Authentication**: Required

**Request Body:**
```json
{
  "content": "Excited to share that I just completed the React Advanced certification! 🎉 Looking forward to applying these new skills in upcoming projects. #react #frontend #learning",
  "visibility": "public",
  "tags": ["react", "frontend", "learning"],
  "attachments": ["image-123-456"]
}
```

## **PART 4: ASSESSMENT MODULE**

### **4.1 Skill Assessments**

#### **4.1.1 Get Available Assessments**
- **Endpoint**: `GET /api/v1/users/assessments/available`
- **Authentication**: Required

**Response:**
```json
{
  "success": true,
  "data": {
    "assessments": [
      {
        "id": "assessment-react-001",
        "skillId": "skill-react-001",
        "name": "React Fundamentals",
        "description": "Test your knowledge of React components, hooks, and state management",
        "difficultyLevel": "intermediate",
        "durationMinutes": 30,
        "questionCount": 25,
        "passingScore": 70,
        "isActive": true,
        "attempts": 0,
        "maxAttempts": 3,
        "lastAttempt": null,
        "certificateAvailable": true
      }
    ]
  }
}
```

#### **4.1.2 Start Assessment**
- **Endpoint**: `POST /api/v1/users/assessments/{assessmentId}/start`
- **Authentication**: Required

#### **4.1.3 Submit Assessment**
- **Endpoint**: `POST /api/v1/users/assessments/{assessmentId}/submit`
- **Authentication**: Required

**Request Body:**
```json
{
  "sessionId": "session-123-456",
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": "To add state to functional components"
    }
  ],
  "timeSpentSeconds": 1650
}
```

## 🗄️ **Complete Database Schema**

### **Authentication Tables**
```sql
-- Users (Main table combining auth + basic profile)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('job_seeker', 'employer', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'pending_verification')),
    
    -- Email verification
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- MFA
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    mfa_backup_codes TEXT[],
    
    -- OAuth
    google_id VARCHAR(255) UNIQUE,
    linkedin_id VARCHAR(255) UNIQUE,
    
    -- Password reset
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    refresh_token_hash VARCHAR(255) UNIQUE,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles and Permissions
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, role_id)
);

CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);
```

### **Profile Tables**
```sql
-- User Profiles (Extended profile information)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    headline VARCHAR(500),
    bio TEXT,
    location VARCHAR(255),
    avatar_url VARCHAR(500),
    website_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    social_links JSONB,
    years_of_experience INTEGER,
    current_salary_range VARCHAR(50),
    desired_salary_range VARCHAR(50),
    availability VARCHAR(50) CHECK (availability IN ('immediately', 'within_2_weeks', 'within_month', 'not_looking')),
    remote_preference VARCHAR(50) CHECK (remote_preference IN ('remote_only', 'hybrid', 'onsite', 'flexible')),
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'connections_only')),
    profile_completeness INTEGER DEFAULT 0,
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Skills
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id),
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    endorsed_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    assessment_score INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

-- Experience
CREATE TABLE user_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_id UUID,
    job_title VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50) CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'freelance', 'internship')),
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements TEXT[],
    skills_used UUID[],
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Education
CREATE TABLE user_education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    degree_type VARCHAR(100),
    field_of_study VARCHAR(255),
    grade VARCHAR(50),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    activities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Resumes
CREATE TABLE user_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    parsed_content JSONB,
    parsing_status VARCHAR(50) DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed')),
    parsing_error TEXT,
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### **Networking Tables**
```sql
-- User Connections
CREATE TABLE user_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    message TEXT,
    connection_source VARCHAR(50),
    connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, addressee_id),
    CHECK (requester_id != addressee_id)
);

-- User Posts
CREATE TABLE user_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'connections', 'private')),
    tags TEXT[],
    attachments JSONB,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skill Endorsements
CREATE TABLE skill_endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_skill_id UUID NOT NULL REFERENCES user_skills(id) ON DELETE CASCADE,
    endorser_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_skill_id, endorser_id)
);
```

### **Assessment Tables**
```sql
-- Skill Assessments
CREATE TABLE skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER NOT NULL,
    question_count INTEGER NOT NULL,
    passing_score INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Assessment Results
CREATE TABLE user_assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES skill_assessments(id),
    score INTEGER NOT NULL,
    time_taken_minutes INTEGER,
    status VARCHAR(20) CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    certificate_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, assessment_id)
);
```

## 🔄 **Event Publishing**

### **Events Published to Kafka**
```yaml
Topic: user.events

Authentication Events:
- user.registered
- user.email_verified
- user.logged_in
- user.logged_out
- user.password_changed
- user.mfa_enabled
- user.account_locked

Profile Events:
- user.profile_created
- user.profile_updated
- user.avatar_updated
- user.skill_added
- user.skill_endorsed
- user.experience_added
- user.education_added
- user.resume_uploaded

Networking Events:
- user.connection_requested
- user.connection_accepted
- user.post_created
- user.post_liked

Assessment Events:
- user.assessment_started
- user.assessment_completed
- user.certificate_earned
```

## 🔧 **Technical Specifications**

### **Technology Stack**
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL 15+ (Single database for all user data)
- **Cache**: Redis for sessions, tokens, and frequently accessed data
- **Message Queue**: Apache Kafka for event publishing
- **File Storage**: AWS S3 or MinIO for avatars, resumes, certificates
- **Security**: Spring Security 6.x with JWT
- **Email**: Integration with email service for verification/notifications

### **Performance Requirements**
- Authentication: < 200ms response time
- Profile operations: < 500ms response time
- File uploads: < 3s for files up to 10MB
- Search operations: < 300ms response time
- Real-time features: < 100ms latency

### **Security Requirements**
- JWT tokens with RS256 algorithm
- Password hashing with bcrypt (12 rounds)
- Rate limiting: 100 requests/minute per user
- MFA support with TOTP and backup codes
- Session management with device tracking
- Input validation and sanitization
- File upload security scanning
- Audit logging for all sensitive operations

This comprehensive User Service PRD combines authentication and user management into a single, cohesive service that handles all user-related functionality while maintaining security, performance, and scalability requirements.