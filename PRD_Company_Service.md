# Company Service - Product Requirements Document (PRD)

## 📋 **Product Overview**

The Company Service manages company profiles, reviews, culture information, employee verification, and company-related analytics for the JobHub platform.

## 🎯 **Business Objectives**

- Enable companies to create comprehensive profiles
- Provide transparency through employee reviews
- Showcase company culture and values
- Support employer branding initiatives
- Facilitate employee verification and networking
- Generate company analytics and insights

## 👥 **User Personas**

### Company Administrator
- Creates and manages company profile
- Responds to reviews and feedback
- Uploads company photos and content
- Manages employee verification
- Views company analytics

### Job Seeker
- Researches potential employers
- Reads company reviews and ratings
- Views company culture and benefits
- Explores company employee network
- Makes informed application decisions

### Current/Former Employee
- Submits company reviews
- Verifies employment history
- Shares company insights
- Participates in employer branding

## 🏗️ **System Architecture**

### **Service Dependencies**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │────│ Company Service │────│  User Service   │
│                 │    │                 │    │                 │
│ - User Identity │    │ - Company Data  │    │ - Employee Data │
│ - Permissions   │    │ - Reviews       │    │ - Verification  │
└─────────────────┘    │ - Culture Info  │    └─────────────────┘
                       │ - Analytics     │    
┌─────────────────┐    │                 │    ┌─────────────────┐
│   Job Service   │────│                 │────│  File Storage   │
│                 │    └─────────────────┘    │                 │
│ - Job Postings  │                           │ - Company Logos │
│ - Applications  │    ┌─────────────────┐    │ - Photos        │
└─────────────────┘    │   PostgreSQL    │    │ - Documents     │
                       │                 │    └─────────────────┘
┌─────────────────┐    │ - company_db    │    ┌─────────────────┐
│  Kafka Events   │────│ - Companies     │────│  Elasticsearch  │
│                 │    │ - Reviews       │    │                 │
│ - Company Events│    │ - Photos        │    │ - Company Search│
│ - Review Events │    │ - Employees     │    │ - Review Search │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 **Functional Requirements**

### **1. Company Profile Management**

#### **1.1 Create/Update Company Profile**
- **Endpoint**: `PUT /api/v1/companies/{companyId}`
- **Authentication**: Required (Company Admin)
- **Authorization**: User must be company admin or platform admin

