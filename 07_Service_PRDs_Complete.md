# JobHub - Complete Service PRDs (Product Requirements Documents)

## 📋 **Service PRD Overview**

This document contains detailed Product Requirements Documents for all JobHub microservices, building upon the Authentication service PRD already created.

## 👤 **User Service PRD**

### **Service Overview**
The User Service manages user profiles, skills, experience, education, professional networking, and skill assessments for job seekers.

### **Functional Requirements**

#### **1. Profile Management**

##### **1.1 Create/Update Profile**
- **Endpoint**: `PUT /api/v1/users/profile`
- **Features**:
  - Complete profile information (headline, bio, location, etc.)
  - Profile completeness scoring (0-100%)
  - Profile visibility settings (public, private, connections only)
  - Avatar upload and management
  - Social media links integration

##### **1.2 Skills Management**
- **Endpoint**: `POST/PUT/DELETE /api/v1/users/skills`
- **Features**:
  - Add/remove skills with proficiency levels
  - Skill categorization (technical, soft skills, etc.)
  - Years of experience per skill
  - Primary skills highlighting
  - Skill endorsements from connections

##### **1.3 Experience Management**
- **Endpoint**: `POST/PUT/DELETE /api/v1/users/experience`
- **Features**:
  - Work history with detailed descriptions
  - Achievement tracking
  - Skills used in each role
  - Employment verification (future)
  - Current position tracking

##### **1.4 Education Management**
- **Endpoint**: `POST/PUT/DELETE /api/v1/users/education`
- **Features**:
  - Educational background
  - Certifications and licenses
  - Continuing education tracking
  - Institution verification (future)

#### **2. Professional Networking**

##### **2.1 Connection Management**
- **Endpoints**: 
  - `POST /api/v1/users/network/connect`
  - `PUT /api/v1/users/network/connections/{id}/status`
- **Features**:
  - Send/accept/decline connection requests
  - Connection recommendations
  - Mutual connections display
  - Connection messaging
  - Network analytics

##### **2.2 Professional Posts**
- **Endpoint**: `POST /api/v1/users/posts`
- **Features**:
  - Create professional updates
  - Share achievements and milestones
  - Like and comment on posts
  - Professional content feed
  - Post analytics

#### **3. Skill Assessments**

##### **3.1 Assessment Taking**
- **Endpoints**:
  - `GET /api/v1/users/assessments/available`
  - `POST /api/v1/users/assessments/{id}/start`
  - `POST /api/v1/users/assessments/{id}/submit`
- **Features**:
  - Browse available assessments
  - Timed assessment taking
  - Multiple question types (multiple choice, coding, etc.)
  - Immediate scoring and feedback
  - Certificate generation

##### **3.2 Assessment Results**
- **Endpoint**: `GET /api/v1/users/assessments/results`
- **Features**:
  - Score tracking and history
  - Skill verification badges
  - Performance analytics
  - Retake policies
  - Employer verification

#### **4. Resume Management**

##### **4.1 Resume Upload/Management**
- **Endpoints**:
  - `POST /api/v1/users/resumes`
  - `GET /api/v1/users/resumes`
  - `DELETE /api/v1/users/resumes/{id}`
- **Features**:
  - Multiple resume versions
  - Primary resume designation
  - Resume parsing and text extraction
  - Format validation (PDF, DOC, DOCX)
  - Resume analytics (views, downloads)

### **Technical Specifications**

#### **Database Schema**
- Uses `user_db` PostgreSQL database
- Tables: user_profiles, skills, user_skills, experience, education, certifications, resumes, user_connections, user_posts, skill_assessments, user_assessment_results

#### **Event Publishing**
```yaml
Events Published:
- user.profile_updated
- user.skill_added
- user.experience_added
- user.resume_uploaded
- user.assessment_completed
- user.connection_requested
- user.connection_accepted
- user.post_created
```

#### **Performance Requirements**
- Profile updates: < 500ms response time
- Assessment loading: < 200ms response time
- Resume upload: < 2s for files up to 5MB
- Connection search: < 300ms response time

---

## 💼 **Job Service PRD**

### **Service Overview**
The Job Service handles job postings, applications, search functionality, recommendations, and job-related analytics.

### **Functional Requirements**

#### **1. Job Management (Employer)**

##### **1.1 Job Creation/Editing**
- **Endpoint**: `POST/PUT /api/v1/jobs`
- **Features**:
  - Comprehensive job posting form
  - Rich text description editor
  - Salary range configuration
  - Required/preferred skills selection
  - Screening questions setup
  - Application deadline management
  - Job preview before publishing

##### **1.2 Job Status Management**
- **Endpoint**: `PUT /api/v1/jobs/{id}/status`
- **Features**:
  - Draft, Published, Paused, Closed states
  - Automatic expiration handling
  - Bulk status updates
  - Job performance analytics
  - Application management

#### **2. Job Search & Discovery**

