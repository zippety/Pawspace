# PawSpaces Best Practices Guide

## Table of Contents
- [Code Organization](#code-organization)
- [TypeScript Best Practices](#typescript-best-practices)
- [React Best Practices](#react-best-practices)
- [State Management](#state-management)
- [Performance Optimization](#performance-optimization)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Documentation](#documentation)
- [Security](#security)

## Code Organization

### Directory Structure
```
src/
├── components/          # React components
│   ├── common/         # Shared components
│   ├── features/       # Feature-specific components
│   └── layouts/        # Layout components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript types
├── store/              # State management
│   ├── slices/         # Store slices
│   └── middleware/     # Custom middleware
├── services/           # API and external services
├── assets/             # Static assets
└── config/             # Configuration files
```

### Naming Conventions
- **Files**: Use PascalCase for components, camelCase for utilities
  ```
  components/PropertyCard.tsx
  utils/formatDate.ts
  ```
- **Components**: Use PascalCase
  ```typescript
  export const PropertyCard: React.FC<PropertyCardProps> = () => { ... }
  ```
- **Hooks**: Prefix with 'use'
  ```typescript
  export const usePropertySearch = () => { ... }
  ```
- **Types/Interfaces**: Use PascalCase, suffix interfaces with props/state
  ```typescript
  interface PropertyCardProps { ... }
  type SearchFilters = { ... }
  ```

## TypeScript Best Practices

### Type Safety
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}

// ❌ Avoid
const user: any = { ... }
```

### Strict Mode
Enable strict mode in tsconfig.json:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Type Inference
```typescript
// ✅ Good - Let TypeScript infer types when obvious
const [isLoading, setIsLoading] = useState(false);

// ❌ Avoid - Unnecessary type annotation
const [isLoading, setIsLoading] = useState<boolean>(false);
```

## React Best Practices

### Functional Components
```typescript
// ✅ Good
const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  return ( ... );
};

// ❌ Avoid
class PropertyCard extends React.Component { ... }
```

### Custom Hooks
Extract reusable logic into custom hooks:
```typescript
// ✅ Good
const usePropertySearch = (initialFilters: SearchFilters) => {
  const [filters, setFilters] = useState(initialFilters);
  // ... more logic
  return { filters, setFilters, results };
};

// Usage
const { filters, results } = usePropertySearch(initialFilters);
```

### Memoization
```typescript
// ✅ Good - Memoize expensive calculations
const memoizedValue = useMemo(() => computeExpensiveValue(deps), [deps]);

// ✅ Good - Memoize callbacks passed as props
const handleClick = useCallback(() => {
  // handle click
}, [deps]);
```

## State Management

### Zustand Best Practices
```typescript
// ✅ Good - Organize store by features
interface PropertyStore {
  properties: Property[];
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  fetchProperties: () => Promise<void>;
}

const usePropertyStore = create<PropertyStore>((set) => ({
  properties: [],
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  fetchProperties: async () => {
    const properties = await api.fetchProperties();
    set({ properties });
  }
}));
```

### State Organization
```typescript
// ✅ Good - Split stores by domain
const useAuthStore = create<AuthStore>( ... );
const usePropertyStore = create<PropertyStore>( ... );
const useBookingStore = create<BookingStore>( ... );
```

## Performance Optimization

### Code Splitting
```typescript
// ✅ Good - Lazy load routes
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));

// ✅ Good - Lazy load heavy components
const MapView = lazy(() => import('./components/MapView'));
```

### Image Optimization
```typescript
// ✅ Good - Use next/image or optimized image components
import { Image } from '@/components/common/Image';

const PropertyImage: React.FC<ImageProps> = ({ src, alt }) => (
  <Image
    src={src}
    alt={alt}
    loading="lazy"
    sizes="(max-width: 768px) 100vw, 50vw"
  />
);
```

## Error Handling

### Error Boundaries
```typescript
// ✅ Good - Use error boundaries for component errors
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <ErrorFallback />;
  }

  return children;
};
```

### API Error Handling
```typescript
// ✅ Good - Consistent error handling
const fetchData = async () => {
  try {
    const data = await api.fetch();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      handleApiError(error);
    } else {
      handleUnexpectedError(error);
    }
  }
};
```

## Testing

### Component Testing
```typescript
// ✅ Good - Test component behavior
describe('PropertyCard', () => {
  it('should display property information', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
  });

  it('should handle selection', () => {
    const onSelect = jest.fn();
    render(<PropertyCard property={mockProperty} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(mockProperty.id);
  });
});
```

### Hook Testing
```typescript
// ✅ Good - Test custom hooks
describe('usePropertySearch', () => {
  it('should update filters', () => {
    const { result } = renderHook(() => usePropertySearch());
    act(() => {
      result.current.setFilters(mockFilters);
    });
    expect(result.current.filters).toEqual(mockFilters);
  });
});
```

## Documentation

### Component Documentation
```typescript
/**
 * PropertyCard displays a property listing with image, title, and basic information
 *
 * @param property - Property information to display
 * @param onSelect - Callback when property is selected
 * @param variant - Display variant (default: 'standard')
 *
 * @example
 * ```tsx
 * <PropertyCard
 *   property={propertyData}
 *   onSelect={handleSelect}
 *   variant="compact"
 * />
 * ```
 */
export const PropertyCard: React.FC<PropertyCardProps> = ...
```

### API Documentation
```typescript
/**
 * Fetches properties based on search filters
 *
 * @param filters - Search filters to apply
 * @returns Promise resolving to array of properties
 * @throws {ApiError} When API request fails
 *
 * @example
 * ```typescript
 * const properties = await fetchProperties({
 *   location: 'Toronto',
 *   priceRange: { min: 0, max: 1000 }
 * });
 * ```
 */
export const fetchProperties = async (filters: SearchFilters): Promise<Property[]> => ...
```

## Security

### Input Validation
```typescript
// ✅ Good - Validate user input
const validatePropertyData = (data: unknown): PropertyData => {
  const schema = z.object({
    title: z.string().min(1).max(100),
    price: z.number().positive(),
    location: z.string(),
    // ... more validation
  });

  return schema.parse(data);
};
```

### Authentication
```typescript
// ✅ Good - Protect routes and data
const ProtectedRoute: React.FC = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
```

### Data Sanitization
```typescript
// ✅ Good - Sanitize user-generated content
const sanitizeHtml = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: ['href', 'title']
  });
};
```

## Implementation Checklist

When implementing new features or making changes:

1. **Code Quality**
   - [ ] Follow naming conventions
   - [ ] Use TypeScript properly
   - [ ] Implement error handling
   - [ ] Add appropriate tests
   - [ ] Document the code

2. **Performance**
   - [ ] Optimize bundle size
   - [ ] Implement lazy loading where appropriate
   - [ ] Use memoization for expensive operations
   - [ ] Optimize images and assets

3. **Security**
   - [ ] Validate all inputs
   - [ ] Sanitize user-generated content
   - [ ] Implement proper authentication
   - [ ] Handle sensitive data appropriately

4. **Maintenance**
   - [ ] Update documentation
   - [ ] Add/update tests
   - [ ] Review error handling
   - [ ] Check performance impact
