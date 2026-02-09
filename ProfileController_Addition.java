// Add this to your ProfileController class

// You'll need these imports at the top:
import com.example.Authentication_System.Domain.repository.inputRepositoryPort.UserRepository;
import com.example.Authentication_System.Domain.model.User;

// Add UserRepository to your constructor:
private final UserRepository userRepository;

// Add this method to your ProfileController:

@GetMapping
public ResponseEntity<UserProfileResponse> getProfile(HttpServletRequest request) {
    String correlationId = getCorrelationId(request);
    UUID userId = null;
    String ipAddress = getClientIp(request);
    String userAgent = getUserAgent(request);
    String action = "GET_PROFILE";
    
    try {
        setupMdc(correlationId, null, action, ipAddress, userAgent);
        logger.info("[START] Retrieving profile for user");
        
        userId = getCurrentUserId(request);
        setupMdc(correlationId, userId, action, ipAddress, userAgent);
        
        // Get user from database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Create profile response
        UserProfileResponse profile = UserProfileResponse.builder()
                .id(user.getId().toString())
                .userId(user.getId().toString())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .location(user.getLocation())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
                .build();
        
        logger.info("[SUCCESS] Retrieved profile for userId={}", userId);
        return ResponseEntity.ok(profile);
    } catch (Exception e) {
        logger.error("[ERROR] Failed to retrieve profile: {}", e.getMessage());
        throw e;
    } finally {
        clearMdc();
    }
}

@PutMapping
public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest profileRequest, 
                                                        HttpServletRequest request) {
    String correlationId = getCorrelationId(request);
    UUID userId = null;
    String ipAddress = getClientIp(request);
    String userAgent = getUserAgent(request);
    String action = "UPDATE_PROFILE";
    
    try {
        setupMdc(correlationId, null, action, ipAddress, userAgent);
        logger.info("[START] Updating profile for user");
        
        userId = getCurrentUserId(request);
        setupMdc(correlationId, userId, action, ipAddress, userAgent);
        
        // Get user from database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        // Update user fields
        if (profileRequest.getFirstName() != null) {
            user.setFirstName(profileRequest.getFirstName());
        }
        if (profileRequest.getLastName() != null) {
            user.setLastName(profileRequest.getLastName());
        }
        if (profileRequest.getPhone() != null) {
            user.setPhone(profileRequest.getPhone());
        }
        if (profileRequest.getLocation() != null) {
            user.setLocation(profileRequest.getLocation());
        }
        if (profileRequest.getBio() != null) {
            user.setBio(profileRequest.getBio());
        }
        if (profileRequest.getAvatarUrl() != null) {
            user.setAvatarUrl(profileRequest.getAvatarUrl());
        }
        
        user.setUpdatedAt(Instant.now());
        User updatedUser = userRepository.save(user);
        
        // Create profile response
        UserProfileResponse profile = UserProfileResponse.builder()
                .id(updatedUser.getId().toString())
                .userId(updatedUser.getId().toString())
                .firstName(updatedUser.getFirstName())
                .lastName(updatedUser.getLastName())
                .phone(updatedUser.getPhone())
                .location(updatedUser.getLocation())
                .bio(updatedUser.getBio())
                .avatarUrl(updatedUser.getAvatarUrl())
                .createdAt(updatedUser.getCreatedAt() != null ? updatedUser.getCreatedAt().toString() : null)
                .updatedAt(updatedUser.getUpdatedAt() != null ? updatedUser.getUpdatedAt().toString() : null)
                .build();
        
        // Create Kafka event for profile updated
        ProfileUpdatedEvent profileUpdatedEvent = ProfileUpdatedEvent.fromUser(updatedUser, userId, correlationId);
        createOutboxEvent(profileUpdatedEvent);
        
        logger.info("[SUCCESS] Profile updated for userId={}", userId);
        return ResponseEntity.ok(profile);
    } catch (Exception e) {
        logger.error("[ERROR] Failed to update profile: {}", e.getMessage());
        throw e;
    } finally {
        clearMdc();
    }
}

// You'll also need these DTOs:

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public static class UserProfileResponse {
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String phone;
    private String location;
    private String bio;
    private String avatarUrl;
    private String createdAt;
    private String updatedAt;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public static class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String location;
    private String bio;
    private String avatarUrl;
}