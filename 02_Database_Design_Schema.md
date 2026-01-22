# JobHub - Complete Database Design & Schema

## 🗄️ **Database Architecture Overview**

### **Service-Owned Database Pattern**
Each microservice owns its data with controlled cross-service access through APIs and events.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   auth_db       │    │   user_db       │    │   job_db        │
│  (PostgreSQL)   │    │  (PostgreSQL)   │    │  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ - users         │    │ - profiles      │    │ - jobs          │
│ - roles         │    │ - skills        │    │ - applications  │
│ - sessions      │    │ - experience    │    │ - categories    │
│ - audit_logs    │    │ - education     │    │ - saved_jobs    │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  company_db     │    │  message_db     │    │ analytics_db    │
│  (PostgreSQL)   │    │  (PostgreSQL)   │    │ (ClickHouse)    │
│                 │    │                 │    │                 │
│ - companies     │    │ - conversations │    │ - events        │
│ - reviews       │    │ - messages      │    │ - metrics       │
│ - culture_data  │    │ - attachments   │    │ - reports       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 **1. Authentication Database (auth_db)**

### **Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('job_seeker', 'employer', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'pending_verification')),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verification_expires_at TIMESTAMP WITH TIME ZONE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    mfa_backup_codes TEXT[], -- Array of backup codes
    google_id VARCHAR(255) UNIQUE,
    linkedin_id VARCHAR(255) UNIQUE,
    github_id VARCHAR(255) UNIQUE,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_user_type ON users(user_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login_at);

-- Partial index for active users
CREATE INDEX idx_users_active ON users(id) WHERE status = 'active' AND deleted_at IS NULL;
```

### **Roles Table**
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE, -- Cannot be deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert system roles
INSERT INTO roles (name, description, is_system_role) VALUES
('job_seeker', 'Basic user role for job seekers', TRUE),
('employer', 'Role for employers posting jobs', TRUE),
('admin', 'Administrator role with full access', TRUE),
('moderator', 'Content moderation role', TRUE),
('premium_job_seeker', 'Premium job seeker with enhanced features', FALSE),
('enterprise_employer', 'Enterprise employer with advanced features', FALSE);
```

### **User Roles Table**
```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE, -- For temporary roles
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_user_roles_active ON user_roles(user_id, role_id) WHERE is_active = TRUE;
```

### **Permissions Table**
```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL, -- e.g., 'jobs', 'users', 'companies'
    action VARCHAR(50) NOT NULL,    -- e.g., 'create', 'read', 'update', 'delete'
    conditions JSONB,               -- Additional conditions for permission
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert basic permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('jobs:read', 'View job listings', 'jobs', 'read'),
('jobs:apply', 'Apply to jobs', 'jobs', 'apply'),
('jobs:create', 'Create job postings', 'jobs', 'create'),
('jobs:update', 'Update job postings', 'jobs', 'update'),
('jobs:delete', 'Delete job postings', 'jobs', 'delete'),
('users:read', 'View user profiles', 'users', 'read'),
('users:update', 'Update user profiles', 'users', 'update'),
('users:manage', 'Manage all users (admin)', 'users', 'manage'),
('companies:read', 'View company profiles', 'companies', 'read'),
('companies:create', 'Create company profiles', 'companies', 'create'),
('companies:update', 'Update company profiles', 'companies', 'update');
```

### **Role Permissions Table**
```sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
```

