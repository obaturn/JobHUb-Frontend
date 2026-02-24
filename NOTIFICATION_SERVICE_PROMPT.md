# 🚀 JobHub Notification Service Integration Guide

## **Overview**

When a user submits a job application via the Application Service, a Kafka event is published to the `application-events` topic. The Notification Service consumes this event and sends a **personalized congratulation email** to the applicant with the JobHub logo and company details.

---

## **📋 PROMPT FOR NOTIFICATION SERVICE DEVELOPER**

---

### **1. Kafka Consumer Setup**

Create a Kafka consumer that listens to the `application-events` topic:

```java
@Service
public class ApplicationEventConsumer {

    @KafkaListener(topics = "application-events", groupId = "notification-service")
    public void consumeApplicationEvent(ApplicationEventData event) {
        // Process event and send congratulation email to applicant
        sendApplicantCongratulationEmail(event);
    }
}
```

---

### **2. Event Data Structure**

The `ApplicationEventData` contains all necessary information:

```json
{
    "eventType": "APPLICATION_SUBMITTED",
    "applicationId": "app-789",
    "jobId": 456,
    "jobTitle": "Senior Software Engineer",
    "companyName": "Innovate Inc.",
    "companyId": "company-123",
    "employerId": "employer-456",
    "userId": "user-789",
    "applicantName": "John Doe",
    "applicantEmail": "john@example.com",
    "resumeId": "resume-123",
    "status": "APPLIED",
    "appliedDate": "2024-02-11",
    "timestamp": "2024-02-11T10:30:00"
}
```

---

### **3. Email Template with JobHub Logo**

Create an HTML email template that includes:

- ✅ JobHub logo at the top
- ✅ Personalized congratulation message
- ✅ Job title and company name
- ✅ Professional styling (like LinkedIn/Indeed)
- ✅ Call-to-action button to view application status

**Email Template File: `applicant-congratulations.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Submitted - JobHub</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header with JobHub Logo -->
        <tr>
            <td style="background: linear-gradient(135deg, #0061f2 0%, #00c6f7 100%); padding: 30px 40px; text-align: center;">
                <!-- JobHub Logo -->\n                <img src="https://jobhub.com/logo.png" alt="JobHub Logo" width="120" style="display: block; margin: 0 auto;">\n                <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 10px 0 0 0;">Your Professional Job Marketplace</p>\n            </td>\n        </tr>\n        \n        <!-- Main Content -->\n        <tr>\n            <td style="padding: 40px;">\n                <!-- Congratulation Header -->\n                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">\n                    <tr>\n                        <td style="text-align: center; padding-bottom: 20px;">\n                            <span style="font-size: 48px;">🎉</span>\n                            <h1 style="color: #1a1a1a; font-size: 24px; margin: 15px 0 0 0; font-weight: 600;">\n                                Congratulations!\n                            </h1>\n                            <p style="color: #666666; font-size: 16px; margin: 10px 0 0 0;\">\n                                Your application has been submitted successfully\n                            </p>\n                        </td>\n                    </tr>\n                </table>\n                \n                <!-- Application Details Card -->\n                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa; border-radius: 12px; margin-top: 25px;">\n                    <tr>\n                        <td style="padding: 25px;">\n                            <h2 style="color: #0061f2; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">\n                                📋 Application Details\n                            </h2>\n                            \n                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">\n                                <tr>\n                                    <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">\n                                        <span style="color: #666666; font-size: 14px;">Job Title</span><br>\n                                        <span style="color: #1a1a1a; font-size: 16px; font-weight: 500;">${jobTitle}</span>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td style=\"padding: 10px 0; border-bottom: 1px solid #e9ecef;\">\n                                        <span style=\"color: #666666; font-size: 14px;\">Company</span><br>\n                                        <span style=\"color: #1a1a1a; font-size: 16px; font-weight: 500;\">${companyName}</span>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td style=\"padding: 10px 0;\">\n                                        <span style=\"color: #666666; font-size: 14px;\">Applied On</span><br>\n                                        <span style=\"color: #1a1a1a; font-size: 16px; font-weight: 500;\">${appliedDate}</span>\n                                    </td>\n                                </tr>\n                            </table>\n                        </td>\n                    </tr>\n                </table>\n                \n                <!-- Next Steps -->\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top: 30px;\">\n                    <tr>\n                        <td style=\"background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px 20px; border-radius: 0 8px 8px 0;\">\n                            <p style=\"color: #2e7d32; font-size: 14px; margin: 0;\">\n                                ✅ <strong>Next Steps:</strong> The company will review your application and get back to you soon. Keep an eye on your email and JobHub notifications!\n                            </p>\n                        </td>\n                    </tr>\n                </table>\n                \n                <!-- CTA Button -->\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top: 30px;\">\n                    <tr>\n                        <td style=\"text-align: center;\">\n                            <a href=\"${applicationStatusLink}\" style=\"display: inline-block; background: linear-gradient(135deg, #0061f2 0%, #00c6f7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;\">\n                                View Application Status\n                            </a>\n                        </td>\n                    </tr>\n                </table>\n                \n                <!-- Footer -->\n                <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef;\">\n                    <tr>\n                        <td style=\"text-align: center;\">\n                            <p style=\"color: #999999; font-size: 12px; margin: 0;\">\n                                Good luck with your application! 🍀\n                            </p>\n                            <p style=\"color: #999999; font-size: 12px; margin: 10px 0 0 0;\">\n                                © 2024 JobHub. All rights reserved.\n                            </p>\n                            <p style=\"color: #999999; font-size: 12px; margin: 10px 0 0 0;\">\n                                <a href=\"${unsubscribeLink}\" style=\"color: #0061f2;\">Unsubscribe</a> | \n                                <a href=\"${privacyLink}\" style=\"color: #0061f2;\">Privacy Policy</a>\n                            </p>\n                        </td>\n                    </tr>\n                </table>\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n```

