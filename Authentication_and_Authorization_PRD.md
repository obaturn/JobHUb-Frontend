# JobHub Authentication & Authorization Microservices PRD

## 📋 Product Overview

This Product Requirements Document (PRD) outlines the implementation of Authentication and Authorization microservices for the JobHub professional job marketplace platform. The system will replace the current mock authentication with a production-ready, secure, and scalable solution.

## 🎯 Business Objectives

- Provide secure user authentication and authorization
- Support multiple user roles (job seekers, employers, administrators)
- Enable social login integration (Google OAuth)
- Implement multi-factor authentication (TOTP)
- Ensure compliance with security standards
- Support microservices architecture for scalability

## 👥 User Personas

### Job Seeker
- Needs to create profile and apply for jobs
- Requires secure account management
- Expects easy login/signup process

### Employer
- Needs to post jobs and manage applications
- Requires secure access to company data
- Expects role-based permissions for team members

### Administrator
- Needs to manage platform users and content
- Requires audit trails and security monitoring
- Expects comprehensive user management tools

## 🏗️ System Architecture

### Microservices Design

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│  Auth Service   │────│   User Service  │
│                 │    │                 │    │                 │
│ - Route requests│    │ - JWT Tokens    │    │ - User Profiles │
│ - Load balancing│    │ - OAuth         │    │ - Permissions   │
│ - Rate limiting │    │ - MFA           │    │ - Roles         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │                 │
                    │ - Users         │
                    │ - Roles         │
                    │ - Permissions   │
                    │ - Sessions      │
                    │ - Audit Logs    │
                    └─────────────────┘
```

### Service Responsibilities

#### Auth Service
- User registration and login
- JWT token generation and validation
- OAuth integration (Google)
- MFA (TOTP) management
- Password reset functionality
- Session management

#### User Service
- User profile management
- Role and permission assignment
- User search and management (admin)
- Account status management
- User preferences and settings

#### API Gateway
- Request routing and load balancing
- Authentication middleware
- Rate limiting and throttling
- Request/response transformation
- Service discovery

## 🔐 Functional Requirements

### 1. User Registration

#### 1.1 Email/Password Registration
- **Endpoint**: `POST /api/auth/register`
- **Input**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "job_seeker"
  }
  ```
- **Validation**:
  - Email format validation
  - Password strength (8+ chars, uppercase, lowercase, number, special char)
  - Email uniqueness check
  - Required fields validation
- **Process**:
  - Hash password with bcrypt
  - Create user record with default role
  - Send verification email
  - Return success response

#### 1.2 Google OAuth Registration
- **Endpoint**: `POST /api/auth/google/register`
- **Process**:
  - Validate Google OAuth token
  - Extract user information
  - Create user record
  - Link Google account

### 2. User Authentication

#### 2.1 Email/Password Login
- **Endpoint**: `POST /api/auth/login`
- **Input**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Process**:
  - Validate credentials
  - Check account status (active/suspended)
  - Generate JWT access and refresh tokens
  - Log authentication event