### **Sessions Table**
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    refresh_token_hash VARCHAR(255) UNIQUE,
    device_info JSONB, -- Browser, OS, device type
    ip_address INET,
    user_agent TEXT,
    location JSONB, -- Geolocation data
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID REFERENCES users(id),
    revoke_reason VARCHAR(100)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_active ON sessions(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### **Audit Logs Table**
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id UUID REFERENCES sessions(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    correlation_id UUID, -- For tracing across services
    severity VARCHAR(20) DEFAULT 'INFO' CHECK (severity IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partitioning by month for performance
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_correlation_id ON audit_logs(correlation_id);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
```

## 👤 **2. User Database (user_db)**

### **User Profiles Table**
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL, -- References auth_db.users.id
    headline VARCHAR(500),
    bio TEXT,
    summary TEXT,
    website_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    years_of_experience INTEGER,
    current_salary_range VARCHAR(50),
    desired_salary_range VARCHAR(50),
    availability VARCHAR(50) CHECK (availability IN ('immediately', 'within_2_weeks', 'within_month', 'not_looking')),
    remote_preference VARCHAR(50) CHECK (remote_preference IN ('remote_only', 'hybrid', 'onsite', 'flexible')),
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'connections_only')),
    profile_completeness INTEGER DEFAULT 0, -- Percentage
    last_active_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_availability ON user_profiles(availability);
CREATE INDEX idx_user_profiles_experience ON user_profiles(years_of_experience);
CREATE INDEX idx_user_profiles_visibility ON user_profiles(profile_visibility);
```

### **Skills Table**
```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50), -- e.g., 'programming', 'design', 'management'
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE, -- Admin verified skill
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);
```

### **User Skills Table**
```sql
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    skill_id UUID NOT NULL REFERENCES skills(id),
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience INTEGER,
    is_primary BOOLEAN DEFAULT FALSE, -- Top skills for the user
    endorsed_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_user_skills_proficiency ON user_skills(proficiency_level);
CREATE INDEX idx_user_skills_primary ON user_skills(user_id) WHERE is_primary = TRUE;
```

### **Experience Table**
```sql
CREATE TABLE experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    company_name VARCHAR(255) NOT NULL,
    company_id UUID, -- References company_db.companies.id if exists
    job_title VARCHAR(255) NOT NULL,
    employment_type VARCHAR(50) CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'freelance', 'internship')),
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE, -- NULL if current job
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    achievements TEXT[],
    skills_used UUID[], -- Array of skill IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_experience_user_id ON experience(user_id);
CREATE INDEX idx_experience_company_id ON experience(company_id);
CREATE INDEX idx_experience_current ON experience(user_id) WHERE is_current = TRUE;
CREATE INDEX idx_experience_dates ON experience(start_date, end_date);
```

### **Education Table**
```sql
CREATE TABLE education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    institution_name VARCHAR(255) NOT NULL,
    degree_type VARCHAR(100), -- e.g., 'Bachelor', 'Master', 'PhD', 'Certificate'
    field_of_study VARCHAR(255),
    grade VARCHAR(50), -- GPA, percentage, or grade
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    activities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_education_institution ON education(institution_name);
CREATE INDEX idx_education_degree ON education(degree_type);
```

### **Certifications Table**
```sql
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    credential_id VARCHAR(255),
    credential_url VARCHAR(500),
    issue_date DATE,
    expiration_date DATE,
    does_not_expire BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_certifications_organization ON certifications(issuing_organization);
CREATE INDEX idx_certifications_expiration ON certifications(expiration_date) WHERE expiration_date IS NOT NULL;
```

### **Resumes Table**
```sql
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500) NOT NULL, -- S3 or storage URL
    is_primary BOOLEAN DEFAULT FALSE,
    parsed_content JSONB, -- Extracted text and structured data
    parsing_status VARCHAR(50) DEFAULT 'pending' CHECK (parsing_status IN ('pending', 'processing', 'completed', 'failed')),
    parsing_error TEXT,
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_primary ON resumes(user_id) WHERE is_primary = TRUE;
CREATE INDEX idx_resumes_parsing_status ON resumes(parsing_status);
```

### **Skill Assessments Table**
```sql
CREATE TABLE skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER NOT NULL,
    question_count INTEGER NOT NULL,
    passing_score INTEGER NOT NULL, -- Percentage
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID, -- References auth_db.users.id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skill_assessments_skill_id ON skill_assessments(skill_id);
CREATE INDEX idx_skill_assessments_difficulty ON skill_assessments(difficulty_level);
CREATE INDEX idx_skill_assessments_active ON skill_assessments(is_active);
```

### **User Assessment Results Table**
```sql
CREATE TABLE user_assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    assessment_id UUID NOT NULL REFERENCES skill_assessments(id),
    score INTEGER NOT NULL, -- Percentage
    time_taken_minutes INTEGER,
    status VARCHAR(20) CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB, -- Encrypted answers for review
    is_verified BOOLEAN DEFAULT FALSE, -- Proctored or verified assessment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, assessment_id) -- One attempt per assessment
);

CREATE INDEX idx_user_assessment_results_user_id ON user_assessment_results(user_id);
CREATE INDEX idx_user_assessment_results_assessment_id ON user_assessment_results(assessment_id);
CREATE INDEX idx_user_assessment_results_score ON user_assessment_results(score);
CREATE INDEX idx_user_assessment_results_status ON user_assessment_results(status);
```

### **User Connections Table (Professional Network)**
```sql
CREATE TABLE user_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL, -- References auth_db.users.id
    addressee_id UUID NOT NULL,  -- References auth_db.users.id
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
    message TEXT, -- Connection request message
    connected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, addressee_id),
    CHECK (requester_id != addressee_id)
);

CREATE INDEX idx_user_connections_requester ON user_connections(requester_id);
CREATE INDEX idx_user_connections_addressee ON user_connections(addressee_id);
CREATE INDEX idx_user_connections_status ON user_connections(status);
CREATE INDEX idx_user_connections_accepted ON user_connections(requester_id, addressee_id) WHERE status = 'accepted';
```

This is the first part of the complete database schema. The design emphasizes:

1. **Security**: Proper indexing, constraints, and audit trails
2. **Performance**: Strategic indexes and partitioning
3. **Scalability**: UUID primary keys, proper normalization
4. **Strong Consistency**: Foreign key constraints where appropriate
5. **Flexibility**: JSONB fields for extensible data

Would you like me to continue with the remaining database schemas (Job, Company, Messaging, Analytics, etc.)?
## 💼 **
3. Job Database (job_db)**

### **Job Categories Table**
```sql
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES job_categories(id), -- For hierarchical categories
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_categories_parent_id ON job_categories(parent_id);
CREATE INDEX idx_job_categories_active ON job_categories(is_active);
CREATE INDEX idx_job_categories_slug ON job_categories(slug);
```

### **Jobs Table**
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL, -- References auth_db.users.id
    company_id UUID, -- References company_db.companies.id
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    category_id UUID REFERENCES job_categories(id),
    employment_type VARCHAR(50) NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'freelance', 'internship')),
    experience_level VARCHAR(50) CHECK (experience_level IN ('entry', 'junior', 'mid', 'senior', 'lead', 'executive')),
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    remote_policy VARCHAR(50) CHECK (remote_policy IN ('remote_only', 'hybrid', 'onsite', 'flexible')),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20) CHECK (salary_period IN ('hourly', 'daily', 'weekly', 'monthly', 'yearly')),
    show_salary BOOLEAN DEFAULT TRUE,
    required_skills UUID[], -- Array of skill IDs
    preferred_skills UUID[], -- Array of skill IDs
    application_deadline DATE,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'paused', 'closed', 'expired', 'removed')),
    priority_level INTEGER DEFAULT 0, -- For featured/promoted jobs
    application_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    external_application_url VARCHAR(500), -- If applications go to external site
    application_instructions TEXT,
    screening_questions JSONB, -- Custom questions for applicants
    auto_reject_criteria JSONB, -- Automatic rejection rules
    seo_title VARCHAR(255),
    seo_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

-- Indexes for performance and search
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_company_id ON jobs(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_category_id ON jobs(category_id);
CREATE INDEX idx_jobs_status ON jobs(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_published ON jobs(published_at) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_jobs_location ON jobs(location) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_remote ON jobs(is_remote) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_salary_range ON jobs(salary_min, salary_max) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_expires_at ON jobs(expires_at) WHERE deleted_at IS NULL;

-- Full-text search index
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || description)) WHERE deleted_at IS NULL;

-- Composite indexes for common queries
CREATE INDEX idx_jobs_active_published ON jobs(status, published_at DESC) WHERE status = 'published' AND deleted_at IS NULL;
CREATE INDEX idx_jobs_location_remote ON jobs(location, is_remote) WHERE status = 'published' AND deleted_at IS NULL;
```

### **Job Applications Table**
```sql
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    applicant_id UUID NOT NULL, -- References auth_db.users.id
    resume_id UUID, -- References user_db.resumes.id
    cover_letter TEXT,
    status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn')),
    source VARCHAR(50), -- How they found the job
    screening_answers JSONB, -- Answers to screening questions
    notes TEXT, -- Internal notes from employer
    rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Employer rating
    rejection_reason VARCHAR(255),
    interview_scheduled_at TIMESTAMP WITH TIME ZONE,
    offer_details JSONB, -- Salary, benefits, etc.
    offer_expires_at TIMESTAMP WITH TIME ZONE,
    response_deadline TIMESTAMP WITH TIME ZONE,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status_updated_by UUID, -- References auth_db.users.id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, applicant_id) -- One application per job per user
);

CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON job_applications(applied_at);
CREATE INDEX idx_job_applications_rating ON job_applications(rating) WHERE rating IS NOT NULL;

-- Composite indexes for employer queries
CREATE INDEX idx_job_applications_job_status ON job_applications(job_id, status);
CREATE INDEX idx_job_applications_employer_review ON job_applications(job_id, status, applied_at) WHERE status IN ('applied', 'screening');
```

### **Saved Jobs Table**
```sql
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    job_id UUID NOT NULL REFERENCES jobs(id),
    notes TEXT, -- Personal notes about the job
    reminder_date DATE, -- When to follow up
    tags VARCHAR(50)[], -- Personal tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX idx_saved_jobs_reminder ON saved_jobs(reminder_date) WHERE reminder_date IS NOT NULL;
