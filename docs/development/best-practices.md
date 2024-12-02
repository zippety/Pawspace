# Development Best Practices

## Code Organization

### Project Structure
```
pawspace/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── services/      # API services
│   ├── types/         # TypeScript types
│   ├── styles/        # Global styles
│   └── context/       # React context
├── server/
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── middleware/    # Custom middleware
└── public/            # Static assets
```

### Naming Conventions

#### Files and Directories
- React Components: PascalCase (e.g., `Button.tsx`, `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`, `validateInput.ts`)
- Test files: `*.test.ts` or `*.spec.ts`
- Style files: Same name as component with `.styles.ts` suffix

#### Code Elements
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase with prefix (e.g., `IUser`, `TProps`)
- CSS Classes: kebab-case

## React Best Practices

### Component Structure
```tsx
import React from 'react';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

interface Props {
  title: string;
  onAction: () => void;
}

export const MyComponent: FC<Props> = ({ title, onAction }) => {
  // State hooks at the top
  const [isOpen, setIsOpen] = useState(false);

  // Event handlers using useCallback
  const handleClick = useCallback(() => {
    setIsOpen(prev => !prev);
    onAction();
  }, [onAction]);

  // Early returns for conditional rendering
  if (!title) return null;

  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleClick}>
        {isOpen ? 'Close' : 'Open'}
      </button>
    </div>
  );
};
```

### Custom Hooks
```tsx
const useSpaceSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchSpaces = async () => {
      setLoading(true);
      try {
        const data = await api.searchSpaces(query);
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (query) searchSpaces();
  }, [query]);

  return { query, setQuery, results, loading };
};
```

## TypeScript Guidelines

### Type Definitions
```typescript
// Use interfaces for objects
interface User {
  id: string;
  name: string;
  email: string;
  role: 'host' | 'guest' | 'admin';
}

// Use type for unions/intersections
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// Use generics for reusable types
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};
```

### Type Safety
```typescript
// Use type guards
function isUser(obj: any): obj is User {
  return 'id' in obj && 'email' in obj;
}

// Use assertion functions
function assertIsUser(obj: any): asserts obj is User {
  if (!isUser(obj)) {
    throw new Error('Not a user');
  }
}
```

## Testing Guidelines

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### API Testing
```typescript
import request from 'supertest';
import { app } from '../app';

describe('Space API', () => {
  it('returns spaces list', async () => {
    const response = await request(app)
      .get('/api/spaces')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## Performance Optimization

### React Performance
1. Use React.memo for expensive components
2. Implement virtualization for long lists
3. Lazy load components and routes
4. Use proper key props in lists
5. Optimize images and assets

### Code Splitting
```typescript
// Lazy load components
const SpaceDetails = lazy(() => import('./SpaceDetails'));

// Use Suspense
<Suspense fallback={<Spinner />}>
  <SpaceDetails id={spaceId} />
</Suspense>
```

### Caching Strategy
```typescript
// Use React Query for data caching
const { data, isLoading } = useQuery(
  ['space', id],
  () => fetchSpace(id),
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  }
);
```

## Error Handling

### Frontend Errors
```typescript
// Global error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logError(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### API Errors
```typescript
// Error handling middleware
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }

  res.status(500).json({
    error: 'Internal Server Error'
  });
};
```

## Security Practices

1. Input Validation
```typescript
// Use Zod for runtime validation
const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

2. XSS Prevention
```typescript
// Sanitize HTML content
import DOMPurify from 'dompurify';

const sanitizeHtml = (dirty: string) => {
  return DOMPurify.sanitize(dirty);
};
```

3. CSRF Protection
```typescript
// Use CSRF tokens
app.use(csrf());
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
```

## Git Workflow

### Commit Messages
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

### Branch Strategy
- main: Production code
- develop: Development code
- feature/*: New features
- bugfix/*: Bug fixes
- release/*: Release preparation
