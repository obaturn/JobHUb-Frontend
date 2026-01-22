# JobHub - API Design Specifications

## 🌐 **API Architecture Overview**

### **RESTful API Design Principles**
- Resource-based URLs
- HTTP methods for actions (GET, POST, PUT, DELETE)
- Consistent response formats
- Proper HTTP status codes
- Security-first approach with JWT authentication

### **API Gateway Configuration**
```yaml
Base URL: https://api.jobhub.com
API Version: v1
Authentication: Bearer JWT tokens
Rate Limiting: 1000 requests/hour per user
Content-Type: application/json
```

### **Standard Response Format**
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "correlationId": "abc-123-def-456",
    "version": "v1",
    "requestId": "req-789-ghi-012"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "links": {
    "self": "/api/v1/jobs?page=1",
    "next": "/api/v1/jobs?page=2",
    "prev": null,
    "first": "/api/v1/jobs?page=1",
    "last": "/api/v1/jobs?page=8"
  }
}
```

### **Error Response Format**
```json
{
  "success": false,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Email is required",
      "field": "email",
      "details": "The email field cannot be empty"
    }
  ],
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "correlationId": "abc-123-def-456",
    "requestId": "req-789-ghi-012"
  }
}
```

## 🔐 **1. Authentication Service API**

### **Base URL**: `/api/v1/auth`

### **User Registration**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "userType": "job_seeker",
  "acceptTerms": true,
  "marketingConsent": false
}
```

**Response (201 Created):**
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
      "emailVerified": false,
      "status": "pending_verification"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

### **User Login**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

### **Token Refresh**
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## 👤 **2. User Service API**

### **Base URL**: `/api/v1/users`

### **Get User Profile**
```http
GET /api/v1/users/profile
Authorization: Bearer {accessToken}
```

### **Update User Profile**
```http
PUT /api/v1/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "headline": "Senior Full-Stack Developer",
  "bio": "Updated bio...",
  "location": "New York, NY"
}
```

## 💼 **3. Job Service API**

### **Base URL**: `/api/v1/jobs`

### **Search Jobs**
```http
GET /api/v1/jobs/search
Query Parameters:
- q: "frontend developer"
- location: "San Francisco"
- remote: true
- employmentType: "full_time,contract"
- page: 1
- limit: 20
```

### **Apply to Job**
```http
POST /api/v1/jobs/{jobId}/apply
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "resumeId": "resume-123-456",
  "coverLetter": "I am excited to apply..."
}
```

## 🔒 **Security Standards**

### **Required Headers**
```http
Authorization: Bearer {jwt-token}
Content-Type: application/json
X-Correlation-ID: {uuid}
```

### **HTTP Status Codes**
- **200 OK**: Successful requests
- **201 Created**: Resource created
- **400 Bad Request**: Invalid data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded