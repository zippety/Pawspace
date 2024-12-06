# PawSpace Deployment Guide

## Overview
PawSpace is deployed on Vercel with automatic deployments configured from the main branch.

## Live Application
- **Production URL**: [https://pawspace-gwdnvx0q4-duanebromfield-gmailcoms-projects.vercel.app](https://pawspace-gwdnvx0q4-duanebromfield-gmailcoms-projects.vercel.app)

## Deployment Configuration

### Environment Variables
Required environment variables for deployment:
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key
VITE_API_BASE_URL=your_api_url
```

### Build Configuration
```json
{
  "build": {
    "env": {
      "SKIP_TYPESCRIPT_CHECK": "1"
    }
  }
}
```

### Build Commands
```bash
npm run build     # Production build
npm run preview   # Local preview
```

## Deployment Process

### Automatic Deployments
1. Push changes to main branch
2. Vercel automatically triggers build
3. Build and tests run
4. If successful, changes are deployed

### Manual Deployments
```bash
vercel            # Deploy to preview
vercel --prod     # Deploy to production
```

## Monitoring and Maintenance

### Error Tracking
- Sentry integration for error monitoring
- Performance tracking
- User session replay

### Health Checks
- Automatic health checks
- Uptime monitoring
- Performance metrics

## Rollback Procedures
1. Access Vercel dashboard
2. Select deployment history
3. Choose previous working deployment
4. Click "Promote to Production"

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check TypeScript errors
   - Verify environment variables
   - Review build logs

2. **Runtime Errors**
   - Check Sentry dashboard
   - Review application logs
   - Verify API connections

### Support Contacts
- Development Team
- Vercel Support
- Repository Maintainers
