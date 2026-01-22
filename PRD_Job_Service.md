# Job Service - Product Requirements Document (PRD)

## 📋 **Product Overview**

The Job Service is the core service responsible for job posting management, job search functionality, application processing, and job-related analytics for the JobHub platform.

## 🎯 **Business Objectives**

- Enable employers to create and manage job postings
- Provide advanced job search capabilities for job seekers
- Process and track job applications
- Deliver personalized job recommendations
- Generate job performance analytics
- Support job marketplace monetization

## 👥 **User Personas**

### Job Seeker
- Searches for relevant job opportunities
- Applies to jobs with resume and cover letter
- Saves interesting jobs for later review
- Receives personalized job recommendations
- Tracks application status and progress

### Employer
- Creates and publishes job postings
- Manages job applications and candidates
- Reviews candidate profiles and resumes
- Updates application statuses
- Analyzes job posting performance

### Administrator
- Moderates job postings for quality and compliance
- Manages job categories and classifications
- Monitors platform job metrics
- Handles job-related disputes

## 🏗️ **System Architecture**

### **Service Dependencies**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │────│   Job Service   │────│  User Service   │
│                 │    │                 │    │                 │
│ - User Identity │    │ - Job Postings  │    │ - User Profiles │
│ - Permissions   │    │ - Applications  │    │ - Skills Data   │
└─────────────────┘    │ - Search        │    │ - Experience    │
                       │ - Recommendations│    └─────────────────┘
┌─────────────────┐    │                 │    ┌─────────────────┐
│ Company Service │────│                 │────│  Elasticsearch  │
│                 │    └─────────────────┘    │                 │
│ - Company Data  │                           │ - Job Search    │
│ - Verification  │    ┌─────────────────┐    │ - Indexing      │
└─────────────────┘    │   PostgreSQL    │    │ - Aggregations  │
                       │                 │    └─────────────────┘
┌─────────────────┐    │ - job_db        │    ┌─────────────────┐
│  Kafka Events   │────│ - Jobs          │────│   AI Service    │
│                 │    │ - Applications  │    │                 │
│ - Job Events    │    │ - Categories    │    │ - Job Matching  │
│ - App Events    │    │ - Saved Jobs    │    │ - Recommendations│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 **Functional Requirements**

### **1. Job Management (Employer)**

#### **1.1 Create Job Posting**
- **Endpoint**: `POST /api/v1/jobs`
- **Authentication**: Required (Employer role)
- **Authorization**: User must have 'jobs:create' permission