```

### **Job Search Alerts Table**
```sql
CREATE TABLE job_search_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    name VARCHAR(255) NOT NULL,
    search_criteria JSONB NOT NULL, -- Search filters and keywords
    frequency VARCHAR(20) DEFAULT 'daily' CHECK (frequency IN ('immediate', 'daily', 'weekly')),
    is_active BOOLEAN DEFAULT TRUE,
    last_sent_at TIMESTAMP WITH TIME ZONE,
    job_count_since_last_sent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_search_alerts_user_id ON job_search_alerts(user_id);
CREATE INDEX idx_job_search_alerts_active ON job_search_alerts(is_active);
CREATE INDEX idx_job_search_alerts_frequency ON job_search_alerts(frequency) WHERE is_active = TRUE;
```

### **Job Views Table (Analytics)**
```sql
CREATE TABLE job_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    viewer_id UUID, -- References auth_db.users.id (NULL for anonymous)
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    session_id VARCHAR(255),
    view_duration_seconds INTEGER,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partitioned by month for performance
CREATE INDEX idx_job_views_job_id ON job_views(job_id);
CREATE INDEX idx_job_views_viewer_id ON job_views(viewer_id) WHERE viewer_id IS NOT NULL;
CREATE INDEX idx_job_views_viewed_at ON job_views(viewed_at);

-- Unique constraint to prevent duplicate views in short time
CREATE UNIQUE INDEX idx_job_views_unique ON job_views(job_id, COALESCE(viewer_id::text, ip_address::text), date_trunc('hour', viewed_at));
```

## 🏢 **4. Company Database (company_db)**

### **Companies Table**
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    legal_name VARCHAR(255),
    description TEXT,
    tagline VARCHAR(500),
    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    industry VARCHAR(100),
    company_size VARCHAR(50) CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001+')),
    founded_year INTEGER,
    headquarters_location VARCHAR(255),
    locations TEXT[], -- Array of office locations
    employee_count INTEGER,
    annual_revenue VARCHAR(50),
    company_type VARCHAR(50) CHECK (company_type IN ('startup', 'small_business', 'enterprise', 'non_profit', 'government')),
    stock_symbol VARCHAR(10),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    glassdoor_url VARCHAR(500),
    benefits TEXT[],
    perks TEXT[],
    values JSONB, -- Company values with descriptions
    culture_description TEXT,
    diversity_statement TEXT,
    remote_policy VARCHAR(50) CHECK (remote_policy IN ('remote_first', 'hybrid', 'office_first', 'flexible')),
    is_verified BOOLEAN DEFAULT FALSE, -- Verified by admin
    verification_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_by UUID, -- References auth_db.users.id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE -- Soft delete
);

CREATE INDEX idx_companies_slug ON companies(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_industry ON companies(industry) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_size ON companies(company_size) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_location ON companies(headquarters_location) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_verified ON companies(is_verified) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_status ON companies(status) WHERE deleted_at IS NULL;

-- Full-text search
CREATE INDEX idx_companies_search ON companies USING gin(to_tsvector('english', name || ' ' || COALESCE(description, ''))) WHERE deleted_at IS NULL;
```

### **Company Employees Table**
```sql
CREATE TABLE company_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    user_id UUID NOT NULL, -- References auth_db.users.id
    role VARCHAR(100), -- Job title/role at company
    department VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE, -- Can manage company profile
    is_hiring_manager BOOLEAN DEFAULT FALSE, -- Can post jobs and review applications
    employment_status VARCHAR(20) DEFAULT 'active' CHECK (employment_status IN ('active', 'inactive', 'pending')),
    start_date DATE,
    end_date DATE,
    invited_by UUID, -- References auth_db.users.id
    invitation_token VARCHAR(255),
    invitation_expires_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);

CREATE INDEX idx_company_employees_company_id ON company_employees(company_id);
CREATE INDEX idx_company_employees_user_id ON company_employees(user_id);
CREATE INDEX idx_company_employees_admin ON company_employees(company_id) WHERE is_admin = TRUE;
CREATE INDEX idx_company_employees_hiring_manager ON company_employees(company_id) WHERE is_hiring_manager = TRUE;
CREATE INDEX idx_company_employees_status ON company_employees(employment_status);
```