##### **2.1 Advanced Search**
- **Endpoint**: `GET /api/v1/jobs/search`
- **Features**:
  - Full-text search with relevance scoring
  - Multiple filter combinations
  - Location-based search with radius
  - Salary range filtering
  - Company size and industry filters
  - Remote work options
  - Date posted filtering

##### **2.2 Job Recommendations**
- **Endpoint**: `GET /api/v1/jobs/recommendations`
- **Features**:
  - AI-powered job matching
  - Skill-based recommendations
  - Location preference matching
  - Salary expectation alignment
  - Career progression suggestions
  - Personalized job feed

#### **3. Job Applications**

##### **3.1 Application Submission**
- **Endpoint**: `POST /api/v1/jobs/{id}/apply`
- **Features**:
  - Resume selection
  - Cover letter writing
  - Screening question responses
  - Application status tracking
  - Duplicate application prevention
  - Application analytics

##### **3.2 Application Management (Employer)**
- **Endpoints**:
  - `GET /api/v1/jobs/{id}/applications`
  - `PUT /api/v1/jobs/applications/{id}/status`
- **Features**:
  - Application review interface
  - Candidate filtering and sorting
  - Status updates (screening, interviewing, etc.)
  - Bulk actions
  - Interview scheduling integration
  - Candidate communication

#### **4. Job Analytics**

##### **4.1 Job Performance Metrics**
- **Endpoint**: `GET /api/v1/jobs/{id}/analytics`
- **Features**:
  - View count tracking
  - Application conversion rates
  - Source attribution
  - Time-to-fill metrics
  - Candidate quality scoring
  - Competitive analysis

### **Technical Specifications**

#### **Database Schema**
- Uses `job_db` PostgreSQL database
- Tables: jobs, job_categories, job_applications, saved_jobs, saved_searches, job_views

#### **Search Integration**
- Elasticsearch for advanced search capabilities
- Real-time indexing of job postings
- Faceted search with aggregations
- Autocomplete and suggestion features

#### **Event Publishing**
```yaml
Events Published:
- job.created
- job.published
- job.updated
- job.closed
- job.applied
- job.viewed
- job.saved
- job.application_status_changed
```

---

## 🏢 **Company Service PRD**

### **Service Overview**
The Company Service manages company profiles, reviews, culture information, and employee data.

### **Functional Requirements**

#### **1. Company Profile Management**

##### **1.1 Company Information**
- **Endpoint**: `PUT /api/v1/companies/{id}`
- **Features**:
  - Basic company information
  - Industry and size classification
  - Location and office information
  - Company description and mission
  - Website and social media links
  - Logo and cover image management

##### **1.2 Company Culture**
- **Endpoint**: `PUT /api/v1/companies/{id}/culture`
- **Features**:
  - Company values and mission
  - Benefits and perks listing
  - Diversity and inclusion metrics
  - Work environment photos
  - Employee testimonials
  - "Day in the life" content

#### **2. Company Reviews**

##### **2.1 Review Submission**
- **Endpoint**: `POST /api/v1/companies/{id}/reviews`
- **Features**:
  - Multi-dimensional rating system
  - Anonymous review options
  - Employment verification
  - Review moderation
  - Helpful/unhelpful voting
  - Response from company

##### **2.2 Review Management**
- **Endpoint**: `GET /api/v1/companies/{id}/reviews`
- **Features**:
  - Review filtering and sorting
  - Aggregate rating calculations
  - Review authenticity verification
  - Trend analysis
  - Competitive benchmarking

#### **3. Employee Management**

##### **3.1 Employee Verification**
- **Endpoint**: `POST /api/v1/companies/{id}/employees/verify`
- **Features**:
  - Current employee verification
  - Alumni network tracking
  - Employee directory (opt-in)
  - Referral program integration
  - Employee advocacy features

### **Technical Specifications**

#### **Database Schema**
- Uses `company_db` PostgreSQL database
- Tables: companies, company_reviews, company_photos, company_employees

#### **Event Publishing**
```yaml
Events Published:
- company.created
- company.updated
- company.verified
- company.review_added
- company.employee_verified
```

---

## 💬 **Messaging Service PRD**

### **Service Overview**
The Messaging Service provides real-time communication between users, including direct messages, file sharing, and conversation management.

### **Functional Requirements**

#### **1. Conversation Management**

##### **1.1 Conversation Creation**
- **Endpoint**: `POST /api/v1/messages/conversations`
- **Features**:
  - Direct messaging between users
  - Group conversations (future)
  - Conversation metadata
  - Participant management
  - Conversation archiving

##### **1.2 Message Operations**
- **Endpoints**:
  - `POST /api/v1/messages/conversations/{id}/messages`
  - `PUT /api/v1/messages/{id}`
  - `DELETE /api/v1/messages/{id}`
- **Features**:
  - Text message sending
  - Message editing and deletion
  - Message reactions
  - Read receipts
  - Message threading (replies)

#### **2. File Sharing**

##### **2.1 File Upload**
- **Endpoint**: `POST /api/v1/messages/conversations/{id}/files`
- **Features**:
  - Document sharing (PDF, DOC, etc.)
  - Image sharing with thumbnails
  - File size and type restrictions
  - Virus scanning
  - Download tracking