---

### **4. Complete Notification Service Implementation**

```java\npackage com.jobhub.notification.service;\n\n@Service\n@Slf4j\npublic class NotificationService {\n\n    @Autowired\n    private EmailService emailService;\n\n    @Autowired\n    private ApplicationEventRepository applicationEventRepository;\n\n    /**\n     * Send congratulation email to applicant when they submit a job application\n     */\n    public void sendApplicantCongratulationEmail(ApplicationEventData event) {\n        log.info(\"📧 Sending congratulation email to applicant: {}\", event.getApplicantEmail());\n        \n        try {\n            // Prepare email variables\n            Map<String, String> variables = new HashMap<>();\n            variables.put(\"applicantName\", event.getApplicantName());\n            variables.put(\"jobTitle\", event.getJobTitle());\n            variables.put(\"companyName\", event.getCompanyName());\n            variables.put(\"appliedDate\", event.getAppliedDate());\n            variables.put(\"applicationId\", event.getApplicationId());\n            variables.put(\"applicationStatusLink\", \n                \"https://jobhub.com/my-applications/\" + event.getApplicationId());\n            variables.put(\"unsubscribeLink\", \"https://jobhub.com/unsubscribe\");\n            variables.put(\"privacyLink\", \"https://jobhub.com/privacy\");\n            \n            // Create personalized subject line\n            String emailSubject = String.format(\n                \"🎉 Application Submitted! %s at %s\",\n                event.getJobTitle(),\n                event.getCompanyName()\n            );\n            \n            // Send email using template\n            emailService.sendTemplatedEmail(\n                event.getApplicantEmail(),\n                emailSubject,\n                \"applicant-congratulations.html\",\n                variables\n            );\n            \n            log.info(\"✅ Congratulation email sent successfully to: {}\", event.getApplicantEmail());\n            \n        } catch (Exception e) {\n            log.error(\"❌ Failed to send congratulation email to: {}\", event.getApplicantEmail(), e);\n        }\n    }\n}\n```

---

### **5. Email Service Interface**

```java\npackage com.jobhub.notification.service;\n\npublic interface EmailService {\n    \n    /**\n     * Send a templated email\n     * @param to Recipient email address\n     * @param subject Email subject line\n     * @param templateName Name of the HTML template (without extension)\n     * @param variables Map of placeholder variables to replace in template\n     */\n    void sendTemplatedEmail(String to, String subject, String templateName, \n                           Map<String, String> variables);\n    \n    /**\n     * Send a simple text email\n     */\n    void sendSimpleEmail(String to, String subject, String body);\n}\n```

---

### **6. Kafka Event Publisher (Application Service)**

When a user submits an application, publish to Kafka:

