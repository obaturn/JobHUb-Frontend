# JobHub - Security Architecture Design

## 🔒 **Security-First Architecture Overview**

### **Defense-in-Depth Strategy**
JobHub implements multiple layers of security controls to protect user data, prevent unauthorized access, and ensure compliance with privacy regulations.

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet/Public                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Layer 1: Network Security                      │
│  • WAF (Web Application Firewall)                          │
│  • DDoS Protection                                          │
│  • CDN with Security Rules                                  │
│  • Rate Limiting                                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Layer 2: API Gateway Security                  │
│  • JWT Token Validation                                     │
│  • OAuth 2.0 / OIDC                                        │
│  • API Key Management                                       │
│  • Request/Response Filtering                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Layer 3: Application Security                  │
│  • Input Validation & Sanitization                         │
│  • OWASP Security Headers                                   │
│  • SQL Injection Prevention                                 │
│  • XSS Protection                                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Layer 4: Service Mesh Security                 │
│  • mTLS (Mutual TLS)                                        │
│  • Service-to-Service Authentication                        │
│  • Network Policies                                         │
│  • Traffic Encryption                                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Layer 5: Data Security                         │
│  • Encryption at Rest                                       │
│  • Field-Level Encryption                                   │
│  • Database Access Controls                                 │
│  • Backup Encryption                                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 **Authentication & Authorization Architecture**

### **JWT Token Strategy**
```yaml
Access Token:
  - Algorithm: RS256 (RSA with SHA-256)
  - Expiration: 15 minutes
  - Claims: user_id, roles, permissions, iat, exp, iss
  - Storage: Memory (not localStorage for security)

Refresh Token:
  - Algorithm: RS256
  - Expiration: 7 days (configurable)
  - Storage: HttpOnly, Secure, SameSite cookies
  - Rotation: New refresh token on each use
  - Revocation: Stored in Redis for immediate invalidation
```

### **JWT Token Structure**
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "key-id-2024-01"
  },
  "payload": {
    "iss": "https://auth.jobhub.com",
    "sub": "user-123-456-789",
    "aud": ["https://api.jobhub.com"],
    "exp": 1642248600,
    "iat": 1642247700,
    "jti": "token-unique-id",
    "user_id": "user-123-456-789",
    "email": "john.doe@example.com",
    "user_type": "job_seeker",
    "roles": ["job_seeker"],
    "permissions": [
      "jobs:read",
      "jobs:apply",
      "profile:update"
    ],
    "session_id": "session-789-012",
    "mfa_verified": true,
    "device_id": "device-456-789"
  }
}
```

### **Multi-Factor Authentication (MFA)**
```java
@Service
public class MFAService {
    
    private static final int TOTP_WINDOW = 1; // Allow 1 step before/after
    private static final int BACKUP_CODE_LENGTH = 8;
    
    public MFASetupResponse setupTOTP(String userId) {
        String secret = generateTOTPSecret();
        String qrCodeUrl = generateQRCodeURL(userId, secret);
        List<String> backupCodes = generateBackupCodes();
        
        // Store temporarily until verified
        mfaSetupRepository.save(MFASetup.builder()
            .userId(userId)
            .secret(encrypt(secret))
            .backupCodes(encrypt(backupCodes))
            .status(MFAStatus.PENDING)
            .build());
            
        return MFASetupResponse.builder()
            .secret(secret)
            .qrCodeUrl(qrCodeUrl)
            .backupCodes(backupCodes)
            .build();
    }
    
    public boolean verifyTOTP(String userId, String code) {
        MFASetup setup = mfaSetupRepository.findByUserId(userId);
        String secret = decrypt(setup.getSecret());
        
        return TOTPGenerator.verify(secret, code, TOTP_WINDOW);
    }
    
    public boolean verifyBackupCode(String userId, String code) {
        MFASetup setup = mfaSetupRepository.findByUserId(userId);
        List<String> backupCodes = decrypt(setup.getBackupCodes());
        
        if (backupCodes.contains(code)) {
            // Remove used backup code
            backupCodes.remove(code);
            setup.setBackupCodes(encrypt(backupCodes));
            mfaSetupRepository.save(setup);
            return true;
        }
        return false;
    }
}
```

### **Role-Based Access Control (RBAC)**
```java
@Component
public class PermissionEvaluator {
    