### **Company Reviews Table**
```sql
CREATE TABLE company_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id),
    reviewer_id UUID, -- References auth_db.users.id (can be anonymous)
    reviewer_type VARCHAR(20) CHECK (reviewer_type IN ('current_employee', 'former_employee', 'interview_candidate')),
    job_title VARCHAR(2💼 **55),
    ent VARCH3. Job AR(100),
     **Joyment_duration VARCHAR(50b C-- e.g., ateemDa "6 months"
    ol_ratingEGER NOT NULL CHECK (overall_rat <= 5),
    work_life_bal CHECK (worknce_rating >= 1 ANfe_balance_rating <
```squlture_rlg INTEGER CHECK (culture AND culture_r
    caINTEGK (career_gring >= 1 AND career_gro= 5),
    comping INTEGER CHECK ion_rating > AND cosation_rating <= 
 PRImanagement_raMARY KECEGER CHECK (managemeREtgorAng >= 1 AND managTEategoating <= 5),
    title Vries (NULL,
    pros TEXT NOT NULL,
Y DEFAndom_uuid(),HAR(100) UNIQUE NOT NU   slug VARCHAR NOT NULL,
    desion TEXmanagement TET,
    nt_ld_recommend BOOLEAN,id UUID Rb_categories(id-- For hierarchicaltegories
_url VARCHnymous BOOLEAN DEFAAR(500),
    status   _active BODEFAULT 'pendOLEANCHECK (status IN (' DEFAULT, 'approved', 'rejgged')),
 eration_notes TEXT,
    moderated_by Usort_order erences auth_db.users DEFAULT 0, created_at TIMESTAMP CURRENT_TIMESTA
    moder  upted_at TIMESTAWITH TIME ZON WITH TIME ZONE DEFAULTT_TIMESTAMP
) I helpful_count INTEGERNDEX idT 0,
    not_helob_catego ON joGER DEFAULT b_categories(p
CREAcreated_at TIMESTAMTE INDEX idxZONE DEFAUL_jobRRENT_TIMESTAM_c
    updaategories_aSTAMP WITH TIME ctiv DEFAULT CURRENT_TIMESTAMe ON joies(is_actijob_categories_sg ON job_catego;
```

CREATE INDEX idx_company_id ON comy_id);
CREATE INDEXmpany_revireviewer_id ON company_rs(reviewer_id) WHERE reviewer_id IS NOT NULL;
CREAT_company_revieatus ON company_revies);
CREATE INx_company_ews_rating ON cws(overall_rating);
### *E INDEX idx_combs Tableiews_approved ON compan**ompany_id, status, creERE status = 'appr
```

### **Com``sA Photos TabTE TABLE jdoobs (
  `sql
CREAPRIMARYE company_photos (
  KEY DUUID PRIMARY KEY DEFm_uoyer_id Udom_uuid(),
  UID LLany_id UUI, --  NULL REFERENCES companRes(id),
  ferencaded_by UUIes autidnces auth_db.use
    cile_name VAompany_id erencesLL,
    file_ur companyR(500) NOT NUL_d
    file_sbpaniNTEGER,
es.idon TEXT,
    phope VARCHAR(50) CHECK (photooffice', 'team 'culture', 'prodt')),
   ured BOOLEAN ALSE,
    disp INTEGER DEFAU
    status   titlR(20) DEFAULT 'pending' CHECKOT NULL, IN ('pending', 'a'rejected')),
  MP WITH TIME ZT CURRENT_TIME
);

CREATE     slug VARmpany_photos_company_CHNIQUEompany_photos(company NOT NULL,
CREATE INDEX idx  ompany_photos  d Tus ON companyEXT Nos(status);
CREATOTx_company_photos_companympany_id) WHERE is_feat
  `

## 💬 **5  ressaging Datqease (message_db)**
nts TEXT,
 sponsionversatbilitiesle**
```sql
CREATE  TEersations
    id UUID PR   benefits FAULT gen_randomTEXT,gory_id UUID REFategoriskill IDs
    type VARCHAR(20) DE  apT 'direct' CHplies(ipe IN (d),', 'l 0,roup', 'supp
    tRCHAR(255), -- For gro conversatio
    description   saveres_at TIMESTA_counTH TIME ZONte
    created_by UUID NOT NULL, --ed_at TIMes auth_db.users.idEne MP WITH TIME ZONE DGER LT CURRENT_TIMESTAMP,DEFAUApromoteTE,d', 'pauselosed', 'expi,d jobs
    delerchivedted_aepdateFAULT FALSE,d_aMP WITH TIME ZONE -- txternalAMP
    last_m);eferences messages.id
   last_message_at TIME ZONE,
rticipant_count IEGER DEFAULT 0,
    mee_count INTLT 0
--  created_at Indexes P WITH TIME ZONE DEFAULTf WITH TIMIMESTAMP,
    updE nd_at TIMESTAMP WITce and ZONE DEFAULT CURRENT_TIMEST search
CRZONE_apDEX idx_jobs_empp Uer_id ON jobs(eLT CURRENT_T
CREATE INDEXIMESTAMbs_company_P,TIMESTAMP Wmpany_id);
CREATE INDEX idx_coREATidx_jobs_E IITe_by ON conversadH Tstatuated_by);s  ON jobON ubn) WHlisEREhedcation IS_at) idxRE
CREATE INDEX idNDEX  staations_type ON convertus = e(type);
CREATEmote ON dx_conversations_lasjobs(isge ON conversations(last_messa_r_at DESC);
CREAemote);'pu_jobs_d';ions_archived ONsations(is_
```
s_at) WHERE expS NOT NULL;
CREATE ipants Ta_jobs_search ON jobs USING gin(toblevector('eng**itle || ' ' ||ion));
```

### **Jo DEFAULT gen_randble**
```sqonversation_lom_uID NOT NULL uidERENCES con() ON DELETE CASCA
`E  user_id UUID NOT NULL TABLEeferences aut job_appl (
    id e VARCHAR(20) DUUID PRIMFAUer' CHELT (role IN ('admin', ' gen_raid', 'member')),
 (), TIMESTAMP WITHIME ZONERRENT_TIMESTAMP,
    left_a jTIMESTAMP WITob_ NOT NUE,
    is_active LL REFERENFAULT TRUE,(id) ON DELETE CASCADE,
    last_recant_id UU_id UUID, -- ReferenID, d -sages.id
    last- ReferencUUESTAMPIDITH TIME ZONE, NOT b.resumes.id
  NRenread_count INTEGERferenULT 0,
    is_muted BOces er TEXT,inFALSE,terviing', 'found the job
    offed_until TIMEeredP WITH TIME ZON'g_answers Jrnal notes frSONBmployer
  , UNIQUE(conversation_ 'hireer_id)
)sweNTEGER CHECK (rating >rs to scratWITH TIME ZONE,ing <= 5),
r_details JSO,
    rejantection_reas(25s_conve5),sation_rticipantsion_id);
CREATE INDonversation__user_id ON conveion_participants(user
    feedback TEx_convXT,ation_participr_active ON nversation_pcipants(user_id, i is_active = TRUE;
Cx_conversation_partiread ON conversation_partits(user_idad_count) WHERE unre_count > 0;
`

### **Message**
```s
CREATE TABLE mess  es (
    id   la PRIMARY KEst_upd_at TIMESTAMPTH TId(),
    coME ZONEion_id UUID NOT NULL  DEFASNCES cTAMP,s(id) ON DEL CASCADE,
    LL; NULL, -- Ruth_db.us
```ssage_id UUID Ressages(-- For replies/s
    me VARCHA0) DEFAULext' CHECK (messtext', 'image', 'file', stem', 'job_sha
    content TEXT NOT
  metadata JSONB, -- Additional da(file infils, etc.)
   BOOLEAN DEFAULT FAE,
    edited_aESTAMP WIT ZONE,
    is_dd BOOLEA
#   delet## **SaveobTAMP WITH TIMEs Table**
``  deleted_by U`sqleferences auth_db
C   reply_count INTEGELE saved_j0,
    reaction_obs (INTEGER DEFAUL0,
    eated_at P WITH TIME ZONE LT CURRENT_TIMEP,
    updated_at TSTAMP WITH TIME ZONENT_TIMESTAMP
);

Partitioned by monerforman
   ATE INDEX i U_messages_UID ersation_id ON messaPRIMARY ersation_id, creatKEY DEFAUC);
CREATL-- Referex_messages_sendnces auth_essages(sendT gid().id
 REATE INDEX idx   jsagesob_id, _id ON messages(parentNOT NULL REFERENCE parent_message_idES d) ON DEL;
CREATE INDETE CASessages_type ON 
 REATE INDEX idx_mess   notes TEXTON messages(is_d TIMESTA

-- Full-tMPt search on messa W content
CREATE IND    dx_messages_seaush ON messages UID NONE DEo_tsvector('enFAULT CURRntent)) WHERENT_T NULL, = FALSE;
);
    UNIQidxUE(us_saver_i ss_job_id ON saved_jobs(job_idaved_jobs(u;
CREA**Message ReaTEions Table**
```sq INDEX idx_saved_E Ireated_at ON savobs(creat
```TABLE mesge_reactions (
 UUID PRIMARY KEY_random_uuid(),
L   message_id UUID NOT NUL, messages(id CASCADE,
  UID NOT- Referencuth_db.users.id
    rea VARCHAR(20) Ne', 'laughry', etc.
    created_P WITH TIME ZONE DT CURRENT_TIMESTAM
    UNIQUE(message_id   search_cria JSon_type)
);

CREATE OT NULLdx_messa, -- Search firs and_id ON message_reactioediate', ' id);
CREATE INDEparamemessage_readaily', '',_id ON mes 'ne_reactions(user_iever')),
 e BTE INDEX idx_meOOLEA_reactions_type ONN DEFAULT Eactions(reaction_t,
   

### **Message Attachmentast_run**
```sql
CR_at TITH TImessage_attachmeME ZONE,T 0,FAULT CURRENT_TIMEP
); id UUID PRIMARULT gen_random_u
x   message_savedar NOT NULL REFERENCES chesages(id)_user_ ON saveCADE,
    file_name VARCHAd_searches(uscy);
``  original_file_n`ULL,
    file_size NULL,
    fpe VARCHAR(100) N
  file_url VARCHAR(50LL,
    thumbnailAR(500), -- For ieos
 FAULT FALSE, -- Virus/malware 
CREATcan_result VARCHE INDEiews TablX iAnalytdx_savCREATE Ihes_activefrequency ON sav ON saNs(es(alert_fris_active);
CX idownload_count xDEFAULT 0,
    creaIMESTAMP WITH TIAULT CURRENT_TIME
PRCREA_saved_sIMARY KEjobs(id)ob_viewsT g.users.id (NULL for anonen_ ON DELrandomSCADE,
    session_id VARCHAR( vp_addressi_uui,
    vi INDEX idx_meew_du_attachments_message_id Oratiosage_attachments(messan INTEP WITH TIMEGERNE DEFAULT CURRENT_TIME, -- 
);_viewINDEX idx_message_as(d) WHERE vieweNOpe ON message_aT NULL;nts(file_type);
Cidx_job_vie_idx_viesage_attachments_scanned ONwt)ssage_attachment;_scanned);
```

## 📊 **6s Database (analytics*

### **User Eve
```sql
CREATE TABLCREAer_events (
    iTE_UID DEFAULT generateUjob_views_session ON job_views(se
  user_id Nullab
    session_id Str-- 🏢 **4. Company Dat Part (company_db)**
e   event_s Table*ing,
    event_name*
`` TABLE comes Map(String, String),
    page_url p`sqlanies (dom_uuid(),
CR  slug Ver Nullable(String)ARCHAR(255) UNIQUE NOT NULL,
 id e VARagent String,
    ip_aCHAR(255)CHA
    couR(2 NOode FixedString(2),
 Tring,
    device_typtring,
    browser Str
    os String,
    DateTime64(3) DEFAULT now6
    descri MergeTree()
PARTITIpt BY toYYYYMM(tiion TEXT,
 UUID PRIMARYrl VApe, timestamp, user_id)RCHAR(500), KEYER(500),
  FAULT gl dex_granularitVARCHAR(500),
   

### **Job P _url VARCHMetrics TAR(500),
    in_type dVSONB, -- ArraARCVARCHAR(5Hksn metrics
 REATE TABLE job_metri   (
    id UUIDis_verAN generateUUIDv4(),
 DEFA D_id UUID,EFAULT 'aK (statusctiv IN ('active', 'inactended')),
    created_ References au
    creMESTAMP WITH TIME ZONE DEFAURRENT_TIMEST
    updated_  stIMESTAMP WITH TIME ZONatus VART CURRENT_TIMESTAMPCULT D,'save', 'share'
  ue Fl4 DEFA,
ndation', 'direct', 'soci
CREATEer_id Nullable(U INDEX i    urcenieies(slug);s_slug ON com String, -- 'arch', 'reco
    messNDEX i Stringdx_companies_indN companies(iion_etri 
CREATE IN  companying, -es_size ON companies(c- 'viewsize);', 'appli_id NuFALSE,
CREATE INDEX idx_compa    vedatdr ON companies(statess e FixedString(2),
    tE INDEX idx_compaimestamrified ON compp DateTIPv4,ied);
CREATE I_companies_searUSING gin('english', name | COALESCE(deription, '')))
    GINE = MergeTree()
PARTITION BY ce TIMESTtimestaAMP WITH
### **Company  DER BY (jobe**
```sql
CREATE  t, metricany_reviews (
_tech_staID PRIMARY KEck tamp)),
    cony_id UUID NRENCES companies(id) ON ETE C
    reviewer_ NOT NULL, -- users.id
    job_ti VARCHAR(25
S``ployment_status VARCHAR(50) CHECK t_statu('current', er')),
  oyment_du), -- e.g., "2 years", "s"
    overallating INTEGER NOT NULL CHECK (oting >= 1 AND oveing <= 5
lture_ratTEGER CHECK (culture_ratND culturating <= 5),
  ensation_raR CHECK (compeating >= 1 ANDompensation_ratin
    work_life_balance_rating IN##GER CHECK (work_lif# **SETTINGating >= 1 AND work_life_baS ilytics Table**
```sqlNTEGER CHECK (management_rating >= 
CRndTE eer_growth_rating INTEGER CHECK (career_TABLE searexg >= 1 AND car_a,
    title VARCHAR(255) NOT NULL   search_query Strnalytics (
    pros TEXT NOT NULL,
    c resulXT NOT NULL,
    ats_count filagement TEXT,
    wouldt32,mend BOOLEAN,
    clickedymous BOOLEA_ers MULT TRUE,
    is_ap(Stlable(UUID) DEFAULT F,- Verified emplo
    status     sear_ms DEFAULT 'p UInt32,DEFAECK (statusULT now64()ished', 'flag 'removed')),
    hel INTEGER DEFAULT 0,
) ENE = Mergecount INTETree()
PAstamp)t TIMESTAMP WITH TIME ZONEEFAULT CURRENT_TIME
ORDER Bh_qd_at TIMESTuer WITH Ty, tiONE DEFAULT CURRENTmestaity P,
    UNIQUE(company_= 81r_id) -- One rper company
);
```
E INDEX idx_ciews_company_iy_ompany_id);
TE INDEX idx_companyiews_reviewer_id ON creviews(reviewer_id);
CREATE INDx_companyews_rating ONeviews(overall_rating);
INDEX idx_company_reviews_mpany_reviews(status);
CREATE pany_reviews_ted_aN company_reviews(created_
## 

###🔔 **7. Notificatie (noti
```sql
CREATE TABLE comficatio
 ## **NotificaETTINGS indexAULT gen_random_u_grable**
```snul   t_id UUID NOT NULLim companies(id) ON
 rEATEloaded_by UUID NOT TABLE ni Referngces auth_db.users.id
   , Sation_ VARCHAR(500temOT NULL,
    captplates (
    p trgd ype VARCHAR(50) CHECK (UUID PRype IN ('officeIMArs0) UNI'event', 'culture', 'QUE NOT N),
    is_feULL,ition NEAN DEFAULT FALSE,FAULT gen_randullauid(),
    name V VARCHAR(20ARCHAR(50) NOT Nshed' CHECKUble(UInt1N ('penmail', 'published', 'reject', '),
    created_at TIMpuTAMP WITH TIME sh', 'sms6 T CURRENT_TIMESTAsessionp'
);

CREATE INDEX     sumpany_photos_company_ibjandcompany_photos(c UUany_id);
CREATID DEFAULT ,hotos_type ON cy_photos(ph_type);
CREATE INDEX _photos_featurN company_photcompany_id) WHEeatured ;
```

### **Compayees Table**
```sql
E company_employees (
    bo UUID PRIMARY KEY DEdy_tegenerrandomularitJ,
    companv4(),L, REFERENCES compaCADE,
    user_id UUIDOT NULL, --ences auth_db.users.id
    job_titl    v- AR(255),
   Available template (100),
    start_dvariable
    end_date DATE, --     usAAfirrent ed Nulee
    is_culable(UUEFAUL DEFAULT TT TRUE,
    employment_type  cRCHAR(50) CHECK (employment_tyreated_'full_at TIMESTAMP WITH I 'contract', 'interD),feredechnologiCURRENT_TIMESTAMP,
    is_public BOOLEAN updated_at TE, -- Show on company page
    veriIMESTAMP WITH TMP WITH TIME ZONE,Ies usedSTAMP
);_acreated_at TIMEStication_templateNE DEFAULT CURRENT_TIs(iTAMP,
    updatve);E DEFAULT CUNT_TIMESTAMP,
   ompany_id, usert_date)
)
```
ifications Table**s_company_id ON company_e
CREATE INDEX idx_company_emp``yees_user_id ON co`sqlemployees(user_id);
###TE  INDEX idx_TABLany_empE uses_currenter_notifity_employees(cions (E is_current = T
  D

## 💬 **5. Messagi PRIMAabase (messaRY KEY**

### **Conversation DE_random_uuid()
    divr_id UHAR(50) NOT NUID NOT NULL, -ersitifSONB,ityic_db.users.id
 atATE TABLE converio and  (
    id UUID PRin(CY KEY DEFAULT gen_random_uuidHAR(255) NOT NULL,
    mype VARCHAR(20) DEFAessage Ttyp NOT NULLtype IN ('direct',pport')),
ARCHAR(255), -- For grtions
    created_b NOT NULL, -- Referauth_db.users.
    is_acEAN DEFAULT TRUE,
    lastage_at TIMESTAMP WITH E,
    messageGER DEFAULT 0,
    cTIMESTAMP WITH TIME ZONE DEFAT CURRENT_TIMESTAMP,
  d_at TIMME ZONE DURRENT_TP
);

CREATE INDEX idx_converss_created_by ON conversations(creat
 REATE INDEX id   datersations_type a JconversatiSONB, -- Additionale);
    is INDEX idx_conv_FALtions_last_message ON SE,s(last_messat);
CREATE INDEX idx_conversations ON conversationss_active);
`

### **ConversatiParticipantTable**
```sql
CREATE TAconversation_paipants (
    id UUID PRI read_at TIMP ), -- _random_uuid(),
 WITHonversation_id TIMEDeeT NULL REFERENCp lin Zrr URL DELETE CASC
    user_idLL, -- Referencesdb.u
    exae VARCHAR(20) DEFAler 'member' CHEma (role IN (lidx_user_member'))n
    joined_at TIMESTotificTH TIME ZONE DEFAations_categorMESTAMP,
    left_at TIMESTAMPy ON user_noONE,
    is_actifica',t'MESDEFAULT TRUE,
TAMP WITH TIME ZONIMESTAMP WITH TIMEE DEFAULT CUR, ' 'TIMESTAMP
)REATE INDEX idx_userings JSONB DEFAULT '{"mhP WITH TIMe, "email": true,ons_sh": true}',
    UprQUE(converiorion_id, userty O
);

CREATE INN X idx_conversation_pauseE Zints_conversation_id ON conversation_partgifpants(conversatiications(priority);
`REATE INDEX idx_c``h',  'applparticipants_user_icati conversation_partic'uants(user_id);
CREATE Ire', idx_conversation_participants_active Oetc._reasation_participants(conversation_d = FALSE;) WHERE iTRUE;
```

### **le**
```sql
CREAges (
    idARY KEY DEFAULTn_random_uu
    aonversation_id Ucti NOT NULon_ued by mo conversations(id) ON DELETE Cnthr_no
    sender_idtificatio NULL, -- References auns(us.users.id
   er_ient_message_id UUID REd, creed_at DESC)(id), -- For replies/th;
    content T,
    message_type V(20) DEFAULTCK (message_tyt', 'file', 'image',')),
    metadatFile infsystem messagils,c.
    is_edited BDEFAULT F
    edited_at TIMESTAMPCREA iE ZONE,
   ted BEAN DEFAULT
    deleted_at TIMCRTAMP WITH TIME ZONEEATE UUID PRIMARYTABY DEFAULT gen_randDEFAULT CURRENom_IMESTuuLdxtificacation_delivery_log (),
    created_at pCHANDEX idITH TIME ZONE DEFAx_T CURRENT_TIMESTAnotification_delR(50), og_sent_at O-- ge_iication_deld VARCHAR(255)ry_log_type ON ,_id);on_delivery_log(delivype);
);

-- PaCR`ned by month foance
CREAINDEX messages_ation_id
 INDEX idx_meder_id ON messages();
CREATEX idx_messages_created_es(created_a
## ATE IN💳 **8. PEAenges_parent ON messagt Databnt_message_id) WHase (payt_message_id IS NOT NUL
CREATE INDEX idx_notification_TE Iotificag_status ON notificatry_log(sta
  # **SubscriptSewiPlans Table**lio, essage TEtcR  WITH TIME ZONDEFg_notification_id ON AULT 0,tion_delivery_log(not
### **MessageCREtachmentsATE TABLE subscription_E INDEX
 ``sql
CREATE    LE message_attacid UUI (
    id UUID PD P idx_not  FAULT gen_rando DEFAUL,
    message NULL REFERENCssages(id) ON DELETE C
    file_name VARCHAR(255)  descrig_
    origcycle VARCHAme VARCHAR(255) NR(20ULL,
    fil) CHECK NTEGER NOT NUL(billing_cyption TEXTT gen_ra 'quarterly', 'yearlECK (plan_type IN ('jondom_uuid  .IMESTAel', 'enterprise')),
  iveMle_type VARCHAR(100) NOT NULL,
P W file_url VAITH TIMINT NOT NULL,EGER NOT NE, -- Price in cents
  VARCumbnail_url VARCHAHARed_at T For images/vid(3) DEMP WITH TIME ZONE DEFLT 'UCURRENT_TIMESTAMP
);_scanned BOOLEALT FALS-- Virus/malware sc
scription_pptio VARCHAR(50),
    crn_planst TIMESTAMP WIT_activeH TIME ZONET CURRENT_TIMESTAM,
);

CREATE INDEX idx_mess    tr ONhments_message_id O ion_pIMESTAMP WIents(messTH TIME 
CREATE INDEX ZONE,attile_type ON message_attachmenttype);
```

### ge Reactions 
    cancelans(is_aiason TEXT,vSTAMP WITH TIME ZONE,e);
```tTE TABLE messagus ated_at TI
    id MESTAINedITH TIME ZONE_at TULT CURRENT_TIMESTAMP
);s message_ind'))D NOT NU,enREFERENCEts INTEGEs(id) ON DELETE CAS
    user_id    stripe_ULL, -- Referencchargth_db.users.e_id VARCHAR(255stripe_payment_intent_id VARCpayment_method VARCHcur50), -- 'card', 'bank_tranrency VARCHpal',ALT 'USD',', 'failed',unded'
   RCaaction_type iluCHAR(50) NOT Nre_rea- emoji or reacson THAR(
   20) DEFal t TIMESTAMP ransaction dAU 'EFAULT CURpenT_TIMESTding' CHECK (status IN (ocessing', 'co
    mrIQUE(messageoce, user_id, reassed__type)
);

CREATat TIMX idx_mesESTAMP etad   amo(Oage_id ON messNEe_reactions(me,IMESTAMP
);TE INDEX idx_mee_reactionsON message_reactions(use
tions_uINDEX idx_payment_ser_id Oions_type ON tions_statansactions(transaction_type);
CREATE INDEuN t_transactionsnsactions_processed_at ON payment_t(s ON pions(processed_at)aymentctions(status);
CRE6. Analytics Databaslytics_db) - 
ce Data Consistency**
### **User Event## 🔄le**
```sql
 **Cross-SeE user_evenATE 
    id UUID,
INDEX idx_pat_transascription_ON payment_transactiription_id);
INDEsession_id String,
   X idx__type String,
    event_paymeles (Shared Pattn)**
    properties Map(SDEX iaymviing),
    page_url ce can implement this pent_trafor critical op
 Nullable(String
``  user_agent Nul`sqlng),
    ip_addressString),
 country Nullableg),
    city Nlable(String)
-- En eace_type chllable(String),
    b service dlable(String),
    os Nullaatabed(),g),
   eTime64(3),
 DateTime DEw()
) ENGI
    aTION BY toYYYYMM(timestggregate_type VARateR(100)_id U 
    evBY (timestamentTEGER_data JSONB NOTNUL,
 ``

### **Job A   causa Table**
```sql
CREATE TABLE job_analytics (
    id UUID,
    job_id UUID,
    employer_id UUID,
    company_id Nullable(UUID),
    event_type String, -- 'view', 'apply', 'save', 'share'
    user_id Nullable(UUID),
    session_id String,
    source String, -- 'search', 'recommendation', 'direct'
    search_query Nullable(String),
    filters Map(String, String),
    position_in_results Nullable(Int32),
    timestamp DateTime64(3),
    created_at DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, job_id, event_type);
```

### **Search Analytics Table**
```sql
CREATE TABLE search_analytics (
    id UUID,
    user_id Nullable(UUID),
    session_id String,
    query String,
    filters Map(String, String),
    results_count Int32,
    clicked_job_ids Array(UUID),
    no_results Boolean,
    search_duration_ms Int32,
    timestamp DateTime64(3),
    created_at DateTime DEFAULT now()
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, query);
```

## 🔔 **7. Notification Database (notification_db)**

### **Notification Templates Table**
```sql
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'push', 'sms', 'in_app')),
    subject_template TEXT,
    body_template TEXT NOT NULL,
    variables JSONB, -- Available template variables
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_templates_name ON notification_templates(name);
CREATE INDEX idx_notification_templates_type ON notification_templates(type);
```

### **User Notifications Table**
```sql
CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional notification data
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url VARCHAR(500), -- Deep link or action URL
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partitioned by month for performance
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_type ON user_notifications(type);
CREATE INDEX idx_user_notifications_read ON user_notifications(user_id, is_read);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at);
```

### **Notification Preferences Table**
```sql
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL, -- References auth_db.users.id
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    job_alerts BOOLEAN DEFAULT TRUE,
    application_updates BOOLEAN DEFAULT TRUE,
    messages BOOLEAN DEFAULT TRUE,
    marketing BOOLEAN DEFAULT FALSE,
    weekly_digest BOOLEAN DEFAULT TRUE,
    frequency_job_alerts VARCHAR(20) DEFAULT 'immediate' CHECK (frequency_job_alerts IN ('immediate', 'daily', 'weekly')),
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);
```

## 💳 **8. Payment Database (payment_db)**

### **Subscription Plans Table**
```sql
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('job_seeker', 'employer')),
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    features JSONB NOT NULL, -- Plan features and limits
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_plans_user_type ON subscription_plans(user_type);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
```

### **User Subscriptions Table**
```sql
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
    billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'yearly')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    auto_renew BOOLEAN DEFAULT TRUE,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_expires_at ON user_subscriptions(expires_at);
```

### **Payment Transactions Table**
```sql
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth_db.users.id
    subscription_id UUID REFERENCES user_subscriptions(id),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('subscription', 'job_posting', 'premium_feature')),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50), -- 'card', 'paypal', etc.
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    failure_reason TEXT,
    metadata JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_subscription_id ON payment_transactions(subscription_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_created_at ON payment_transactions(created_at);
```

## 🔄 **Cross-Service Data Consistency**

### **Event Sourcing Tables (Each Database)**
```sql
-- Add to each service database
CREATE TABLE domain_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    event_version INTEGER NOT NULL,
    correlation_id UUID,
    causation_id UUID,
    user_id UUID, -- Who triggered the event
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_domain_events_aggregate ON domain_events(aggregate_id, aggregate_type);
CREATE INDEX idx_domain_events_type ON domain_events(event_type);
CREATE INDEX idx_domain_events_occurred_at ON domain_events(occurred_at);
CREATE INDEX idx_domain_events_correlation_id ON domain_events(correlation_id);
```

### **Outbox Pattern Table (Each Database)**
```sql
-- For reliable event publishing
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    correlation_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_outbox_events_processed ON outbox_events(processed_at);
CREATE INDEX idx_outbox_events_retry ON outbox_events(next_retry_at) WHERE processed_at IS NULL;
```

This completes the comprehensive database design with:

✅ **Security-First Design**: Proper constraints, indexes, and audit trails
✅ **Strong Consistency**: Foreign keys and transaction boundaries
✅ **Performance Optimization**: Strategic indexing and partitioning
✅ **Scalability**: UUID primary keys, proper normalization
✅ **Event-Driven Architecture**: Event sourcing and outbox patterns
✅ **Cross-Service Communication**: Controlled data access patternstion_id UUID correlationevent
    created_by UUID,
  eventL,) NOt TIMESTAMP WITH TT NUFAULT CURREESTAMP,ts(created_at);
```

##*Sag
CREATE TABLE saga_instances (
    id UUID PRIMARY KEY Da Stategen_random_uuid() Tables (For Diransactions)**
`   saga_type VARCHAR`` NULL,
    sagaNOT NULL,P,
    completed_MESTAMP WITH TIME 
    error_med);.
```**Compliance**: Audit logs and sofds for extens GDPR
a-based event architecaintaining stronistency within each s
The design supports yible da
abase design pry**: JSONB ovides, and event-driv datandexes a iioningen sync
4. **Scalervice-owned data
3. **Performance**:T: Foreign key constraints aning, audit trd Ansactions
2. **curity**
or **Strorelatio);n ON saga_instances(corr

CREADEX idx_saga_instances
CREATE INDrent_stsaga_instances_typeep Vsaga_instancARC) ga_type);
CREATENOT NULidx_saga_inL,ances_status ON sagted'stances(st, 'failed', 'comating')),
    corrtion_id UUID UNIQUE NULL,
   TIMESTAMP WITNE DEFAULT CURR
    sta procARCHAR(20) Des TIMESTAMning' P WITH TIME s IN ('runni
);t_type);ts(correlation_id);
CREATE INDEX idx_nts_created_at 
CREATE INDidx_domarrelation ON 
nts(aggregate_nt_version);
CREATE INDEX in_events_type ON 
CREAT idx_domain_eve
CREATE UUID PRIMARY K TABLE dnt gen_rs 
    createst,  TIMESTAMP WITH TIME-- Additripe_scription_id);iod_end);