**Request Body:**
```json
{
  "title": "Senior Frontend Developer",
  "description": "We are looking for an experienced frontend developer...",
  "requirements": "5+ years of React experience, TypeScript proficiency...",
  "responsibilities": [
    "Develop user-facing features using React",
    "Collaborate with design team on UI/UX",
    "Optimize applications for maximum speed and scalability"
  ],
  "categoryId": "cat-frontend-001",
  "employmentType": "full_time",
  "experienceLevel": "senior",
  "location": "San Francisco, CA",
  "isRemote": true,
  "remotePolicy": "hybrid",
  "salaryMin": 140000,
  "salaryMax": 180000,
  "salaryCurrency": "USD",
  "salaryPeriod": "yearly",
  "showSalary": true,
  "requiredSkills": ["skill-react-001", "skill-typescript-002"],
  "preferredSkills": ["skill-nextjs-003", "skill-graphql-004"],
  "benefits": [
    "Comprehensive health insurance",
    "401k with company match",
    "Flexible PTO",
    "Remote work stipend"
  ],
  "applicationDeadline": "2024-03-01",
  "startDate": "2024-03-15",
  "screeningQuestions": [
    {
      "question": "How many years of React experience do you have?",
      "type": "multiple_choice",
      "options": ["1-2 years", "3-4 years", "5+ years"],
      "required": true
    },
    {
      "question": "Are you authorized to work in the US?",
      "type": "yes_no",
      "required": true
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "id": "job-123-456-789",
      "slug": "senior-frontend-developer-tech-corp",
      "title": "Senior Frontend Developer",
      "status": "draft",
      "employerId": "user-employer-001",
      "companyId": "company-tech-corp",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Business Rules:**
- Job title limited to 100 characters
- Description limited to 10,000 characters
- Salary range validation (min < max)
- Required skills must exist in skills database
- Screening questions limited to 10 per job
- Application deadline must be future date
- Employer can have maximum 50 active jobs (configurable by plan)

#### **1.2 Publish Job**
- **Endpoint**: `PUT /api/v1/jobs/{jobId}/publish`
- **Authentication**: Required (Job owner or Admin)

**Request Body:**
```json
{
  "publishedAt": "2024-01-15T12:00:00Z"
}
```

**Business Rules:**
- Job must be in 'draft' status
- All required fields must be completed
- Job goes through moderation queue if flagged
- Published jobs are indexed in Elasticsearch
- Triggers job recommendation engine update

#### **1.3 Update Job Status**
- **Endpoint**: `PUT /api/v1/jobs/{jobId}/status`

**Request Body:**
```json
{
  "status": "paused",
  "reason": "Reviewing current applications"
}
```

**Status Transitions:**
- `draft` → `published`, `removed`
- `published` → `paused`, `closed`, `removed`
- `paused` → `published`, `closed`, `removed`
- `closed` → `published` (if within 30 days)

#### **1.4 Get Employer Jobs**
- **Endpoint**: `GET /api/v1/jobs/employer/my-jobs`
- **Query Parameters**:
  - `status`: Filter by job status
  - `page`: Page number
  - `limit`: Items per page
  - `sort`: Sort by (created_date, title, applications_count)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job-123-456",
        "title": "Senior Frontend Developer",
        "status": "published",
        "location": "San Francisco, CA",
        "employmentType": "full_time",
        "publishedAt": "2024-01-15T12:00:00Z",
        "applicationDeadline": "2024-03-01T23:59:59Z",
        "stats": {
          "applicationsCount": 45,
          "viewsCount": 1250,
          "savesCount": 89,
          "applicationRate": 3.6
        }
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

### **2. Job Search & Discovery**

#### **2.1 Advanced Job Search**
- **Endpoint**: `GET /api/v1/jobs/search`
- **Query Parameters**:
  - `q`: Search query (job title, company, skills)
  - `location`: Location filter with radius support
  - `remote`: Remote work filter (true/false)
  - `employmentType`: Employment type filter (comma-separated)
  - `experienceLevel`: Experience level filter
  - `salaryMin`: Minimum salary
  - `salaryMax`: Maximum salary
  - `companySize`: Company size filter
  - `industry`: Industry filter
  - `postedWithin`: Days since posted (7, 14, 30)
  - `skills`: Required skills (comma-separated skill IDs)
  - `benefits`: Benefits filter
  - `page`: Page number
  - `limit`: Results per page (max 50)
  - `sort`: Sort order (relevance, date, salary, distance)

**Example Request:**
```
GET /api/v1/jobs/search?q=frontend+developer&location=San+Francisco,CA&radius=25&remote=true&employmentType=full_time,contract&experienceLevel=mid,senior&salaryMin=100000&postedWithin=14&sort=relevance&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job-123-456",
        "title": "Senior Frontend Developer",
        "slug": "senior-frontend-developer-tech-corp",
        "company": {
          "id": "company-tech-corp",
          "name": "Tech Corp",
          "logoUrl": "https://cdn.jobhub.com/logos/tech-corp.png",
          "size": "201-500",
          "industry": "Technology",
          "rating": 4.2
        },
        "location": "San Francisco, CA",
        "distance": 5.2,
        "isRemote": true,
        "remotePolicy": "hybrid",
        "employmentType": "full_time",
        "experienceLevel": "senior",
        "salaryRange": {
          "min": 140000,
          "max": 180000,
          "currency": "USD",
          "period": "yearly",
          "showSalary": true
        },
        "description": "We are looking for an experienced frontend developer...",
        "requiredSkills": [
          {
            "id": "skill-react-001",
            "name": "React",
            "category": "frontend"
          }
        ],
        "benefits": ["Health insurance", "401k matching"],
        "postedAt": "2024-01-10T14:30:00Z",
        "applicationDeadline": "2024-02-10T23:59:59Z",
        "stats": {
          "applicationsCount": 45,
          "viewsCount": 1250
        },
        "matchScore": 92,
        "isApplied": false,
        "isSaved": false,
        "relevanceScore": 0.95
      }
    ],
    "facets": {
      "locations": [
        {"value": "San Francisco, CA", "count": 125},
        {"value": "New York, NY", "count": 98}
      ],
      "companies": [
        {"value": "Tech Corp", "count": 15},
        {"value": "Startup Inc", "count": 12}
      ],
      "employmentTypes": [
        {"value": "full_time", "count": 180},
        {"value": "contract", "count": 45}
      ],
      "experienceLevels": [
        {"value": "senior", "count": 89},
        {"value": "mid", "count": 156}
      ],
      "skills": [
        {"value": "React", "count": 89},
        {"value": "JavaScript", "count": 156}
      ],
      "salaryRanges": [
        {"range": "100k-150k", "count": 67},
        {"range": "150k-200k", "count": 45}
      ]
    }
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "totalPages": 63
  },
  "searchMeta": {
    "query": "frontend developer",
    "searchTime": 45,
    "totalResults": 1250,
    "appliedFilters": {
      "location": "San Francisco, CA",
      "remote": true,
      "employmentType": ["full_time", "contract"]
    }
  }
}
```

#### **2.2 Job Autocomplete/Suggestions**
- **Endpoint**: `GET /api/v1/jobs/search/suggestions`
- **Query Parameters**:
  - `q`: Partial search query
  - `type`: Suggestion type (job_titles, companies, skills, locations)

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "job_title",
        "value": "Frontend Developer",
        "count": 245
      },
      {
        "type": "company",
        "value": "Tech Corp",
        "count": 15
      },
      {
        "type": "skill",
        "value": "React",
        "count": 189
      }
    ]
  }
}
```

