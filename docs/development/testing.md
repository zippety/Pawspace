# 🧪 PawSpace Testing Guide

## Overview

This guide outlines testing practices for the PawSpace application. We use a combination of unit tests, integration tests, and end-to-end tests to ensure code quality and reliability.

## Testing Stack

- **Unit Testing**: Jest + React Testing Library
- **Integration Testing**: Jest + Supertest
- **E2E Testing**: Cypress
- **API Testing**: Postman/Newman

## Test Structure

```
src/
  __tests__/           # Jest test files
    components/        # Component tests
    hooks/            # Custom hook tests
    utils/            # Utility function tests
  cypress/            # Cypress E2E tests
    e2e/             # Test specs
    fixtures/         # Test data
    support/         # Support files
```

## Running Tests

```bash
# Run unit and integration tests
npm test

# Run tests in watch mode
npm test:watch

# Run E2E tests
npm run cypress

# Generate coverage report
npm test:coverage
```

## Writing Tests

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SpaceCard } from '../components/SpaceCard';

describe('SpaceCard', () => {
  const mockProps = {
    title: 'Test Space',
    description: 'Test Description',
    price: 100,
    imageUrl: '/test.jpg',
    location: 'Test Location'
  };

  it('renders space information correctly', () => {
    render(<SpaceCard {...mockProps} />);

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProps.price}/visit`)).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(<SpaceCard {...mockProps} onSelect={onSelect} />);

    fireEvent.click(screen.getByTestId('space-card'));
    expect(onSelect).toHaveBeenCalled();
  });
});
```

### Hook Tests

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useLocationsStore } from '../store/locationsStore';

describe('useLocationsStore', () => {
  it('updates filters correctly', () => {
    const { result } = renderHook(() => useLocationsStore());

    act(() => {
      result.current.updateFilters({ searchQuery: 'park' });
    });

    expect(result.current.filters.searchQuery).toBe('park');
  });
});
```

### API Tests

```typescript
import request from 'supertest';
import { app } from '../server/app';

describe('Spaces API', () => {
  it('returns spaces filtered by type', async () => {
    const response = await request(app)
      .get('/api/spaces')
      .query({ type: 'PARK' });

    expect(response.status).toBe(200);
    expect(response.body.spaces).toBeInstanceOf(Array);
    expect(response.body.spaces[0].type).toBe('PARK');
  });
});
```

## Test Coverage Requirements

- Components: 90% coverage
- Hooks: 95% coverage
- Utils: 100% coverage
- API Routes: 90% coverage

## Best Practices

1. **Naming Conventions**
   ```typescript
   // Component test file
   Component.test.tsx

   // Test description
   describe('ComponentName', () => {
     it('should [expected behavior] when [condition]', () => {
       // test code
     });
   });
   ```

2. **Arrange-Act-Assert Pattern**
   ```typescript
   it('updates user profile', async () => {
     // Arrange
     const userData = { name: 'Test User' };

     // Act
     const response = await updateProfile(userData);

     // Assert
     expect(response.status).toBe(200);
   });
   ```

3. **Mock External Dependencies**
   ```typescript
   jest.mock('../api/spaces', () => ({
     fetchSpaces: jest.fn().mockResolvedValue([
       { id: 1, name: 'Test Space' }
     ])
   }));
   ```

4. **Test Edge Cases**
   - Empty states
   - Loading states
   - Error states
   - Boundary conditions

5. **Snapshot Testing**
   ```typescript
   it('matches snapshot', () => {
     const { container } = render(<Component />);
     expect(container).toMatchSnapshot();
   });
   ```

## Common Testing Scenarios

### 1. Form Testing
```typescript
it('submits form with valid data', async () => {
  render(<LoginForm />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

### 2. Async Operations
```typescript
it('loads spaces data', async () => {
  render(<SpacesList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByTestId('space-card')).toHaveLength(3);
  });
});
```

### 3. User Interactions
```typescript
it('filters spaces by type', async () => {
  render(<SpacesFilter />);

  fireEvent.click(screen.getByRole('button', { name: /park/i }));

  await waitFor(() => {
    const spaces = screen.getAllByTestId('space-card');
    spaces.forEach(space => {
      expect(space).toHaveTextContent(/park/i);
    });
  });
});
```

## Debugging Tests

1. **Debug Element**
   ```typescript
   screen.debug(element);
   ```

2. **Debug Async Issues**
   ```typescript
   jest.useFakeTimers();
   jest.runAllTimers();
   ```

3. **Test Environment Variables**
   ```typescript
   beforeAll(() => {
     process.env.NODE_ENV = 'test';
   });
   ```

## CI/CD Integration

Tests are automatically run in the CI pipeline:
1. Unit/Integration tests on pull requests
2. E2E tests on staging deployment
3. Coverage reports uploaded to CodeCov

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
