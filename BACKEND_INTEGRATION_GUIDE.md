# Backend Integration Guide - Microservices

## 🔧 Setup Instructions for Microservices Architecture

### 1. Environment Configuration

Create a `.env.local` file in your project root:

```env
# For local development (Authentication Service)
REACT_APP_API_URL=http://localhost:8081/api/v1

# For production
# REACT_APP_API_URL=https://your-auth-service.com/api/v1
```

### 2. Microservices Architecture

Since you're using microservices, make sure:
- ✅ **Authentication Service** running on `http://localhost:8081`
- ✅ **API Gateway** (if applicable) properly routing requests
- ✅ **Service Discovery** working correctly
- ✅ **CORS** configured on the authentication service

### 3. CORS Configuration for Port 8081

Add this to your Authentication Service (Spring Boot):

```java
@Configuration
@EnableWebSecurity
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 4. Authentication Service Endpoints

Make sure these endpoints are available on port 8081:

```java
// Profile Management (Authentication Service)
GET    /api/v1/auth/profile          // Get user profile  
PUT    /api/v1/auth/profile          // Update user profile
DELETE /api/v1/auth/account          // Delete account

// MFA Management (Authentication Service)
POST   /api/v1/auth/mfa/setup        // Setup MFA
POST   /api/v1/auth/mfa/enable       // Enable MFA  
POST   /api/v1/auth/login/mfa        // Verify MFA login

// Health Check (Optional)
GET    /api/v1/health                // Health check endpoint
```

### 5. Microservices Communication

If you have multiple services:

```
Frontend (3000) → Authentication Service (8081) → User Profile Service
                → Job Service (8082)
                → Messaging Service (8083)
                → etc.
```

### 6. Testing the Connection

1. **Start your Authentication Service** on port 8081
2. Go to **Settings → Security & Privacy** in the frontend
3. Click **"Test API Connection"** button
4. Check browser console for detailed logs

### 7. Service-Specific Configuration

For different environments, you can configure different service URLs:

```env
# Development
REACT_APP_API_URL=http://localhost:8081/api/v1

# Staging  
REACT_APP_API_URL=https://auth-service-staging.yourcompany.com/api/v1

# Production
REACT_APP_API_URL=https://auth-service.yourcompany.com/api/v1
```

### 8. API Gateway Integration (Optional)

If using an API Gateway:

```env
# All requests go through API Gateway
REACT_APP_API_URL=http://localhost:8080/auth/api/v1

# Gateway routes:
# /auth/* → Authentication Service (8081)
# /jobs/* → Job Service (8082)  
# /messages/* → Messaging Service (8083)
```

### 9. Common Microservices Issues

**Issue: "Failed to fetch" on port 8081**
- ✅ Check if Authentication Service is running: `curl http://localhost:8081/api/v1/health`
- ✅ Verify service discovery is working
- ✅ Check if service is registered correctly

**Issue: CORS errors with microservices**
- ✅ Configure CORS on each service individually
- ✅ Or configure CORS at API Gateway level
- ✅ Make sure preflight OPTIONS requests are handled

**Issue: Token validation across services**
- ✅ Ensure JWT secret is shared across services
- ✅ Or use a centralized token validation service
- ✅ Check token format and expiration

### 10. Service Health Checks

Add health check endpoints to monitor your services:

```java
@RestController
@RequestMapping("/api/v1")
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "authentication-service");
        status.put("port", "8081");
        status.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(status);
    }
}
```

### 11. Production Deployment

For production with microservices:

1. **Use service mesh** (Istio, Linkerd) for service-to-service communication
2. **Configure load balancers** for each service
3. **Set up proper DNS** for service discovery
4. **Use HTTPS** for all external communication
5. **Configure environment-specific URLs**

## 🚀 Ready for Microservices

The frontend is now configured for port 8081. Once your Authentication Service is running and CORS is configured, the profile and MFA features should work seamlessly! 🎯