#### **2.3 Job Recommendations**
- **Endpoint**: `GET /api/v1/jobs/recommendations`
- **Authentication**: Required
- **Query Parameters**:
  - `limit`: Number of recommendations (default: 10, max: 50)
  - `reason`: Include recommendation reasoning

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "job": {
          "id": "job-789-012",
          "title": "React Developer",
          "company": {
            "name": "Startup Inc",
            "logoUrl": "https://cdn.jobhub.com/logos/startup.png"
          },
          "location": "Remote",
          "salaryRange": {
            "min": 120000,
            "max": 160000,
            "currency": "USD"
          }
        },
        "matchScore": 88,
        "reasons": [
          "Matches your React expertise",
          "Salary aligns with your preferences",
          "Remote work matches your preference"
        ],
        "recommendationType": "skill_match"
      }
    ]
  }
}
```

### **3. Job Applications**

#### **3.1 Apply to Job**
- **Endpoint**: `POST /api/v1/jobs/{jobId}/apply`
- **Authentication**: Required (Job Seeker)

**Request Body:**
```json
{
  "resumeId": "resume-123-456",
  "coverLetter": "Dear Hiring Manager,\n\nI am excited to apply for the Senior Frontend Developer position...",
  "screeningAnswers": [
    {
      "questionId": "q1",
      "answer": "5+ years"
    },
    {
      "questionId": "q2",
      "answer": "yes"
    }
  ],
  "source": "job_search"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "application": {
      "id": "app-123-456-789",
      "jobId": "job-123-456",
      "applicantId": "user-123-456",
      "status": "applied",
      "appliedAt": "2024-01-15T10:30:00Z",
      "applicationNumber": "APP-2024-001234"
    }
  }
}
```

**Business Rules:**
- Cannot apply to same job twice
- Resume must belong to applicant
- Cover letter limited to 5000 characters
- All required screening questions must be answered
- Job must be in 'published' status
- Application deadline must not be passed
- Triggers notification to employer

#### **3.2 Get My Applications**
- **Endpoint**: `GET /api/v1/jobs/applications/my-applications`
- **Authentication**: Required (Job Seeker)
- **Query Parameters**:
  - `status`: Filter by application status
  - `dateFrom`: Applications from date
  - `dateTo`: Applications to date
  - `page`: Page number
  - `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app-123-456",
        "job": {
          "id": "job-123-456",
          "title": "Senior Frontend Developer",
          "company": {
            "name": "Tech Corp",
            "logoUrl": "https://cdn.jobhub.com/logos/tech-corp.png"
          },
          "location": "San Francisco, CA",
          "employmentType": "full_time"
        },
        "status": "interviewing",
        "appliedAt": "2024-01-10T14:30:00Z",
        "lastUpdatedAt": "2024-01-12T09:15:00Z",
        "timeline": [
          {
            "status": "applied",
            "timestamp": "2024-01-10T14:30:00Z",
            "note": "Application submitted"
          },
          {
            "status": "resume_viewed",
            "timestamp": "2024-01-11T10:20:00Z",
            "note": "Resume reviewed by hiring manager"
          },
          {
            "status": "interviewing",
            "timestamp": "2024-01-12T09:15:00Z",
            "note": "Invited for technical interview"
          }
        ],
        "interviewDetails": {
          "scheduledAt": "2024-01-18T14:00:00Z",
          "type": "technical",
          "duration": 60,
          "interviewerName": "Jane Smith",
          "meetingLink": "https://zoom.us/j/123456789"
        }
      }
    ]
  }
}
```

#### **3.3 Withdraw Application**
- **Endpoint**: `DELETE /api/v1/jobs/applications/{applicationId}`
- **Authentication**: Required (Application owner)

**Business Rules:**
- Can only withdraw own applications
- Cannot withdraw after 'offered' status
- Sends notification to employer
- Application marked as 'withdrawn', not deleted

### **4. Job Application Management (Employer)**

#### **4.1 Get Job Applications**
- **Endpoint**: `GET /api/v1/jobs/{jobId}/applications`
- **Authentication**: Required (Job owner or Admin)
- **Query Parameters**:
  - `status`: Filter by application status
  - `rating`: Filter by rating (1-5)
  - `matchScore`: Minimum match score
  - `appliedFrom`: Applications from date
  - `appliedTo`: Applications to date
  - `page`: Page number
  - `limit`: Items per page
  - `sort`: Sort by (date, rating, match_score, name)

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "app-123-456",
        "applicant": {
          "id": "user-789-012",
          "firstName": "John",
          "lastName": "Doe",
          "headline": "Senior Frontend Developer",
          "avatarUrl": "https://cdn.jobhub.com/avatars/user-789.jpg",
          "location": "San Francisco, CA",
          "yearsOfExperience": 8
        },
        "status": "applied",
        "appliedAt": "2024-01-10T14:30:00Z",
        "resume": {
          "id": "resume-456-789",
          "fileName": "John_Doe_Resume.pdf",
          "fileUrl": "https://cdn.jobhub.com/resumes/resume-456.pdf"
        },
        "coverLetter": "Dear Hiring Manager...",
        "screeningAnswers": [
          {
            "question": "How many years of React experience do you have?",
            "answer": "5+ years"
          }
        ],
        "matchScore": 92,
        "rating": null,
        "notes": null,
        "source": "job_search"
      }
    ]
  },
  "stats": {
    "totalApplications": 45,
    "newApplications": 12,
    "inReview": 15,
    "interviewing": 8,
    "offered": 2,
    "hired": 1,
    "rejected": 7,
    "averageMatchScore": 78
  }
}
```

