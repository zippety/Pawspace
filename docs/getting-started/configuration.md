# Configuration Guide

This guide explains how to configure PawSpace for different environments and use cases.

## Environment Variables

PawSpace uses environment variables for configuration. Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pawspace

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRY=24h

# External Services
GOOGLE_MAPS_API_KEY=your-google-maps-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

## Configuration Options

### Database Configuration

MongoDB connection options:
```javascript
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}
```

### Server Settings

- **PORT**: Default is 3000
- **NODE_ENV**: 'development', 'production', or 'test'
- **CORS_ORIGIN**: Allowed origins for CORS

### Authentication

- **JWT_SECRET**: Secret key for JWT tokens
- **JWT_EXPIRY**: Token expiration time
- **PASSWORD_SALT_ROUNDS**: Number of salt rounds for password hashing

### File Upload Settings

- **MAX_FILE_SIZE**: Maximum file size in bytes
- **ALLOWED_FILE_TYPES**: Comma-separated list of allowed MIME types
- **UPLOAD_DIRECTORY**: Directory for file uploads

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
DEBUG=pawspace:*
```

### Production
```bash
NODE_ENV=production
DEBUG=pawspace:error
```

### Testing
```bash
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/pawspace_test
```

## Security Best Practices

1. Never commit `.env` files
2. Use strong, unique secrets
3. Rotate API keys regularly
4. Implement rate limiting
5. Enable security headers

## Logging Configuration

```javascript
{
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
}
```

## Next Steps

- [Development Setup](../development/setup.md)
- [API Documentation](../api/overview.md)
- [Security Guide](../development/security.md)
