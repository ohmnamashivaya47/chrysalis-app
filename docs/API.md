# Chrysalis API Documentation

## Overview

The Chrysalis meditation app uses a RESTful API with the following base structure:

```
/api/v1/
├── auth/           # Authentication endpoints
├── users/          # User management
├── meditations/    # Meditation sessions and content
├── social/         # Social features (posts, follows, etc.)
├── leaderboard/    # Gamification and achievements
├── qr/             # QR code generation and sharing
└── notifications/  # Push notifications
```

## Authentication

### POST /api/v1/auth/register

Register a new user account.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "meditation_user",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "meditation_user",
      "emailVerified": false
    },
    "token": "jwt_token_here"
  }
}
```

### POST /api/v1/auth/login

Authenticate an existing user.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "meditation_user",
      "profile": { ... }
    },
    "token": "jwt_token_here"
  }
}
```

### POST /api/v1/auth/verify-email

Verify user email address.

**Request:**

```json
{
  "token": "verification_token"
}
```

### POST /api/v1/auth/forgot-password

Request password reset.

**Request:**

```json
{
  "email": "user@example.com"
}
```

### POST /api/v1/auth/reset-password

Reset password with token.

**Request:**

```json
{
  "token": "reset_token",
  "password": "new_password"
}
```

## Users

### GET /api/v1/users/profile

Get current user profile.

**Headers:**

```
Authorization: Bearer jwt_token
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "meditation_user",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://...",
      "bio": "Meditation enthusiast",
      "preferences": {
        "defaultMeditationDuration": 20,
        "favoriteTypes": ["mindfulness", "breathwork"],
        "reminderTime": "08:00"
      },
      "stats": {
        "totalSessions": 45,
        "totalMinutes": 900,
        "currentStreak": 7,
        "longestStreak": 21
      }
    }
  }
}
```

### PUT /api/v1/users/profile

Update user profile.

**Request:**

```json
{
  "firstName": "Jane",
  "bio": "Updated bio",
  "preferences": {
    "defaultMeditationDuration": 30
  }
}
```

## Meditations

### GET /api/v1/meditations

Get available meditation content.

**Query Parameters:**

- `type`: Filter by meditation type (mindfulness, breathwork, etc.)
- `duration`: Filter by duration
- `difficulty`: Filter by difficulty level
- `page`: Page number for pagination
- `limit`: Items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "meditation_123",
        "title": "Morning Mindfulness",
        "description": "Start your day with clarity",
        "type": "mindfulness",
        "duration": 1200,
        "difficulty": "beginner",
        "audioUrl": "https://...",
        "instructor": "Sarah Johnson",
        "tags": ["morning", "mindfulness", "beginner"]
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

### POST /api/v1/meditations/sessions

Start a new meditation session.

**Request:**

```json
{
  "meditationId": "meditation_123",
  "settings": {
    "duration": 1200,
    "backgroundSound": "rain",
    "guidanceVolume": 0.7,
    "backgroundVolume": 0.3
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "session_456",
    "startTime": "2024-01-15T08:00:00Z",
    "settings": { ... }
  }
}
```

### PUT /api/v1/meditations/sessions/:sessionId

Update session progress or complete session.

**Request:**

```json
{
  "progress": {
    "currentTime": 600,
    "completed": false
  },
  "analytics": {
    "heartRate": [65, 67, 64],
    "focusLevel": 0.8
  }
}
```

## Social Features

### GET /api/v1/social/feed

Get social feed posts.

**Query Parameters:**

- `page`: Page number
- `limit`: Posts per page
- `type`: Filter by post type (all, following, discover)

**Response:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "post_123",
        "userId": "user_456",
        "user": {
          "username": "sarah_meditates",
          "avatar": "https://..."
        },
        "content": "Just completed a 30-minute session!",
        "type": "session_completion",
        "sessionData": {
          "duration": 1800,
          "type": "mindfulness"
        },
        "likes": 12,
        "comments": 3,
        "createdAt": "2024-01-15T10:30:00Z",
        "hasLiked": false
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### POST /api/v1/social/posts

Create a new post.

**Request:**

```json
{
  "content": "Amazing meditation session today!",
  "type": "text",
  "sessionId": "session_123", // optional
  "imageUrl": "https://..." // optional
}
```

### POST /api/v1/social/posts/:postId/like

Like/unlike a post.

### GET /api/v1/social/posts/:postId/comments

Get comments for a post.

### POST /api/v1/social/posts/:postId/comments

Add a comment to a post.

**Request:**

```json
{
  "content": "Great session! Keep it up!"
}
```

### POST /api/v1/social/users/:userId/follow

Follow/unfollow a user.

### GET /api/v1/social/users/:userId/followers

Get user followers.

### GET /api/v1/social/users/:userId/following

Get users that a user is following.

## Leaderboard & Gamification

### GET /api/v1/leaderboard

Get leaderboard data.

**Query Parameters:**

- `type`: Type of leaderboard (weekly, monthly, allTime)
- `category`: Category (totalMinutes, streakDays, sessionsCount)
- `limit`: Number of entries to return

**Response:**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "id": "user_123",
          "username": "zen_master",
          "avatar": "https://..."
        },
        "score": 5000,
        "value": "83h 20m",
        "badge": "meditation_master"
      }
    ],
    "userRank": {
      "rank": 42,
      "score": 1200,
      "value": "20h 15m"
    },
    "period": "monthly"
  }
}
```

### GET /api/v1/leaderboard/achievements

Get user achievements.

**Response:**

```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "id": "first_session",
        "title": "First Steps",
        "description": "Complete your first meditation session",
        "icon": "",
        "unlockedAt": "2024-01-10T09:00:00Z",
        "rarity": "common"
      }
    ],
    "progress": [
      {
        "id": "streak_7",
        "title": "Week Warrior",
        "description": "Meditate 7 days in a row",
        "progress": 5,
        "target": 7,
        "icon": ""
      }
    ]
  }
}
```

## QR Code System

### GET /api/v1/qr/user/:userId

Get QR code for user profile.

### GET /api/v1/qr/group/:groupId

Get QR code for meditation group.

### POST /api/v1/qr/scan

Process scanned QR code.

**Request:**

```json
{
  "code": "qr_code_data",
  "type": "user" // or "group"
}
```

## Notifications

### GET /api/v1/notifications

Get user notifications.

**Response:**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123",
        "type": "achievement",
        "title": "New Achievement Unlocked!",
        "message": "You've completed 10 meditation sessions",
        "data": {
          "achievementId": "sessions_10"
        },
        "read": false,
        "createdAt": "2024-01-15T12:00:00Z"
      }
    ],
    "unreadCount": 3
  }
}
```

### POST /api/v1/notifications/subscribe

Subscribe to push notifications.

**Request:**

```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
      "p256dh": "key_data",
      "auth": "auth_data"
    }
  }
}
```

### PUT /api/v1/notifications/:notificationId/read

Mark notification as read.

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required or invalid
- `FORBIDDEN`: User lacks permission for action
- `NOT_FOUND`: Requested resource not found
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

API endpoints are rate limited:

- Authentication endpoints: 5 requests per minute
- Read operations: 100 requests per minute
- Write operations: 20 requests per minute
- File uploads: 5 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642234800
```