#### **3. Real-time Features**

##### **3.1 WebSocket Integration**
- **Features**:
  - Real-time message delivery
  - Typing indicators
  - Online/offline status
  - Message delivery confirmations
  - Push notification triggers

### **Technical Specifications**

#### **Database Schema**
- Uses `message_db` PostgreSQL database
- Tables: conversations, conversation_participants, messages, message_attachments, message_reactions

#### **Real-time Technology**
- WebSocket connections for real-time messaging
- Redis for session management
- Message queuing for offline users

#### **Event Publishing**
```yaml
Events Published:
- conversation.created
- message.sent
- message.read
- file.uploaded
- user.typing
```

---

## 🔔 **Notification Service PRD**

### **Service Overview**
The Notification Service handles all user notifications including email, push notifications, SMS, and in-app notifications.

### **Functional Requirements**

#### **1. Notification Delivery**

##### **1.1 Multi-Channel Delivery**
- **Features**:
  - Email notifications
  - Push notifications (web and mobile)
  - SMS notifications
  - In-app notifications
  - Notification batching and digests

##### **1.2 Notification Preferences**
- **Endpoint**: `PUT /api/v1/notifications/preferences`
- **Features**:
  - Channel preferences per notification type
  - Frequency settings (immediate, daily, weekly)
  - Quiet hours configuration
  - Opt-out management
  - Notification categories

#### **2. Template Management**

##### **2.1 Dynamic Templates**
- **Features**:
  - HTML and text email templates
  - Push notification templates
  - Variable substitution
  - Localization support
  - A/B testing capabilities

### **Technical Specifications**

#### **Database Schema**
- Uses `notification_db` PostgreSQL database
- Tables: notification_templates, user_notifications, notification_preferences

#### **Event Consumption**
```yaml
Events Consumed:
- user.registered
- job.applied
- message.sent
- application.status_changed
- connection.requested
```

---

## 📊 **Analytics Service PRD**

### **Service Overview**
The Analytics Service collects, processes, and provides insights on user behavior, job performance, and platform metrics.

### **Functional Requirements**

#### **1. Event Tracking**

##### **1.1 User Behavior Analytics**
- **Features**:
  - Page view tracking
  - Job search analytics
  - Application funnel analysis
  - User engagement metrics
  - Conversion tracking

##### **1.2 Business Intelligence**
- **Features**:
  - Job posting performance
  - Employer analytics dashboard
  - Platform usage statistics
  - Revenue analytics
  - Predictive analytics

#### **2. Reporting**

##### **2.1 Dashboard Creation**
- **Features**:
  - Real-time dashboards
  - Custom report generation
  - Data export capabilities
  - Scheduled reports
  - Alert thresholds

### **Technical Specifications**

#### **Database Schema**
- Uses `analytics_db` ClickHouse database
- Tables: user_events, job_analytics, search_analytics

#### **Event Consumption**
```yaml
Events Consumed:
- All platform events for analytics
- Real-time stream processing
- Batch processing for historical data
```

---

## 💳 **Payment Service PRD**

### **Service Overview**
The Payment Service handles subscription management, job posting payments, and billing for premium features.

### **Functional Requirements**

#### **1. Subscription Management**

##### **1.1 Plan Management**
- **Features**:
  - Multiple subscription tiers
  - Monthly and annual billing
  - Feature-based access control
  - Upgrade/downgrade handling
  - Proration calculations

##### **1.2 Payment Processing**
- **Features**:
  - Stripe integration
  - Multiple payment methods
  - Automatic billing
  - Failed payment handling
  - Refund processing

#### **2. Job Posting Payments**

##### **2.1 Pay-per-Post**
- **Features**:
  - Individual job posting payments
  - Bulk job posting packages
  - Featured job promotions
  - Sponsored job listings
  - Usage-based billing

### **Technical Specifications**

#### **Database Schema**
- Uses `payment_db` PostgreSQL database
- Tables: subscription_plans, user_subscriptions, payment_transactions

#### **Event Publishing**
```yaml
Events Published:
- subscription.created
- subscription.renewed
- subscription.cancelled
- payment.processed
- payment.failed
```

---

## 🔄 **Cross-Service Integration**

### **Service Communication Patterns**

#### **Synchronous Communication**
- User Service ↔ Auth Service (user validation)
- Job Service ↔ User Service (applicant information)
- Company Service ↔ User Service (employee verification)

#### **Asynchronous Communication**
- All services publish events to Kafka
- Event-driven updates across services
- Eventual consistency for non-critical data

### **Data Consistency Strategy**

#### **Strong Consistency**
- Job applications (Saga pattern)
- Payment transactions
- User authentication

#### **Eventual Consistency**
- User profile updates
- Job view counts
- Analytics data
- Notification delivery

This comprehensive service design provides the foundation for implementing all JobHub microservices with clear boundaries, well-defined APIs, and proper integration patterns.