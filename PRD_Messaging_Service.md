# Messaging Service - Product Requirements Document (PRD)

## 📋 **Product Overview**

The Messaging Service provides real-time communication capabilities between users on the JobHub platform, including direct messaging, file sharing, conversation management, and notification integration.

## 🎯 **Business Objectives**

- Enable direct communication between job seekers and employers
- Facilitate networking conversations between professionals
- Support file sharing for resumes, portfolios, and documents
- Provide real-time messaging experience
- Integrate with notification system for message alerts
- Maintain message history and search capabilities

## 👥 **User Personas**

### Job Seeker
- Communicates with potential employers
- Networks with other professionals
- Shares resumes and portfolio materials
- Receives interview scheduling messages
- Asks questions about job opportunities

### Employer/Recruiter
- Reaches out to potential candidates
- Conducts initial screening conversations
- Shares job details and company information
- Coordinates interview scheduling
- Provides application status updates

### Professional Networker
- Connects with industry peers
- Shares industry insights and opportunities
- Builds professional relationships
- Exchanges contact information

## 🏗️ **System Architecture**

### **Service Dependencies**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │────│Messaging Service│────│  User Service   │
│                 │    │                 │    │                 │
│ - User Identity │    │ - Conversations │    │ - User Profiles │
│ - Permissions   │    │ - Messages      │    │ - Connection    │
└─────────────────┘    │ - File Sharing  │    │   Status        │
                       │ - Real-time     │    └─────────────────┘
┌─────────────────┐    │                 │    ┌─────────────────┐
│Notification Svc │────│                 │────│  File Storage   │
│                 │    └─────────────────┘    │                 │
│ - Message Alerts│                           │ - Attachments   │
│ - Push Notifs   │    ┌─────────────────┐    │ - Images        │
└─────────────────┘    │   PostgreSQL    │    │ - Documents     │
                       │                 │    └─────────────────┘
┌─────────────────┐    │ - message_db    │    ┌─────────────────┐
│  WebSocket      │────│ - Conversations │────│     Redis       │
│                 │    │ - Messages      │    │                 │
│ - Real-time     │    │ - Attachments   │    │ - Online Status │
│ - Typing Status │    │ - Participants  │    │ - Message Cache │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 **Functional Requirements**

### **1. Conversation Management**

#### **1.1 Start New Conversation**
- **Endpoint**: `POST /api/v1/messages/conversations`
- **Authentication**: Required
- **Authorization**: Users must be connected or have messaging permissions

**Request Body:**
```json
{
  "participantIds": ["user-789-012"],
  "initialMessage": "Hi John, I saw your profile and I'm interested in discussing the frontend developer position at Tech Corp.",
  "subject": "Frontend Developer Position Inquiry"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv-123-456-789",
      "type": "direct",
      "subject": "Frontend Developer Position Inquiry",
      "participants": [
        {
          "id": "user-123-456",
          "firstName": "Jane",
          "lastName": "Smith",
          "avatarUrl": "https://cdn.jobhub.com/avatars/user-123.jpg",
          "headline": "HR Manager at Tech Corp",
          "isOnline": true,
          "lastSeen": "2024-01-15T10:30:00Z"
        },
        {
          "id": "user-789-012",
          "firstName": "John",
          "lastName": "Doe",
          "avatarUrl": "https://cdn.jobhub.com/avatars/user-789.jpg",
          "headline": "Senior Frontend Developer",
          "isOnline": false,
          "lastSeen": "2024-01-15T09:45:00Z"
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z",
      "lastMessageAt": "2024-01-15T10:30:00Z",
      "messageCount": 1,
      "unreadCount": 0
    },
    "message": {
      "id": "msg-123-456-789",
      "content": "Hi John, I saw your profile...",
      "senderId": "user-123-456",
      "timestamp": "2024-01-15T10:30:00Z",
      "messageType": "text",
      "status": "sent"
    }
  }
}
```

**Business Rules:**
- Users can only message connections or through job applications
- Initial message limited to 1000 characters
- Subject optional for direct messages
- Conversation created only if message sent successfully
- Both participants automatically added to conversation

#### **1.2 Get User Conversations**
- **Endpoint**: `GET /api/v1/messages/conversations`
- **Authentication**: Required
- **Query Parameters**:
  - `type`: Conversation type (direct, group)
  - `unread`: Show only unread conversations
  - `archived`: Include archived conversations
  - `page`: Page number
  - `limit`: Items per page (max 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv-123-456",
        "type": "direct",
        "subject": "Frontend Developer Position",
        "participants": [
          {
            "id": "user-789-012",
            "firstName": "John",
            "lastName": "Doe",
            "avatarUrl": "https://cdn.jobhub.com/avatars/user-789.jpg",
            "headline": "Senior Frontend Developer",
            "isOnline": true
          }
        ],
        "lastMessage": {
          "id": "msg-456-789",
          "content": "That sounds great! When would be a good time for a call?",
          "senderId": "user-789-012",
          "timestamp": "2024-01-15T14:30:00Z",
          "messageType": "text"
        },
        "unreadCount": 2,
        "lastMessageAt": "2024-01-15T14:30:00Z",
        "isArchived": false,
        "isMuted": false
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

### **2. Message Operations**

#### **2.1 Send Message**
- **Endpoint**: `POST /api/v1/messages/conversations/{conversationId}/messages`
- **Authentication**: Required
- **Authorization**: User must be conversation participant

**Request Body:**
```json
{
  "content": "Thank you for reaching out! I'm definitely interested in learning more about the position.",
  "messageType": "text",
  "parentMessageId": null,
  "metadata": {
    "mentions": ["user-123-456"],
    "jobId": "job-456-789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg-789-012-345",
      "conversationId": "conv-123-456",
      "content": "Thank you for reaching out!...",
      "senderId": "user-789-012",
      "messageType": "text",
      "parentMessageId": null,
      "timestamp": "2024-01-15T10:35:00Z",
      "status": "sent",
      "metadata": {
        "mentions": ["user-123-456"],
        "jobId": "job-456-789"
      }
    }
  }
}
```

**Message Types:**
- `text`: Regular text message
- `file`: File attachment
- `image`: Image attachment
- `system`: System-generated message (e.g., "User joined conversation")

**Business Rules:**
- Message content limited to 5000 characters
- Messages cannot be empty (unless file attachment)
- Parent message must exist for replies
- Mentions must be conversation participants
- System messages can only be created by system

#### **2.2 Get Conversation Messages**
- **Endpoint**: `GET /api/v1/messages/conversations/{conversationId}/messages`
- **Authentication**: Required
- **Authorization**: User must be conversation participant
- **Query Parameters**:
  - `before`: Get messages before timestamp (pagination)
  - `after`: Get messages after timestamp
  - `limit`: Number of messages (default: 50, max: 100)
  - `messageType`: Filter by message type

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-123-456",
        "content": "Hi John, I saw your profile...",
        "senderId": "user-123-456",
        "sender": {
          "firstName": "Jane",
          "lastName": "Smith",
          "avatarUrl": "https://cdn.jobhub.com/avatars/user-123.jpg"
        },
        "messageType": "text",
        "timestamp": "2024-01-15T10:30:00Z",
        "status": "read",
        "readBy": [
          {
            "userId": "user-789-012",
            "readAt": "2024-01-15T10:32:00Z"
          }
        ],
        "reactions": [
          {
            "emoji": "👍",
            "users": ["user-789-012"],
            "count": 1
          }
        ],
        "isEdited": false,
        "editedAt": null
      }
    ],
    "hasMore": true,
    "nextCursor": "2024-01-15T10:30:00Z"
  }
}
```

#### **2.3 Edit Message**
- **Endpoint**: `PUT /api/v1/messages/{messageId}`
- **Authentication**: Required
- **Authorization**: User must be message sender

**Request Body:**
```json
{
  "content": "Thank you for reaching out! I'm very interested in learning more about the position."
}
```

**Business Rules:**
- Can only edit own messages
- Cannot edit messages older than 24 hours
- Cannot edit system messages
- Edit history is tracked
- Edited messages show "edited" indicator

#### **2.4 Delete Message**
- **Endpoint**: `DELETE /api/v1/messages/{messageId}`
- **Authentication**: Required
- **Authorization**: User must be message sender or conversation admin

**Business Rules:**
- Soft delete - message marked as deleted but preserved
- Cannot delete messages older than 24 hours
- Deleted messages show "Message deleted" placeholder
- File attachments remain accessible to other participants

#### **2.5 React to Message**
- **Endpoint**: `POST /api/v1/messages/{messageId}/reactions`
- **Authentication**: Required

**Request Body:**
```json
{
  "emoji": "👍"
}
```

**Supported Reactions:**
- 👍 (thumbs up)
- ❤️ (heart)
- 😊 (smile)
- 😮 (wow)
- 😢 (sad)
- 😡 (angry)

### **3. File Sharing**

#### **3.1 Upload File Attachment**
- **Endpoint**: `POST /api/v1/messages/conversations/{conversationId}/files`
- **Content-Type**: `multipart/form-data`
- **Authentication**: Required

**Request:**
```
file: [resume.pdf]
caption: "Here's my updated resume"
```

**File Validation:**
- Supported types: PDF, DOC, DOCX, JPG, PNG, GIF
- Maximum file size: 25MB
- Virus scanning before storage
- File name sanitization

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg-file-123",
      "conversationId": "conv-123-456",
      "content": "Here's my updated resume",
      "senderId": "user-789-012",
      "messageType": "file",
      "timestamp": "2024-01-15T10:40:00Z",
      "attachment": {
        "id": "att-123-456",
        "fileName": "John_Doe_Resume_2024.pdf",
        "originalFileName": "My Resume.pdf",
        "fileSize": 2048576,
        "fileType": "application/pdf",
        "fileUrl": "https://cdn.jobhub.com/attachments/att-123.pdf",
        "thumbnailUrl": null,
        "isScanned": true,
        "scanResult": "clean"
      }
    }
  }
}
```

