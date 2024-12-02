# Frontend Documentation

## Overview
The frontend of Pawspace is built with React and TypeScript, using Vite as the build tool. It provides a modern interface for visualizing and analyzing Sniffspot data.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm run serve  # To preview the build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Basic components (buttons, inputs, etc.)
│   └── layout/         # Layout components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
│   ├── api/           # API communication
│   └── helpers/       # Helper functions
├── styles/             # Global styles and themes
└── types/              # TypeScript type definitions
```

## Key Features

### Error Handling
We use a combination of React Error Boundaries and Sentry for comprehensive error tracking:
- `ErrorBoundary`: Catches and handles React component errors
- `Sentry`: Tracks and reports runtime errors

### State Management
- React Context for global state
- React Query for server state management

### Styling
- Tailwind CSS for utility-first styling
- CSS modules for component-specific styles

## Testing
```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

## Code Style
We use ESLint and Prettier for code formatting:
```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

## Deployment
The frontend is deployed using Vercel:
1. Push changes to the main branch
2. Vercel automatically builds and deploys

## Common Issues
- **Build Errors**: Check the TypeScript errors in the console
- **Styling Issues**: Make sure Tailwind classes are correct
- **API Errors**: Verify API endpoints in the environment variables
