# PawSpace API Documentation

## Overview
This document outlines the API endpoints and data structures used in PawSpace.

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header.

## Endpoints

### Properties

#### GET /api/properties
List all properties with optional filtering.

**Query Parameters:**
- `location`: string (optional)
- `minPrice`: number (optional)
- `maxPrice`: number (optional)
- `amenities`: string[] (optional)

**Response:**
```typescript
{
  properties: {
    id: string;
    title: string;
    description: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    price: number;
    amenities: string[];
    images: string[];
    hostId: string;
  }[];
  total: number;
}
```

#### POST /api/properties
Create a new property listing.

**Request Body:**
```typescript
{
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  price: number;
  amenities: string[];
  images: string[];
}
```

### Users

#### POST /api/users/register
Register a new user.

**Request Body:**
```typescript
{
  email: string;
  password: string;
  name: string;
}
```

#### POST /api/users/login
Authenticate a user.

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

### Bookings

#### POST /api/bookings
Create a new booking.

**Request Body:**
```typescript
{
  propertyId: string;
  startDate: string;
  endDate: string;
  guests: number;
}
```

## Error Handling
All endpoints return standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include:
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Data Models

### Property
```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  location: Location;
  price: number;
  amenities: string[];
  images: string[];
  hostId: string;
  createdAt: string;
  updatedAt: string;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'host' | 'admin';
  createdAt: string;
}
```

### Booking
```typescript
interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  startDate: string;
  endDate: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
```