#### **3.2 Download File**
- **Endpoint**: `GET /api/v1/messages/attachments/{attachmentId}/download`
- **Authentication**: Required
- **Authorization**: User must be conversation participant

**Business Rules:**
- Download tracking for analytics
- Temporary signed URLs for security
- Access logs for audit purposes

### **4. Real-time Features**

#### **4.1 WebSocket Connection**
- **Endpoint**: `WSS /api/v1/messages/ws`
- **Authentication**: JWT token in query parameter or header

**Connection Events:**
```json
{
  "type": "connection_established",
  "data": {
    "userId": "user-123-456",
    "connectionId": "conn-789-012",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### **4.2 Real-time Message Delivery**
**Incoming Message Event:**
```json
{
  "type": "message_received",
  "data": {
    "conversationId": "conv-123-456",
    "message": {
      "id": "msg-789-012",
      "content": "Hello there!",
      "senderId": "user-789-012",
      "timestamp": "2024-01-15T10:35:00Z",
      "messageType": "text"
    }
  }
}
```

#### **4.3 Typing Indicators**
**Start Typing:**
```json
{
  "type": "typing_start",
  "data": {
    "conversationId": "conv-123-456",
    "userId": "user-789-012",
    "timestamp": "2024-01-15T10:34:30Z"
  }
}
```

**Stop Typing:**
```json
{
  "type": "typing_stop",
  "data": {
    "conversationId": "conv-123-456",
    "userId": "user-789-012",
    "timestamp": "2024-01-15T10:34:45Z"
  }
}
```

#### **4.4 Online Status**
**User Online:**
```json
{
  "type": "user_online",
  "data": {
    "userId": "user-789-012",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**User Offline:**
```json
{
  "type": "user_offline",
  "data": {
    "userId": "user-789-012",
    "lastSeen": "2024-01-15T10:45:00Z"
  }
}
```

### **5. Message Search**

#### **5.1 Search Messages**
- **Endpoint**: `GET /api/v1/messages/search`
- **Authentication**: Required
- **Query Parameters**:
  - `q`: Search query
  - `conversationId`: Search within specific conversation
  - `senderId`: Messages from specific sender
  - `messageType`: Filter by message type
  - `dateFrom`: Messages from date
  - `dateTo`: Messages to date
  - `page`: Page number
  - `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "message": {
          "id": "msg-123-456",
          "content": "I'm interested in the frontend developer position",
          "senderId": "user-789-012",
          "timestamp": "2024-01-15T10:30:00Z"
        },
        "conversation": {
          "id": "conv-123-456",
          "participants": [
            {
              "id": "user-123-456",
              "name": "Jane Smith"
            }
          ]
        },
        "highlights": [
          "I'm interested in the <mark>frontend developer</mark> position"
        ]
      }
    ]
  }
}
```

### **6. Conversation Settings**

#### **6.1 Update Conversation Settings**
- **Endpoint**: `PUT /api/v1/messages/conversations/{conversationId}/settings`
- **Authentication**: Required

**Request Body:**
```json
{
  "isMuted": true,
  "isArchived": false,
  "notificationSettings": {
    "email": false,
    "push": true,
    "desktop": true
  }
}
```

#### **6.2 Mark Messages as Read**
- **Endpoint**: `PUT /api/v1/messages/conversations/{conversationId}/read`
- **Authentication**: Required

**Request Body:**
```json
{
  "lastReadMessageId": "msg-789-012-345"
}
```

## 🗄️ **Database Schema**

### **Core Tables**
```sql
-- Conversations
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
    subject VARCHAR(255),
    created_by UUID NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_message_id UUID,
    last_message_at TIMESTAMP WITH TIME ZONE,
    message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversation Participants
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    last_read_message_id UUID,
    last_read_at TIMESTAMP WITH TIME ZONE,
    notification_settings JSONB DEFAULT '{"email": true, "push": true, "desktop": true}',
    is_muted BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    UNIQUE(conversation_id, user_id)
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    parent_message_id UUID REFERENCES messages(id),
    content TEXT,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system')),
    metadata JSONB,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Message Attachments
CREATE TABLE message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    is_scanned BOOLEAN DEFAULT FALSE,
    scan_result VARCHAR(50),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Message Reactions
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id, emoji)
);

-- Message Read Status
CREATE TABLE message_read_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, user_id)
);
```

## 🔄 **Event Publishing**

### **Events Published to Kafka**
```yaml
Topic: messaging.events

Event Types:
- conversation.created
- conversation.updated
- message.sent
- message.edited
- message.deleted
- message.read
- file.uploaded
- user.typing_start
- user.typing_stop
- user.online
- user.offline
```

### **Event Schema Example**
```json
{
  "eventId": "evt_msg_001",
  "eventType": "message.sent",
  "eventVersion": "1.0",
  "aggregateId": "conv-123-456",
  "aggregateType": "Conversation",
  "correlationId": "corr_msg_001",
  "userId": "user-789-012",
  "timestamp": "2024-01-15T10:30:00.123Z",
  "source": "messaging-service",
  "data": {
    "conversationId": "conv-123-456",
    "messageId": "msg-789-012",
    "senderId": "user-789-012",
    "recipientIds": ["user-123-456"],
    "messageType": "text",
    "hasAttachment": false
  }
}
```

## 🔧 **Technical Specifications**

### **Technology Stack**
- **Framework**: Spring Boot 3.x with WebSocket support
- **Language**: Java 17+
- **Database**: PostgreSQL 15+
- **Real-time**: WebSocket with STOMP protocol
- **Cache**: Redis for online status and message cache
- **Message Queue**: Apache Kafka for event publishing
- **File Storage**: AWS S3 or MinIO for attachments

### **Performance Requirements**
- Message delivery: < 100ms (real-time)
- Message history loading: < 300ms
- File upload: < 5s for files up to 25MB
- Search queries: < 500ms
- WebSocket connection establishment: < 200ms

### **Security Requirements**
- End-to-end message validation
- File virus scanning
- Rate limiting on message sending
- Conversation participant verification
- Attachment access control
- Message content moderation

### **Scalability Considerations**
- WebSocket connection pooling
- Message partitioning by conversation
- Redis clustering for online status
- CDN for file attachments
- Database read replicas for message history

This Messaging Service PRD provides comprehensive specifications for implementing real-time communication, file sharing, and conversation management capabilities.