- **Response**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "job_seeker",
      "roles": ["job_seeker"]
    },
    "expiresIn": 3600
  }
  ```

#### 2.2 Google OAuth Login
- **Endpoint**: `POST /api/auth/google/login`
- **Process**:
  - Validate Google OAuth token
  - Find or create user account
  - Generate JWT tokens

#### 2.3 Token Refresh
- **Endpoint**: `POST /api/auth/refresh`
- **Process**:
  - Validate refresh token
  - Generate new access token
  - Return updated tokens

### 3. Multi-Factor Authentication (MFA)

#### 3.1 TOTP Setup
- **Endpoint**: `POST /api/auth/mfa/setup`
- **Process**:
  - Generate TOTP secret
  - Return QR code for authenticator app
  - Store secret temporarily

#### 3.2 TOTP Verification
- **Endpoint**: `POST /api/auth/mfa/verify`
- **Input**:
  ```json
  {
    "code": "123456"
  }
  ```
- **Process**:
  - Validate TOTP code
  - Enable MFA for user account

#### 3.3 MFA Login
- **Process**:
  - After password validation, prompt for TOTP code
  - Validate code before issuing tokens

### 4. Password Management

#### 4.1 Password Reset Request
- **Endpoint**: `POST /api/auth/password/reset-request`
- **Process**:
  - Generate reset token
  - Send email with reset link
  - Store token with expiration

#### 4.2 Password Reset
- **Endpoint**: `POST /api/auth/password/reset`
- **Input**:
  ```json
  {
    "token": "reset_token_here",
    "newPassword": "NewSecurePass123!"
  }
  ```

#### 4.3 Password Change
- **Endpoint**: `POST /api/auth/password/change`
- **Authorization**: Bearer token required
- **Input**:
  ```json
  {
    "currentPassword": "OldPass123!",
    "newPassword": "NewSecurePass123!"
  }
  ```

### 5. User Profile Management

#### 5.1 Get Profile
- **Endpoint**: `GET /api/users/profile`
- **Authorization**: Bearer token required
- **Response**: Complete user profile data

#### 5.2 Update Profile
- **Endpoint**: `PUT /api/users/profile`
- **Authorization**: Bearer token required
- **Input**: Profile update data

#### 5.3 Account Deactivation
- **Endpoint**: `DELETE /api/users/account`
- **Process**: Soft delete, retain data for compliance

### 6. Role-Based Authorization

#### 6.1 Role Definitions
- **job_seeker**: Basic user permissions
- **employer**: Job posting and management permissions
- **admin**: Full platform management permissions

#### 6.2 Permission Matrix
| Permission | job_seeker | employer | admin |
|------------|------------|----------|-------|
| view_jobs | ✅ | ✅ | ✅ |
| apply_jobs | ✅ | ❌ | ❌ |
| post_jobs | ❌ | ✅ | ✅ |
| manage_users | ❌ | ❌ | ✅ |
| view_analytics | ❌ | ✅ | ✅ |

#### 6.3 Permission Checking
- **Endpoint**: `GET /api/auth/permissions`
- **Response**: List of user permissions

### 7. Session Management

#### 7.1 Active Sessions
- **Endpoint**: `GET /api/auth/sessions`
- **Response**: List of active user sessions

#### 7.2 Session Revocation
- **Endpoint**: `DELETE /api/auth/sessions/{sessionId}`
- **Process**: Invalidate specific session

#### 7.3 Logout
- **Endpoint**: `POST /api/auth/logout`
- **Process**: Invalidate current session

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('job_seeker', 'employer', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    email_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    location VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);
```

### Roles Table
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('job_seeker', 'Basic user role for job seekers'),
('employer', 'Role for employers posting jobs'),
('admin', 'Administrator role with full access');
```

### User Roles Table
```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    UNIQUE(user_id, role_id)
);
```

### Permissions Table
```sql
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Role Permissions Table
```sql
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);
```

### Sessions Table
```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(token_hash)
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security Requirements

### Authentication Security
- Password hashing with bcrypt (12 rounds minimum)
- JWT tokens with RS256 algorithm
- Secure token storage (HttpOnly, Secure, SameSite cookies)
- Token expiration (access: 15min, refresh: 7 days)
- Rate limiting (5 login attempts per minute per IP)

### Authorization Security
- Role-based access control (RBAC)
- Permission-based resource access
- JWT token validation on every request
- Session management and revocation
- Audit logging for sensitive operations

### Data Protection
- PII encryption at rest
- TLS 1.3 for all communications
- GDPR compliance for EU users
- Data retention policies
- Secure backup procedures

### Compliance Requirements
- **GDPR**: Right to erasure, data portability
- **CCPA**: Privacy rights for California residents
- **SOX**: Audit trails for financial operations
- **ISO 27001**: Information security management

## 🔧 Technical Specifications

### Technology Stack
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL 15+
- **ORM**: Spring Data JPA
- **Security**: Spring Security 6.x
- **JWT**: JJWT library
- **OAuth**: Spring Security OAuth2
- **MFA**: Custom TOTP implementation
- **Cache**: Redis for session storage
- **Message Queue**: RabbitMQ for async operations

### Dependencies
```xml
<dependencies>
    <!-- Spring Boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>

    <!-- Security -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-oauth2-client</artifactId>
    </dependency>

    <!-- Utilities -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