#### **4.2 Update Application Status**
- **Endpoint**: `PUT /api/v1/jobs/applications/{applicationId}/status`
- **Authentication**: Required (Job owner or Admin)

**Request Body:**
```json
{
  "status": "interviewing",
  "rating": 4,
  "notes": "Strong technical background, good cultural fit",
  "feedback": "Excellent React skills demonstrated in portfolio",
  "interviewDetails": {
    "scheduledAt": "2024-01-18T14:00:00Z",
    "type": "technical",
    "duration": 60,
    "interviewerName": "Jane Smith",
    "meetingLink": "https://zoom.us/j/123456789"
  }
}
```

**Status Flow:**
- `applied` → `screening`, `rejected`
- `screening` → `interviewing`, `rejected`
- `interviewing` → `offered`, `rejected`
- `offered` → `hired`, `rejected`

**Business Rules:**
- Status changes trigger notifications to applicant
- Rating is optional (1-5 scale)
- Notes are internal only
- Feedback is shared with applicant
- Interview details required for 'interviewing' status

### **5. Saved Jobs**

#### **5.1 Save Job**
- **Endpoint**: `POST /api/v1/jobs/{jobId}/save`
- **Authentication**: Required

**Request Body:**
```json
{
  "notes": "Interesting opportunity, good salary range"
}
```

#### **5.2 Get Saved Jobs**
- **Endpoint**: `GET /api/v1/jobs/saved`
- **Authentication**: Required
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `sort`: Sort by (saved_date, job_title, company)

### **6. Job Analytics**