    public boolean hasPermission(Authentication auth, String resource, String action) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        
        return user.getPermissions().stream()
            .anyMatch(permission -> 
                permission.getResource().equals(resource) && 
                permission.getAction().equals(action)
            );
    }
    
    public boolean hasRole(Authentication auth, String role) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        return user.getRoles().contains(role);
    }
    
    public boolean isOwnerOrAdmin(Authentication auth, String resourceOwnerId) {
        UserPrincipal user = (UserPrincipal) auth.getPrincipal();
        
        return user.getId().equals(resourceOwnerId) || 
               user.getRoles().contains("admin");
    }
}

// Usage in controllers
@PreAuthorize("hasPermission('jobs', 'create')")
@PostMapping("/jobs")
public ResponseEntity<Job> createJob(@RequestBody CreateJobRequest request) {
    // Implementation
}

@PreAuthorize("isOwnerOrAdmin(#userId)")
@GetMapping("/users/{userId}/profile")
public ResponseEntity<UserProfile> getProfile(@PathVariable String userId) {
    // Implementation
}
```

## 🛡️ **API Security Implementation**

### **Security Headers Configuration**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .headers(headers -> headers
                .frameOptions().deny()
                .contentTypeOptions().and()
                .httpStrictTransportSecurity(hstsConfig -> hstsConfig
                    .maxAgeInSeconds(31536000)
                    .includeSubdomains(true)
                    .preload(true)
                )
                .contentSecurityPolicy("default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline'; " +
                    "style-src 'self' 'unsafe-inline'; " +
                    "img-src 'self' data: https:; " +
                    "font-src 'self' https:; " +
                    "connect-src 'self' https://api.jobhub.com")
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter()))
            )
            .build();
    }
}
```

### **Input Validation & Sanitization**
```java
@RestController
@Validated
public class JobController {
    
    @PostMapping("/jobs")
    public ResponseEntity<Job> createJob(
        @Valid @RequestBody CreateJobRequest request,
        Authentication auth) {
        
        // Sanitize HTML content
        String sanitizedDescription = htmlSanitizer.sanitize(request.getDescription());
        request.setDescription(sanitizedDescription);
        
        // Additional validation
        validateJobRequest(request);
        
        Job job = jobService.createJob(request, auth);
        return ResponseEntity.ok(job);
    }
    
    private void validateJobRequest(CreateJobRequest request) {
        // Business logic validation
        if (request.getSalaryMin() != null && request.getSalaryMax() != null) {
            if (request.getSalaryMin() > request.getSalaryMax()) {
                throw new ValidationException("Minimum salary cannot be greater than maximum");
            }
        }
        
        // SQL injection prevention (using parameterized queries)
        // XSS prevention (HTML sanitization)
        // Path traversal prevention
        if (request.getTitle().contains("../") || request.getTitle().contains("..\\")) {
            throw new SecurityException("Invalid characters in job title");
        }
    }
}

// Custom validation annotations
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SafeHtmlValidator.class)
public @interface SafeHtml {
    String message() default "Content contains unsafe HTML";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class SafeHtmlValidator implements ConstraintValidator<SafeHtml, String> {
    
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return true;
        
        // Use OWASP HTML Sanitizer
        String sanitized = Sanitizers.FORMATTING.sanitize(value);
        return value.equals(sanitized);
    }
}
```

### **Rate Limiting Implementation**
```java
@Component
public class RateLimitingFilter implements Filter {
    
    private final RedisTemplate<String, String> redisTemplate;
    private final RateLimitConfig rateLimitConfig;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String clientId = getClientIdentifier(httpRequest);
        String endpoint = httpRequest.getRequestURI();
        
        RateLimit rateLimit = rateLimitConfig.getRateLimit(endpoint);
        
        if (!isAllowed(clientId, endpoint, rateLimit)) {
            httpResponse.setStatus(429);
            httpResponse.setHeader("X-Rate-Limit-Retry-After", "60");
            httpResponse.getWriter().write("{\"error\":\"Rate limit exceeded\"}");
            return;
        }
        
        chain.doFilter(request, response);
    }
    
    private boolean isAllowed(String clientId, String endpoint, RateLimit rateLimit) {
        String key = "rate_limit:" + clientId + ":" + endpoint;
        String currentCount = redisTemplate.opsForValue().get(key);
        
        if (currentCount == null) {
            redisTemplate.opsForValue().set(key, "1", Duration.ofSeconds(rateLimit.getWindowSeconds()));
            return true;
        }
        
        int count = Integer.parseInt(currentCount);
        if (count >= rateLimit.getMaxRequests()) {
            return false;
        }
        
        redisTemplate.opsForValue().increment(key);
        return true;
    }
    
    private String getClientIdentifier(HttpServletRequest request) {
        // Try to get user ID from JWT token first
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                Claims claims = jwtService.parseToken(token);
                return claims.getSubject();
            } catch (Exception e) {
                // Fall back to IP address
            }
        }
        
        // Fall back to IP address for unauthenticated requests
        return getClientIP(request);
    }
}
```

