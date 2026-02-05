# 🔧 Complete Profile Endpoints Specification

Based on my analysis of the frontend code, here are **ALL the profile endpoints and data fields** your backend needs to support for complete integration:

## 📋 **Current Backend vs Frontend Requirements**

### **✅ What Your Backend Already Has:**
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- Basic fields: `firstName`, `lastName`, `bio`, `location`, `phone`, `avatarUrl`

### **❌ What's Missing from Your Backend:**

## 🚀 **Required Endpoints & Data Structure**

### **1. Enhanced Profile Management**

#### **GET /api/v1/auth/profile**
**Current Response:** ✅ Working
```json
{
  "id": "uuid",
  "userId": "uuid", 
  "firstName": "string",
  "lastName": "string",
  "bio": "string",
  "location": "string",
  "phone": "string",
  "avatarUrl": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Missing Fields Needed:**
```json
{
  "headline": "Senior Frontend Developer | React, TypeScript",
  "portfolioUrl": "https://portfolio.com",
  "websiteUrl": "https://website.com", 
  "yearsOfExperience": 5,
  "skills": ["React", "TypeScript", "Node.js"],
  "experience": [
    {
      "id": "uuid",
      "title": "Senior Developer",
      "company": "TechCorp",
      "period": "Jan 2021 - Present",
      "description": "Led frontend development..."
    }
  ],
  "education": [
    {
      "id": "uuid", 
      "institution": "University of Tech",
      "degree": "B.S. Computer Science",
      "fieldOfStudy": "Software Engineering",
      "graduationYear": "2020"
    }
  ]
}
```

#### **PUT /api/v1/auth/profile**
**Current Request:** ✅ Working for basic fields
```json
{
  "firstName": "string",
  "lastName": "string", 
  "bio": "string",
  "location": "string",
  "phone": "string",
  "avatarUrl": "string"
}
```

**Missing Fields Needed:**
```json
{
  "headline": "string",
  "portfolioUrl": "string", 
  "websiteUrl": "string",
  "yearsOfExperience": "number"
}
```

### **2. Skills Management**

#### **GET /api/v1/auth/profile/skills**
```json
{
  "skills": ["React", "TypeScript", "Node.js", "Python"]
}
```

#### **PUT /api/v1/auth/profile/skills**
```json
{
  "skills": ["React", "TypeScript", "Node.js", "Python", "GraphQL"]
}
```

#### **POST /api/v1/auth/profile/skills**
```json
{
  "skill": "GraphQL"
}
```

#### **DELETE /api/v1/auth/profile/skills/{skillName}**
No body required.

### **3. Experience Management**

#### **GET /api/v1/auth/profile/experience**
```json
{
  "experience": [
    {
      "id": "uuid",
      "title": "Senior Frontend Developer",
      "company": "TechCorp Inc",
      "period": "Jan 2021 - Present", 
      "description": "Led development of React applications...",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### **POST /api/v1/auth/profile/experience**
```json
{
  "title": "Senior Frontend Developer",
  "company": "TechCorp Inc", 
  "period": "Jan 2021 - Present",
  "description": "Led development of React applications..."
}
```

#### **PUT /api/v1/auth/profile/experience/{experienceId}**
```json
{
  "title": "Senior Frontend Developer",
  "company": "TechCorp Inc",
  "period": "Jan 2021 - Present", 
  "description": "Led development of React applications..."
}
```

#### **DELETE /api/v1/auth/profile/experience/{experienceId}**
No body required.

### **4. Education Management**

#### **GET /api/v1/auth/profile/education**
```json
{
  "education": [
    {
      "id": "uuid",
      "institution": "University of Technology",
      "degree": "B.S. Computer Science",
      "fieldOfStudy": "Software Engineering", 
      "graduationYear": "2020",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### **POST /api/v1/auth/profile/education**
```json
{
  "institution": "University of Technology",
  "degree": "B.S. Computer Science", 
  "fieldOfStudy": "Software Engineering",
  "graduationYear": "2020"
}
```

#### **PUT /api/v1/auth/profile/education/{educationId}**
```json
{
  "institution": "University of Technology",
  "degree": "B.S. Computer Science",
  "fieldOfStudy": "Software Engineering",
  "graduationYear": "2020"
}
```

#### **DELETE /api/v1/auth/profile/education/{educationId}**
No body required.

### **5. Avatar Upload**

#### **POST /api/v1/auth/profile/avatar**
**Content-Type:** `multipart/form-data`
**Body:** File upload with field name `avatar`

**Response:**
```json
{
  "avatarUrl": "https://your-cdn.com/avatars/user-uuid.jpg",
  "message": "Avatar uploaded successfully"
}
```

### **6. Account Management**

#### **DELETE /api/v1/auth/account** 
✅ **Already implemented** - Account deletion

#### **PUT /api/v1/auth/password**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### **7. Notification Preferences**

#### **GET /api/v1/auth/notifications/preferences**
```json
{
  "emailNotifications": {
    "jobAlerts": true,
    "applicationUpdates": true, 
    "companyNews": false,
    "networkActivity": true,
    "securityAlerts": true
  },
  "pushNotifications": {
    "jobAlerts": true,
    "messages": true,
    "applicationUpdates": true
  }
}
```

#### **PUT /api/v1/auth/notifications/preferences**
```json
{
  "emailNotifications": {
    "jobAlerts": true,
    "applicationUpdates": true,
    "companyNews": false, 
    "networkActivity": true,
    "securityAlerts": true
  },
  "pushNotifications": {
    "jobAlerts": true,
    "messages": true,
    "applicationUpdates": true
  }
}
```

## 🗄️ **Database Schema Updates Needed**

### **UserProfile Table Additions:**
```sql
ALTER TABLE user_profile ADD COLUMN headline VARCHAR(255);
ALTER TABLE user_profile ADD COLUMN portfolio_url VARCHAR(500);
ALTER TABLE user_profile ADD COLUMN website_url VARCHAR(500); 
ALTER TABLE user_profile ADD COLUMN years_of_experience INTEGER;
```

### **New Tables Needed:**

#### **user_skills**
```sql
CREATE TABLE user_skills (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    skill_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_name)
);
```

#### **user_experience**
```sql
CREATE TABLE user_experience (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **user_education**
```sql
CREATE TABLE user_education (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    graduation_year VARCHAR(4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **user_notification_preferences**
```sql
CREATE TABLE user_notification_preferences (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) UNIQUE,
    job_alerts_email BOOLEAN DEFAULT true,
    application_updates_email BOOLEAN DEFAULT true,
    company_news_email BOOLEAN DEFAULT false,
    network_activity_email BOOLEAN DEFAULT true,
    security_alerts_email BOOLEAN DEFAULT true,
    job_alerts_push BOOLEAN DEFAULT true,
    messages_push BOOLEAN DEFAULT true,
    application_updates_push BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 **Priority Implementation Order**

### **Phase 1: Core Profile Enhancement**
1. ✅ `PUT /api/v1/auth/profile` - Add missing fields (headline, portfolioUrl, websiteUrl, yearsOfExperience)
2. ✅ `POST /api/v1/auth/profile/avatar` - Avatar upload
3. ✅ `PUT /api/v1/auth/password` - Password change

### **Phase 2: Skills & Experience**
4. ✅ Skills CRUD endpoints
5. ✅ Experience CRUD endpoints  
6. ✅ Education CRUD endpoints

### **Phase 3: Settings & Preferences**
7. ✅ Notification preferences endpoints
8. ✅ Enhanced profile response with all data

## 🔧 **Frontend Integration Points**

The frontend expects these exact endpoint patterns:
- **Profile API**: `src/api/profileApi.ts`
- **Settings**: `components/dashboard/Settings.tsx`
- **Profile Management**: `components/dashboard/MyProfile.tsx`

Once you implement these endpoints, the frontend will have **complete profile functionality** with:
- ✅ Real-time profile editing
- ✅ Skills management
- ✅ Experience tracking
- ✅ Education history
- ✅ Avatar uploads
- ✅ Notification preferences
- ✅ Account security settings

This will provide a **LinkedIn-level professional profile experience**! 🚀