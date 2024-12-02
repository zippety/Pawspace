# 🚀 PawSpace API Documentation

## Overview

PawSpace's API follows RESTful principles and uses JSON for request/response bodies. All endpoints are prefixed with `/api`.

### Base URL
```
Development: http://localhost:3001/api
Production: https://api.pawspace.com/api
```

### Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Error Handling
All endpoints follow this error format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // Optional additional information
  }
}
```

Common error codes:
- `AUTH_REQUIRED`: Authentication required
- `INVALID_INPUT`: Invalid request parameters
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error

## 🔑 Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

**Response** `200 OK`
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
```

**Errors**
- `400 Bad Request`: Invalid input or email already exists
- `500 Internal Server Error`: Server error

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Response** `200 OK`
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string"
  },
  "token": "string"
}
```

**Errors**
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

## 🏠 Spaces

### List Spaces
```http
GET /api/spaces
Query Parameters:
  type: string (optional) - Filter by space type
  location: string (optional) - Filter by location
  minRating: number (optional) - Minimum rating
  maxPrice: number (optional) - Maximum price
  page: number (optional) - Page number (default: 1)
  limit: number (optional) - Items per page (default: 10)
```

**Response** `200 OK`
```json
{
  "spaces": [{
    "id": "string",
    "name": "string",
    "description": "string",
    "type": "PARK | CAFE | TRAIL | BEACH | INDOOR | AGILITY",
    "location": {
      "address": "string",
      "coordinates": {
        "lat": number,
        "lng": number
      }
    },
    "rating": number,
    "price": number,
    "amenities": string[],
    "images": string[]
  }],
  "pagination": {
    "total": number,
    "page": number,
    "pages": number,
    "limit": number
  }
}
```

### Get Space Details
```http
GET /api/spaces/:id
```

**Response** `200 OK`
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "type": "PARK | CAFE | TRAIL | BEACH | INDOOR | AGILITY",
  "location": {
    "address": "string",
    "coordinates": {
      "lat": number,
      "lng": number
    }
  },
  "rating": number,
  "price": number,
  "amenities": string[],
  "images": string[],
  "reviews": [{
    "id": "string",
    "userId": "string",
    "rating": number,
    "comment": "string",
    "createdAt": "string"
  }]
}
```

## 👤 User Management

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

**Response** `200 OK`
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "bio": "string",
  "preferences": {
    "notificationsEnabled": boolean,
    "favoriteSpaceTypes": string[]
  }
}
```

### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "bio": "string"
}
```

**Response** `200 OK`
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "bio": "string"
}
```

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- Authentication endpoints: 5 requests per minute
- Other endpoints: 60 requests per minute per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1619083200
```

## Webhooks

PawSpace supports webhooks for real-time updates. Configure webhooks in your dashboard to receive events for:
- New bookings
- Booking status changes
- User reviews
- Space updates

### Webhook Format
```json
{
  "event": "string",
  "timestamp": "string",
  "data": {}
}
```

## SDK & Examples

Check our [GitHub repository](https://github.com/pawspace/pawspace-sdk) for:
- Official SDK
- Code examples
- Integration guides
- Postman collection