## 🔒 **Data Protection & Encryption**

### **Encryption at Rest**
```yaml
Database Encryption:
  - PostgreSQL: Transparent Data Encryption (TDE)
  - Field-level encryption for PII data
  - Encrypted backups with separate key management

File Storage Encryption:
  - S3 Server-Side Encryption (SSE-S3)
  - Customer-managed keys (CMK) for sensitive files
  - Encrypted file uploads and downloads

Redis Encryption:
  - TLS encryption for data in transit
  - AUTH password protection
  - Encrypted persistence files
```

### **Field-Level Encryption Service**
```java
@Service
public class EncryptionService {
    
    private final AESUtil aesUtil;
    private final KeyManagementService keyService;
    
    public String encryptPII(String plaintext, String userId) {
        // Get user-specific encryption key
        String encryptionKey = keyService.getUserEncryptionKey(userId);
        
        // Encrypt with AES-256-GCM
        return aesUtil.encrypt(plaintext, encryptionKey);
    }
    
    public String decryptPII(String ciphertext, String userId) {
        String encryptionKey = keyService.getUserEncryptionKey(userId);
        return aesUtil.decrypt(ciphertext, encryptionKey);
    }
    
    // Automatic encryption/decryption for JPA entities
    @Converter
    public static class EncryptedStringConverter implements AttributeConverter<String, String> {
        
        @Autowired
        private EncryptionService encryptionService;
        
        @Override
        public String convertToDatabaseColumn(String attribute) {
            if (attribute == null) return null;
            
            String userId = getCurrentUserId();
            return encryptionService.encryptPII(attribute, userId);
        }
        
        @Override
        public String convertToEntityAttribute(String dbData) {
            if (dbData == null) return null;
            
            String userId = getCurrentUserId();
            return encryptionService.decryptPII(dbData, userId);
        }
    }
}

// Usage in entities
@Entity
public class UserProfile {
    
    @Convert(converter = EncryptedStringConverter.class)
    private String phoneNumber;
    
    @Convert(converter = EncryptedStringConverter.class)
    private String socialSecurityNumber;
    
    // Other fields...
}
```

### **Key Management with HashiCorp Vault**
```java
@Service
public class VaultKeyService implements KeyManagementService {
    
    private final VaultTemplate vaultTemplate;
    
    @Override
    public String getUserEncryptionKey(String userId) {
        String keyPath = "secret/encryption-keys/" + userId;
        
        VaultResponse response = vaultTemplate.read(keyPath);
        
        if (response == null || response.getData() == null) {
            // Generate new key for user
            String newKey = generateEncryptionKey();
            
            Map<String, Object> keyData = Map.of(
                "key", newKey,
                "created_at", Instant.now().toString(),
                "algorithm", "AES-256-GCM"
            );
            
            vaultTemplate.write(keyPath, keyData);
            return newKey;
        }
        
        return (String) response.getData().get("key");
    }
    
    @Override
    public void rotateUserKey(String userId) {
        String oldKey = getUserEncryptionKey(userId);
        String newKey = generateEncryptionKey();
        
        // Store new key
        String keyPath = "secret/encryption-keys/" + userId;
        Map<String, Object> keyData = Map.of(
            "key", newKey,
            "previous_key", oldKey,
            "rotated_at", Instant.now().toString()
        );
        
        vaultTemplate.write(keyPath, keyData);
        
        // Schedule re-encryption of user data
        keyRotationService.scheduleReEncryption(userId, oldKey, newKey);
    }
}
```