```java\n@Service\npublic class ApplicationService {\n    \n    @Autowired\n    private KafkaTemplate<String, ApplicationEventData> kafkaTemplate;\n    \n    @Value(\"${kafka.topic.application-events}\")\n    private String applicationEventsTopic;\n    \n    public Application submitApplication(SubmitApplicationRequest request) {\n        // ... existing application submission logic\n        \n        // Publish Kafka event for notification service\n        ApplicationEventData event = ApplicationEventData.builder()\n            .eventType(\"APPLICATION_SUBMITTED\")\n            .applicationId(application.getId())\n            .jobId(application.getJob().getId())\n            .jobTitle(application.getJob().getTitle())\n            .companyName(application.getJob().getCompany().getName())\n            .companyId(application.getJob().getCompany().getId())\n            .employerId(application.getJob().getCompany().getEmployerId())\n            .userId(request.getUserId())\n            .applicantName(request.getApplicantName())\n            .applicantEmail(request.getApplicantEmail())\n            .resumeId(request.getResumeId())\n            .status(\"APPLIED\")\n            .appliedDate(LocalDate.now().n            .timestamptoString())\(LocalDateTime.now().toString())\n            .build();\n        \n        kafkaTemplate.send(applicationEventsTopic, event);\n        \n        return application;\n    }\n}\n```

---

### **7. Required Configuration**

Add to your `application.yml`:

```yaml\nkafka:\n  topic:\n    application-events: application-events\n  consumer:\n    group-id: notification-service\n    auto-offset-reset: earliest\n\nnotification:\n  email:\n    from: noreply@jobhub.com\n    from-name: JobHub\n  templates:\n    path: /templates/email/\n```

---

### **8. Testing the Integration**

**Test Case 1: Successful Application Submission**
1. Submit a job application via frontend
2. Check Kafka topic for published event
3. Verify email is received at applicant's email
4. Check email content includes:
   - JobHub logo ✅
   - Congratulations message ✅
   - Job title and company name ✅
   - Professional styling ✅

**Test Case 2: Multiple Applications**
1. Submit multiple applications to different jobs
2. Verify each applicant receives a separate congratulation email
3. Verify email content is personalized for each application

---

### **9. Message Flow Diagram**

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐\n│   Frontend      │────▶│  Application      │────▶│  Kafka Topic        │\n│   (User Apply)  │     │  Service          │     │  (application-events)│\n└─────────────────┘     └──────────────────┘     └──────────┬──────────┘\n                                                            │\n                                                            ▼\n┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐\n│   Applicant     │◀────│  Email Service    │◀────│  Notification       │\n│   (Email ✅)     │     │  (Send Congrats) │     │  Service            │\n└─────────────────┘     └──────────────────┘     └─────────────────────┘\n```

---

### **10. Variables Reference**

| Variable | Description | Example |
|----------|-------------|---------|
| `${applicantName}` | Name of the applicant | "John Doe" |
| `${jobTitle}` | Title of the job applied | "Senior Software Engineer" |
| `${companyName}` | Name of the hiring company | "Innovate Inc." |
| `${appliedDate}` | Date of application | "2024-02-11" |
| `${applicationId}` | Unique application ID | "app-789" |
| `${applicationStatusLink}` | Link to view application status | "https://jobhub.com/my-applications/app-789" |
| `${unsubscribeLink}` | Unsubscribe from notifications | "https://jobhub.com/unsubscribe" |
| `${privacyLink}` | Privacy policy link | "https://jobhub.com/privacy" |

---

### **11. Success Criteria**

✅ Email sent within 5 seconds of application submission  
✅ Email contains personalized data (name, job, company)  
✅ JobHub logo displays correctly in email client  
✅ Email is responsive (works on mobile and desktop)  
✅ Email passes spam filters (proper DKIM/SPF setup)  
✅ No duplicate emails sent for same application  

---

### **12. Troubleshooting**

| Issue | Solution |
|-------|----------|
| Email not received | Check spam folder, verify email address |
| Logo not loading | Ensure logo URL is publicly accessible (https) |
| Template variables not replaced | Check variable names match exactly |
| Kafka event not consumed | Verify consumer group ID and topic name |
| Email sending slow | Check SMTP configuration and rate limits |

---

**This guide will help your Notification Service developer implement a professional congratulation email system with JobHub branding!** 🎉
