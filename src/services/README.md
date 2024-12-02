# Services Directory

This directory contains all API and external service integrations:

## Structure
```
services/
  ├── api/           # API client and endpoints
  │   ├── properties.ts
  │   ├── bookings.ts
  │   └── reviews.ts
  ├── maps/          # Map service integrations
  ├── auth/          # Authentication service
  └── payment/       # Payment service integration
```

Each service should:
- Be isolated and maintainable
- Have proper error handling
- Include TypeScript types
- Include unit tests