## 🔍 **Security Monitoring & Incident Response**

### **Security Event Logging**
```java
@Component
public class SecurityAuditLogger {
    
    private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY");
    
    @EventListener
    public void handleAuthenticationSuccess(AuthenticationSuccessEvent event) {
        UserPrincipal user = (UserPrincipal) event.getAuthentication().getPrincipal();
        
        SecurityEvent securityEvent = SecurityEvent.builder()
            .eventType("AUTHENTICATION_SUCCESS")
            .userId(user.getId())
            .ipAddress(getClientIP())
            .userAgent(getUserAgent())
            .timestamp(Instant.now())
            .details(Map.of(
                "login_method", user.getLoginMethod(),
                "mfa_used", user.isMfaVerified(),
                "session_id", user.getSessionId()
            ))
            .build();
            
        logSecurityEvent(securityEvent);
    }
    
    @EventListener
    public void handleAuthenticationFailure(AuthenticationFailureEvent event) {
        SecurityEvent securityEvent = SecurityEvent.builder()
            .eventType("AUTHENTICATION_FAILURE")
            .ipAddress(getClientIP())
            .userAgent(getUserAgent())
            .timestamp(Instant.now())
            .details(Map.of(
                "failure_reason", event.getException().getMessage(),
                "attempted_username", event.getAuthentication().getName()
            ))
            .severity(SecuritySeverity.HIGH)
            .build();
            
        logSecurityEvent(securityEvent);
        
        // Check for brute force attacks
        checkBruteForceAttack(getClientIP());
    }
    
    private void logSecurityEvent(SecurityEvent event) {
        // Log to security-specific logger
        securityLogger.info("SECURITY_EVENT: {}", objectMapper.writeValueAsString(event));
        
        // Send to SIEM system
        siemService.sendEvent(event);
        
        // Store in database for analysis
        securityEventRepository.save(event);
        
        // Trigger alerts for high-severity events
        if (event.getSeverity() == SecuritySeverity.CRITICAL) {
            alertService.sendSecurityAlert(event);
        }
    }
}
```

### **Anomaly Detection**
```java
@Service
public class SecurityAnomalyDetector {
    
    @Scheduled(fixedDelay = 300000) // Every 5 minutes
    public void detectAnomalies() {
        detectUnusualLoginPatterns();
        detectSuspiciousAPIUsage();
        detectDataExfiltrationAttempts();
    }
    
    private void detectUnusualLoginPatterns() {
        List<LoginEvent> recentLogins = loginEventRepository
            .findByTimestampAfter(Instant.now().minus(Duration.ofHours(1)));
            
        Map<String, List<LoginEvent>> loginsByUser = recentLogins.stream()
            .collect(Collectors.groupingBy(LoginEvent::getUserId));
            
        for (Map.Entry<String, List<LoginEvent>> entry : loginsByUser.entrySet()) {
            String userId = entry.getKey();
            List<LoginEvent> userLogins = entry.getValue();
            
            // Check for multiple failed attempts
            long failedAttempts = userLogins.stream()
                .filter(login -> !login.isSuccessful())
                .count();
                
            if (failedAttempts > 5) {
                SecurityAlert alert = SecurityAlert.builder()
                    .type("BRUTE_FORCE_ATTEMPT")
                    .userId(userId)
                    .severity(SecuritySeverity.HIGH)
                    .description("Multiple failed login attempts detected")
                    .build();
                    
                alertService.raiseAlert(alert);
            }
            
            // Check for logins from multiple locations
            Set<String> loginLocations = userLogins.stream()
                .map(LoginEvent::getLocation)
                .collect(Collectors.toSet());
                
            if (loginLocations.size() > 3) {
                SecurityAlert alert = SecurityAlert.builder()
                    .type("SUSPICIOUS_LOCATION_PATTERN")
                    .userId(userId)
                    .severity(SecuritySeverity.MEDIUM)
                    .description("Logins from multiple geographic locations")
                    .build();
                    
                alertService.raiseAlert(alert);
            }
        }
    }
    
    private void detectSuspiciousAPIUsage() {
        // Detect unusual API call patterns
        List<APICallEvent> recentCalls = apiCallEventRepository
            .findByTimestampAfter(Instant.now().minus(Duration.ofMinutes(15)));
            
        Map<String, Long> callsByEndpoint = recentCalls.stream()
            .collect(Collectors.groupingBy(
                APICallEvent::getEndpoint,
                Collectors.counting()
            ));
            
        for (Map.Entry<String, Long> entry : callsByEndpoint.entrySet()) {
            String endpoint = entry.getKey();
            Long callCount = entry.getValue();
            
            // Check against baseline
            Long baseline = getBaselineCallCount(endpoint);
            if (callCount > baseline * 5) { // 5x normal traffic
                SecurityAlert alert = SecurityAlert.builder()
                    .type("UNUSUAL_API_TRAFFIC")
                    .severity(SecuritySeverity.MEDIUM)
                    .description("Unusual traffic spike detected for " + endpoint)
                    .build();
                    
                alertService.raiseAlert(alert);
            }
        }
    }
}
```