```
_transacons (ium_feature',
    id UUIDdom_uuid()
##a user_id UUIymeOT NULL, -ERENCES user- Refent TransTth_db.users.idable**
`   transaction_typsubscripR(50) CHECK (transaction_type IN ('subscription', '_id UUI``sql
CREATE TABLE pa
CREATE INDEX idx ON user_subscrions(current
id ON user_subscript
CREATIMENDEX idx_user_subscriptionser_subscriptions_status ONtSTAMPusbscriptions(status);er_id ON user_s  ('trialE s(user_id);
CREATZONNDEX idx_useE DEFAULT CUR', '_TIMESTAMP,
 due', 'c', 'expired') ZONE NOT ),LL,
    trial
r Sustripe_subscribdomn_id VARCHAR(255) UNIQUE,_uuid(),sers.id
    pliod_eanIe_custnd TIMEomer_D NOT NULL 255),ITH TIME ZON
    cu
REFERENCESt_period_s subscrilans(id),
    status) DEFAULT
    user_id NULL, -- Refer
CREAUUID PTE RIMARY KEY DETscriptions Tascriptions (
  bl
### *
CREATE INDEX CREATE SD',TH Tx_subscription_plansIME ZONE DEFAULTTIMESTAMP,
  
    trial_dayfeaturGER DEFAULT 0,
    cesNULL, -- eatures 
    is_active BOOLEAN DE   LT TRUE,rplan_type VARCHAR(50) ed_at TIMESTAM00) NOTP WE,
    created_a
    prory_cv
tion Dlivery_type VARCHAR(20) el_ucation_i 'email', 'push', 'sd UUID sey Log Ta user_notiblr_notif(id),
    recipient VARCHAR(255 notifNULL, -- Email, ictatusatio('pending', 'sent', deviceered', 'failed', 'bo token
    ns(user_id, is_r0) DEFAULT 'pending' Cea
CRErl VAtific
    category VARCHAR(50), -- 
C   priorityREATE INDEX 'normal' CHECK (priori
  EATE INDEX idx_notific  perks JSONBes_type ON n, -- ARCHAR(50),N ('startup', 'private',ic', 'nonprofit', '')),
    stock_symbol VARCHAR(500),
    benefits   talues JSONB, -- Array watemeiebook_unt TEXrl VARCHAR(EXT,
 500),
    culture_descripti glasstter_l (10),HAR(500),
    linkedin
    co
    revenue_range##  company_siTEXT[], -- ze VARCHARifice locations
    employee_count INTtioned  d((company_size ),_view10', '11-50', '51-200's_'201-500', 'viewer_0', '1001-5000', '5000+')),
id OfoundeN dth for peER,
    headquartrforVARCHAR(255),mans spent viewing
    vi INDEX idx_job_vieUUIjob_id ON job_vigent TE_id);
CREAXT,
    referrer VAD, -- Refer (
ob_id UUID NOT NULL RE
    creaTAMP WITH TIME ZONE DEFAULT CURR
    updaP WITH 
    resultst INTEGER
    alert_fency VARCHAR(20) CHEalert_frequenc
### **Ss Table**
``id EAUUID PRIMARYTE TABLE `sq gen_raes auth_dbndom_uuhe(),
    name VARCHAR(255) NOT     user_id Us (ULL, -- R
  
  EATE INDEX idx_saved_j  creat    UNI aDEX idx_job_apppplations_rating ON icb_applications(ant_ng) WHERE ratiid) -- Onication peried_at ON job_appl job ons(applied_at);ps);
CREATE I_applicati
CRapplications(st

CREATE INDEX idx_job_applicEATE I_apptus ON licant_id ON dx_job_applicons(applicantations_ied_at TN job_applications(job_id)IMESTAMP      idME ZONE DEFAULT CUx_conversation_pinteeening qeeduled_at TIMEjecteds
 REATE INDEX idx_   nopplications_stes TEXT, -', 'w
    source VARCHAR(50), -auids VARCHAR(20) DEed' CHECK (stated', 'screen
    resume
### **CCABLE conversatRcatIMlNDn PaEX  (
    idx_joD PRIMAbs_eyZONyment_typel ON jobs(experience_le ONax) WHERE salary_min I jobs(eULL;
CREATE INDEXmE, jobsbsexpires_at ON _ype);
CREATE INDEX idx_jobs_sa INDlocatio(cateexperience_lgorsalay_id);
CREATE INDEX idx_AT
  _ur  VARCHAR(500), tomatic re-appl 'remyis
    publing externaovedount INTEGER DEFAULT 0,
    applic'))iew_count INSONB, -- CustomTEG,ions for applicants
    scto_reject_criterireJSONB, --ening_questi TEGER DEFAULT-- For featur
    sad',_date DATE,aft' CHECK ( ('draft', 'pu
    s 'eus VARCHAR(20) xecutive')
    location VAR55), 'UID[], -- ArrayUSD',('hourly', 'daily 'wee
    preferred_kly', 'monly')),
  quired_ski  shlls UowD[], -- Array of _salN DEFAULT TRUE,
  
    sry_period VARCHA_perio
    isOary_currencry_mRCHAR(3) DEFAin INTEGER,
    OLEAN DEFAULT FA
 p  salary_ma  remoloypolicy VARCHAR(50) CHECK (rment_type VARC NOT Nlly_remote', 'hybrid', 'onsite', ULL xible')),
CH) CHECK ECKperience_level IN (oyment_type IN (', 'mid', 'full_'part_tim, 'freelance', 'in