</dependencies>
```

## 🧪 Testing Strategy

### Unit Tests
- Service layer testing with Mockito
- Controller testing with MockMvc
- Repository testing with @DataJpaTest
- Security configuration testing

### Integration Tests
- Full authentication flow testing
- Database integration testing
- External service mocking (Google OAuth)
- API endpoint testing

### Security Testing
- Penetration testing
- JWT token validation testing
- Rate limiting testing
- SQL injection prevention testing

### Performance Testing
- Load testing with JMeter
- Concurrent user simulation
- Database query optimization
- Caching strategy validation

## 📊 Monitoring & Logging

### Application Metrics
- Authentication success/failure rates
- Token generation/validation metrics
- User registration/login trends
- Error rates by endpoint

### Security Monitoring
- Failed login attempts
- Suspicious activity detection
- Token abuse monitoring
- Audit log analysis

### Logging Strategy
- Structured logging with correlation IDs
- Security event logging
- Performance metrics logging
- Error tracking with stack traces

## 🚀 Deployment & DevOps

### Environment Configuration
```yaml
# application.yml
spring:
  profiles:
    active: development

  datasource:
    url: jdbc:postgresql://localhost:5432/jobhub_auth
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}

jwt:
  secret: ${JWT_SECRET}
  access-token-expiration: 900000  # 15 minutes
  refresh-token-expiration: 604800000  # 7 days

mfa:
  issuer: JobHub
  digits: 6
  period: 30
```

### Docker Configuration
```dockerfile
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
```

### Kubernetes Deployment
- Service deployment with rolling updates
- ConfigMap for environment variables
- Secret for sensitive data
- Horizontal Pod Autoscaling
- Ingress configuration for API Gateway

## 🔄 Integration Points

### Frontend Integration
The React frontend will integrate with the auth service through:

1. **HTTP Client**: Axios with interceptors for token management
2. **Token Storage**: Secure HTTP-only cookies
3. **Automatic Refresh**: Token refresh on expiration
4. **Error Handling**: 401/403 error handling with redirects

### Other Microservices
- **API Gateway**: Routes requests and handles authentication
- **User Service**: Manages user profiles and permissions
- **Job Service**: Validates user permissions for job operations
- **Notification Service**: Sends auth-related notifications

## 📈 Success Metrics

### User Experience Metrics
- Registration completion rate > 90%
- Login success rate > 95%
- Password reset completion rate > 80%
- MFA adoption rate > 60%

### Security Metrics
- Zero security breaches
- < 0.1% failed authentication rate
- < 5% password reset requests
- 100% audit log coverage

### Performance Metrics
- < 500ms average response time
- 99.9% uptime SLA
- < 1% error rate
- Support for 10,000+ concurrent users

## 📋 Implementation Roadmap

### Phase 1: Core Authentication (Week 1-2)
- Basic email/password registration and login
- JWT token generation and validation
- User profile management
- Basic role-based authorization

### Phase 2: Enhanced Security (Week 3-4)
- Google OAuth integration
- TOTP MFA implementation
- Password reset functionality
- Session management

### Phase 3: Advanced Features (Week 5-6)
- Admin user management
- Audit logging
- Rate limiting
- Security monitoring

### Phase 4: Production Readiness (Week 7-8)
- Performance optimization
- Comprehensive testing
- Documentation
- Deployment pipeline

## 📞 Support & Maintenance

### Documentation Requirements
- API documentation with OpenAPI/Swagger
- Architecture decision records
- Security guidelines
- Troubleshooting guides

### Monitoring & Alerting
- Application performance monitoring
- Security incident alerting
- Database health checks
- Log aggregation and analysis

### Backup & Recovery
- Database backups (daily)
- Configuration backups
- Disaster recovery procedures
- Business continuity planning

---

This PRD provides a comprehensive blueprint for implementing secure, scalable authentication and authorization microservices for the JobHub platform. The implementation should follow security best practices and ensure compliance with relevant regulations.