### **Incident Response Automation**
```java
@Service
public class IncidentResponseService {
    
    @EventListener
    public void handleSecurityAlert(SecurityAlert alert) {
        switch (alert.getType()) {
            case "BRUTE_FORCE_ATTEMPT":
                handleBruteForceAttack(alert);
                break;
            case "DATA_EXFILTRATION":
                handleDataExfiltration(alert);
                break;
            case "SUSPICIOUS_ADMIN_ACCESS":
                handleSuspiciousAdminAccess(alert);
                break;
        }
    }
    
    private void handleBruteForceAttack(SecurityAlert alert) {
        // Automatically lock user account
        userService.lockAccount(alert.getUserId(), "Brute force attack detected");
        
        // Block IP address temporarily
        ipBlockingService.blockIP(alert.getIpAddress(), Duration.ofHours(1));
        
        // Notify security team
        notificationService.sendSecurityNotification(
            "Brute force attack detected and mitigated",
            alert
        );
        
        // Create incident ticket
        incidentService.createIncident(
            "SECURITY_INCIDENT",
            "Brute force attack on user " + alert.getUserId(),
            alert
        );
    }
    
    private void handleDataExfiltration(SecurityAlert alert) {
        // Immediately revoke all user sessions
        sessionService.revokeAllUserSessions(alert.getUserId());
        
        // Disable API access
        apiKeyService.disableUserAPIKeys(alert.getUserId());
        
        // Escalate to security team immediately
        alertService.escalateToSecurityTeam(alert);
        
        // Start forensic data collection
        forensicsService.startDataCollection(alert.getUserId());
    }
}
```

## 🛡️ **Compliance & Privacy**

### **GDPR Compliance Implementation**
```java
@Service
public class GDPRComplianceService {
    
    public PersonalDataExport exportUserData(String userId) {
        // Collect all personal data across services
        UserProfile profile = userService.getUserProfile(userId);
        List<JobApplication> applications = jobService.getUserApplications(userId);
        List<Message> messages = messagingService.getUserMessages(userId);
        List<Resume> resumes = resumeService.getUserResumes(userId);
        
        return PersonalDataExport.builder()
            .userId(userId)
            .exportDate(Instant.now())
            .profile(profile)
            .applications(applications)
            .messages(messages)
            .resumes(resumes)
            .build();
    }
    
    public void deleteUserData(String userId, DataDeletionRequest request) {
        // Verify user identity and consent
        if (!verifyDeletionConsent(userId, request)) {
            throw new UnauthorizedException("Invalid deletion consent");
        }
        
        // Soft delete with retention period for legal requirements
        userService.softDeleteUser(userId);
        
        // Anonymize data that must be retained
        anonymizeRetainedData(userId);
        
        // Schedule hard deletion after retention period
        scheduledDeletionService.scheduleHardDeletion(userId, Duration.ofDays(90));
        
        // Log deletion for audit
        auditService.logDataDeletion(userId, request);
    }
    
    private void anonymizeRetainedData(String userId) {
        // Replace PII with anonymized values
        String anonymizedId = "anon_" + UUID.randomUUID().toString();
        
        // Update analytics data
        analyticsService.anonymizeUserData(userId, anonymizedId);
        
        // Update audit logs
        auditService.anonymizeUserLogs(userId, anonymizedId);
    }
}
```

This comprehensive security architecture ensures JobHub meets enterprise-grade security requirements while maintaining usability and performance. The multi-layered approach provides defense against various attack vectors while enabling compliance with privacy regulations.