**Request Body:**
```json
{
  "name": "Tech Corp Inc.",
  "legalName": "Tech Corp Incorporated",
  "description": "Leading technology company specializing in cloud computing and AI solutions...",
  "tagline": "Building the Future of Technology",
  "websiteUrl": "https://techcorp.com",
  "industry": "Information Technology",
  "companySize": "201-500",
  "foundedYear": 2010,
  "headquarters": "San Francisco, CA",
  "locations": [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Remote"
  ],
  "employeeCount": 350,
  "revenueRange": "50M-100M",
  "companyType": "private",
  "stockSymbol": null,
  "socialLinks": {
    "linkedin": "https://linkedin.com/company/tech-corp",
    "twitter": "https://twitter.com/techcorp",
    "facebook": "https://facebook.com/techcorp",
    "glassdoor": "https://glassdoor.com/Overview/Working-at-Tech-Corp"
  },
  "missionStatement": "To democratize access to cutting-edge technology and empower businesses worldwide.",
  "values": [
    {
      "title": "Innovation First",
      "description": "We embrace experimentation and aren't afraid to challenge the status quo."
    },
    {
      "title": "Customer Obsessed",
      "description": "Our customers are at the core of everything we do."
    },
    {
      "title": "Inclusive Culture",
      "description": "We build a diverse, inclusive environment where everyone can thrive."
    }
  ],
  "benefits": [
    "Comprehensive health, dental, and vision insurance",
    "401(k) with 6% company match",
    "Unlimited PTO policy",
    "Remote work stipend ($1,200/year)",
    "Professional development budget ($2,000/year)",
    "Flexible working hours",
    "On-site fitness center and wellness programs"
  ],
  "perks": [
    "Free daily catered lunches",
    "Weekly happy hours",
    "Quarterly team retreats",
    "Pet-friendly office",
    "Game room with ping pong and foosball"
  ],
  "techStack": [
    "React", "Node.js", "Python", "PostgreSQL", 
    "AWS", "Docker", "Kubernetes", "GraphQL"
  ],
  "diversityStats": {
    "genderDiversity": {
      "female": 45,
      "male": 53,
      "nonBinary": 2
    },
    "ethnicDiversity": {
      "asian": 35,
      "white": 40,
      "hispanic": 15,
      "black": 8,
      "other": 2
    },
    "leadershipDiversity": {
      "female": 40,
      "underrepresented": 35
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": "company-123-456",
      "name": "Tech Corp Inc.",
      "slug": "tech-corp-inc",
      "description": "Leading technology company...",
      "logoUrl": "https://cdn.jobhub.com/logos/tech-corp.png",
      "coverImageUrl": "https://cdn.jobhub.com/covers/tech-corp.jpg",
      "isVerified": false,
      "verificationStatus": "pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Business Rules:**
- Company name must be unique
- Description limited to 5000 characters
- Founded year cannot be future or before 1800
- Employee count must match company size category
- Social links must be valid URLs
- Values limited to 10 items
- Benefits and perks limited to 20 items each

#### **1.2 Upload Company Logo**
- **Endpoint**: `POST /api/v1/companies/{companyId}/logo`
- **Content-Type**: `multipart/form-data`

**Request:**
```
file: [logo.png]
```

**Validation:**
- File types: PNG, JPG, SVG
- Max file size: 2MB
- Recommended dimensions: 200x200px (square)
- Automatic resizing to multiple sizes

#### **1.3 Upload Cover Image**
- **Endpoint**: `POST /api/v1/companies/{companyId}/cover`
- **Content-Type**: `multipart/form-data`

**Validation:**
- File types: PNG, JPG
- Max file size: 5MB
- Recommended dimensions: 1200x400px
- Automatic optimization for web

### **2. Company Reviews**

#### **2.1 Submit Company Review**
- **Endpoint**: `POST /api/v1/companies/{companyId}/reviews`
- **Authentication**: Required
- **Authorization**: Must be verified employee (current or former)

**Request Body:**
```json
{
  "jobTitle": "Senior Software Engineer",
  "employmentStatus": "former",
  "employmentDuration": "2 years 3 months",
  "overallRating": 4,
  "cultureRating": 5,
  "compensationRating": 4,
  "workLifeBalanceRating": 3,
  "managementRating": 4,
  "careerGrowthRating": 4,
  "title": "Great place to grow your career",
  "pros": "Amazing culture, smart colleagues, challenging projects, good work-life balance, competitive compensation",
  "cons": "Can be fast-paced at times, some processes could be more streamlined",
  "adviceToManagement": "Keep investing in employee development and maintain the inclusive culture",
  "wouldRecommend": true,
  "isAnonymous": true,
  "workLocation": "San Francisco Office"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "review": {
      "id": "review-123-456",
      "companyId": "company-123-456",
      "reviewerId": "user-789-012",
      "overallRating": 4,
      "title": "Great place to grow your career",
      "isAnonymous": true,
      "isVerified": true,
      "status": "published",
      "submittedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Business Rules:**
- One review per employee per company
- Employment must be verified
- All ratings are 1-5 scale
- Title limited to 100 characters
- Pros/cons limited to 1000 characters each
- Reviews go through moderation
- Anonymous reviews hide reviewer identity

#### **2.2 Get Company Reviews**
- **Endpoint**: `GET /api/v1/companies/{companyId}/reviews`
- **Query Parameters**:
  - `rating`: Filter by overall rating (1-5)
  - `employmentStatus`: current, former
  - `jobTitle`: Filter by job title
  - `workLocation`: Filter by work location
  - `sort`: date, rating, helpful
  - `page`: Page number
  - `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review-123-456",
        "author": {
          "isAnonymous": true,
          "jobTitle": "Senior Software Engineer",
          "employmentStatus": "former",
          "employmentDuration": "2 years 3 months",
          "workLocation": "San Francisco Office"
        },
        "ratings": {
          "overall": 4,
          "culture": 5,
          "compensation": 4,
          "workLifeBalance": 3,
          "management": 4,
          "careerGrowth": 4
        },
        "title": "Great place to grow your career",
        "pros": "Amazing culture, smart colleagues...",
        "cons": "Can be fast-paced at times...",
        "adviceToManagement": "Keep investing in employee development...",
        "wouldRecommend": true,
        "isVerified": true,
        "helpfulCount": 15,
        "submittedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "totalReviews": 89,
      "averageRating": 4.2,
      "ratingDistribution": {
        "5": 35,
        "4": 28,
        "3": 18,
        "2": 6,
        "1": 2
      },
      "categoryAverages": {
        "culture": 4.5,
        "compensation": 4.0,
        "workLifeBalance": 3.8,
        "management": 4.1,
        "careerGrowth": 4.3
      },
      "recommendationRate": 85
    }
  }
}
```

#### **2.3 Mark Review as Helpful**
- **Endpoint**: `POST /api/v1/companies/reviews/{reviewId}/helpful`
- **Authentication**: Required

**Business Rules:**
- One helpful vote per user per review
- Cannot vote on own reviews
- Increases review visibility

#### **2.4 Company Response to Review**
- **Endpoint**: `POST /api/v1/companies/reviews/{reviewId}/response`
- **Authentication**: Required (Company Admin)

**Request Body:**
```json
{
  "response": "Thank you for your feedback. We're glad you enjoyed working here and appreciate your suggestions for improvement."
}
```

### **3. Company Photos & Culture**

#### **3.1 Upload Company Photos**
- **Endpoint**: `POST /api/v1/companies/{companyId}/photos`
- **Content-Type**: `multipart/form-data`

**Request:**
```
file: [office_photo.jpg]
caption: "Our beautiful San Francisco office space"
photoType: "office"
```

**Photo Types:**
- `office`: Office spaces and facilities
- `team`: Team photos and events
- `culture`: Culture and work environment
- `event`: Company events and activities
- `product`: Product demonstrations

#### **3.2 Get Company Photos**
- **Endpoint**: `GET /api/v1/companies/{companyId}/photos`
- **Query Parameters**:
  - `type`: Filter by photo type
  - `featured`: Show only featured photos
  - `page`: Page number
  - `limit`: Items per page

### **4. Employee Management**

#### **4.1 Verify Employee**
- **Endpoint**: `POST /api/v1/companies/{companyId}/employees/verify`
- **Authentication**: Required

**Request Body:**
```json
{
  "userId": "user-789-012",
  "jobTitle": "Senior Software Engineer",
  "department": "Engineering",
  "startDate": "2022-01-15",
  "endDate": null,
  "employmentType": "full_time",
  "isPublic": true
}
```

**Verification Methods:**
- Email domain verification
- HR system integration
- Manual verification by company admin
- LinkedIn profile cross-reference

#### **4.2 Get Company Employees**
- **Endpoint**: `GET /api/v1/companies/{companyId}/employees`
- **Query Parameters**:
  - `department`: Filter by department
  - `current`: Show only current employees
  - `public`: Show only public profiles
  - `page`: Page number
  - `limit`: Items per page

### **5. Company Search & Discovery**

#### **5.1 Search Companies**
- **Endpoint**: `GET /api/v1/companies/search`
- **Query Parameters**:
  - `q`: Search query (company name, industry)
  - `industry`: Industry filter
  - `size`: Company size filter
  - `location`: Location filter
  - `rating`: Minimum rating
  - `verified`: Show only verified companies
  - `page`: Page number
  - `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "company-123-456",
        "name": "Tech Corp Inc.",
        "slug": "tech-corp-inc",
        "logoUrl": "https://cdn.jobhub.com/logos/tech-corp.png",
        "tagline": "Building the Future of Technology",
        "industry": "Information Technology",
        "size": "201-500",
        "location": "San Francisco, CA",
        "rating": 4.2,
        "reviewCount": 89,
        "activeJobs": 15,
        "isVerified": true,
        "isHiring": true
      }
    ]
  }
}
```

### **6. Company Analytics**

#### **6.1 Company Dashboard Analytics**
- **Endpoint**: `GET /api/v1/companies/{companyId}/analytics`
- **Authentication**: Required (Company Admin)
- **Query Parameters**:
  - `period`: Time period (7d, 30d, 90d, 1y)
  - `metrics`: Specific metrics to include

**Response:**
```json
{
  "success": true,
  "data": {
    "companyId": "company-123-456",
    "period": "30d",
    "profileMetrics": {
      "views": {
        "total": 2450,
        "unique": 1890,
        "trend": "+18%"
      },
      "followers": {
        "total": 1250,
        "new": 89,
        "trend": "+12%"
      }
    },
    "reviewMetrics": {
      "newReviews": 8,
      "averageRating": 4.2,
      "ratingTrend": "+0.1",
      "responseRate": 75
    },
    "jobMetrics": {
      "activeJobs": 15,
      "totalApplications": 450,
      "applicationRate": 3.2,
      "timeToFill": 28
    },
    "employeeMetrics": {
      "verifiedEmployees": 245,
      "newVerifications": 12,
      "employeeEngagement": 78
    }
  }
}
```

## 🗄️ **Database Schema**

### **Core Tables**
```sql
-- Companies
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
    company_size VARCHAR(50),
    founded_year INTEGER,
    headquarters VARCHAR(255),
    locations TEXT[],
    employee_count INTEGER,
    revenue_range VARCHAR(50),
    company_type VARCHAR(50),
    stock_symbol VARCHAR(10),
    social_links JSONB,
    mission_statement TEXT,
    values JSONB,
    benefits JSONB,
    perks JSONB,
    tech_stack JSONB,
    diversity_stats JSONB,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP WITH TIME ZONE,
    verification_method VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company Reviews
CREATE TABLE company_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL,
    job_title VARCHAR(255),
    employment_status VARCHAR(50),
    employment_duration VARCHAR(100),
    work_location VARCHAR(255),
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    culture_rating INTEGER CHECK (culture_rating >= 1 AND culture_rating <= 5),
    compensation_rating INTEGER CHECK (compensation_rating >= 1 AND compensation_rating <= 5),
    work_life_balance_rating INTEGER CHECK (work_life_balance_rating >= 1 AND work_life_balance_rating <= 5),
    management_rating INTEGER CHECK (management_rating >= 1 AND management_rating <= 5),
    career_growth_rating INTEGER CHECK (career_growth_rating >= 1 AND career_growth_rating <= 5),
    title VARCHAR(255) NOT NULL,
    pros TEXT NOT NULL,
    cons TEXT NOT NULL,
    advice_to_management TEXT,
    would_recommend BOOLEAN,
    is_anonymous BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_method VARCHAR(100),
    status VARCHAR(20) DEFAULT 'published',
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    company_response TEXT,
    company_response_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, reviewer_id)
);

-- Company Photos
CREATE TABLE company_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    caption TEXT,
    photo_type VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'published',
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company Employees
CREATE TABLE company_employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    job_title VARCHAR(255),
    department VARCHAR(100),
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    employment_type VARCHAR(50),
    is_public BOOLEAN DEFAULT FALSE,
    verification_method VARCHAR(100),
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id, start_date)
);

-- Company Followers
CREATE TABLE company_followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);
```

## 🔄 **Event Publishing**

### **Events Published to Kafka**
```yaml
Topic: company.events

Event Types:
- company.created
- company.updated
- company.verified
- company.review_added
- company.review_responded
- company.photo_uploaded
- company.employee_verified
- company.followed
```

## 🔧 **Technical Specifications**

### **Performance Requirements**
- Company profile loading: < 400ms
- Review submission: < 500ms
- Photo upload: < 3s for files up to 5MB
- Company search: < 300ms
- Analytics queries: < 1s

### **Security Requirements**
- Employee verification prevents fake reviews
- Photo moderation for inappropriate content
- Review moderation for spam/abuse
- Company admin role verification
- Rate limiting on review submissions

This Company Service PRD provides comprehensive specifications for implementing company profile management, review systems, and employer branding capabilities.