#### **6.1 Job Performance Analytics**
- **Endpoint**: `GET /api/v1/jobs/{jobId}/analytics`
- **Authentication**: Required (Job owner or Admin)
- **Query Parameters**:
  - `period`: Time period (7d, 30d, 90d)
  - `metrics`: Specific metrics to include

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "job-123-456",
    "period": "30d",
    "metrics": {
      "views": {
        "total": 1250,
        "unique": 980,
        "dailyAverage": 41.7,
        "trend": "+15%"
      },
      "applications": {
        "total": 45,
        "conversionRate": 3.6,
        "dailyAverage": 1.5,
        "trend": "+8%"
      },
      "saves": {
        "total": 89,
        "saveRate": 7.1,
        "trend": "+12%"
      },
      "sources": {
        "job_search": 65,
        "recommendations": 20,
        "company_page": 10,
        "external": 5
      },
      "candidateQuality": {
        "averageMatchScore": 78,
        "qualifiedApplicants": 32,
        "qualificationRate": 71
      }
    },
    "timeline": [
      {
        "date": "2024-01-15",
        "views": 52,
        "applications": 3,
        "saves": 4
      }
    ]
  }
}
```

## 🗄️ **Database Schema**

### **Core Tables**
```sql
-- Job Categories
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES job_categories(id),
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Jobs
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL,
    company_id UUID,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    benefits TEXT,
    category_id UUID REFERENCES job_categories(id),
    employment_type VARCHAR(50) NOT NULL,
    experience_level VARCHAR(50),
    location VARCHAR(255),
    is_remote BOOLEAN DEFAULT FALSE,
    remote_policy VARCHAR(50),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20),
    show_salary BOOLEAN DEFAULT TRUE,
    required_skills UUID[],
    preferred_skills UUID[],
    application_deadline DATE,
    start_date DATE,
    status VARCHAR(20) DEFAULT 'draft',
    priority_level INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    external_apply_url VARCHAR(500),
    application_instructions TEXT,
    screening_questions JSONB,
    auto_reject_criteria JSONB,
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Job Applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL,
    resume_id UUID,
    cover_letter TEXT,
    status VARCHAR(20) DEFAULT 'applied',
    source VARCHAR(50),
    screening_answers JSONB,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    interview_details JSONB,
    match_score INTEGER,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, applicant_id)
);

-- Saved Jobs
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- Job Views (Analytics)
CREATE TABLE job_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    viewer_id UUID,
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    session_id VARCHAR(255),
    view_duration INTEGER,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 **Event Publishing**

### **Events Published to Kafka**
```yaml
Topic: job.events

Event Types:
- job.created
- job.published
- job.updated
- job.paused
- job.closed
- job.expired
- job.viewed
- job.saved
- job.applied
- job.application_status_changed
- job.application_withdrawn
```

### **Event Schema Example**
```json
{
  "eventId": "evt_job_001",
  "eventType": "job.applied",
  "eventVersion": "1.0",
  "aggregateId": "job-123-456",
  "aggregateType": "Job",
  "correlationId": "corr_application_001",
  "userId": "user-789-012",
  "timestamp": "2024-01-15T10:30:00.123Z",
  "source": "job-service",
  "data": {
    "jobId": "job-123-456",
    "applicantId": "user-789-012",
    "applicationId": "app-123-456",
    "employerId": "user-employer-001",
    "resumeId": "resume-456-789",
    "source": "job_search",
    "matchScore": 92
  }
}
```

## 🔧 **Technical Specifications**

### **Technology Stack**
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL 15+
- **Search Engine**: Elasticsearch 8.x
- **Cache**: Redis for frequently accessed data
- **Message Queue**: Apache Kafka
- **File Storage**: AWS S3 or MinIO for resumes/documents
- **AI/ML**: Python microservice for job matching algorithms

### **Performance Requirements**
- Job search: < 300ms response time
- Job creation: < 500ms response time
- Application submission: < 400ms response time
- Job recommendations: < 200ms response time
- Analytics queries: < 1s response time

### **Elasticsearch Integration**
```json
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "standard",
        "boost": 2.0
      },
      "description": {
        "type": "text",
        "analyzer": "standard"
      },
      "company": {
        "type": "object",
        "properties": {
          "name": {"type": "keyword"},
          "industry": {"type": "keyword"}
        }
      },
      "location": {
        "type": "geo_point"
      },
      "skills": {
        "type": "nested",
        "properties": {
          "name": {"type": "keyword"},
          "required": {"type": "boolean"}
        }
      },
      "salary": {
        "type": "integer_range"
      },
      "published_at": {
        "type": "date"
      }
    }
  }
}
```

This Job Service PRD provides comprehensive specifications for implementing job posting management, advanced search capabilities, application processing, and job analytics functionality.