# PawSpace API Overview

Welcome to the PawSpace API documentation. This guide provides comprehensive information about our RESTful API endpoints, authentication, and usage examples.

## Base URL

```
Production: https://api.pawspace.com/v1
Development: http://localhost:3000/v1
```

## Authentication

PawSpace uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}
```

## API Endpoints

### Spaces

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/spaces` | List all spaces |
| GET | `/spaces/:id` | Get space details |
| POST | `/spaces` | Create new space |
| PUT | `/spaces/:id` | Update space |
| DELETE | `/spaces/:id` | Delete space |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bookings` | List user's bookings |
| POST | `/bookings` | Create booking |
| GET | `/bookings/:id` | Get booking details |
| PUT | `/bookings/:id` | Update booking |
| DELETE | `/bookings/:id` | Cancel booking |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user |
| PUT | `/users/me` | Update profile |
| GET | `/users/:id` | Get user details |
| POST | `/users` | Create user |

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid input parameters",
    "details": {
      // Error details
    }
  }
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per API key
- Status code 429 when exceeded

## Pagination

Use query parameters for pagination:
```
GET /spaces?page=1&limit=10
```

Response includes metadata:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Filtering

Use query parameters for filtering:
```
GET /spaces?city=NewYork&minPrice=50&maxPrice=200
```

## Sorting

Use `sort` parameter:
```
GET /spaces?sort=price:asc,rating:desc
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Server Error |

## SDK Examples

### JavaScript
```javascript
const PawSpace = require('pawspace-sdk');
const client = new PawSpace('your_api_key');

// List spaces
const spaces = await client.spaces.list({
  city: 'New York',
  limit: 10
});
```

### Python
```python
from pawspace import PawSpace
client = PawSpace('your_api_key')

# List spaces
spaces = client.spaces.list(
    city='New York',
    limit=10
)
```

## Webhooks

Subscribe to events:
```http
POST /webhooks
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "events": ["booking.created", "booking.updated"]
}
```

## Related Documentation

- [Authentication Guide](authentication.md)
- [Endpoints Reference](endpoints.md)
- [Database Schema](database-schema.md)
- [Development Setup](../development/setup.md)
