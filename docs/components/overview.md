# 🎨 PawSpace Component Documentation

## 📚 Component Categories

### 🛠️ Core UI Components (`/src/components/ui/core`)
Base-level components that form the foundation of our UI:

#### Button
```typescript
import { Button } from '@/components/ui/core';

// Variants
<Button variant="default">Default Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

// Sizes
<Button size="sm">Small Button</Button>
<Button size="default">Default Button</Button>
<Button size="lg">Large Button</Button>
<Button size="icon">Icon Button</Button>

// States
<Button loading>Loading Button</Button>
<Button disabled>Disabled Button</Button>

// With Icons
<Button leftIcon={<Icon />}>Left Icon</Button>
<Button rightIcon={<Icon />}>Right Icon</Button>
```

#### Input
```typescript
import { Input } from '@/components/ui/core';

// Basic Usage
<Input label="Username" placeholder="Enter username" />

// Variants
<Input variant="default" />
<Input variant="error" error="This field is required" />
<Input variant="success" />

// Sizes
<Input size="sm" />
<Input size="default" />
<Input size="lg" />

// With Icons
<Input leftIcon={<SearchIcon />} />
<Input rightIcon={<CheckIcon />} />
```

### 🏠 Feature Components (`/src/components/feature`)

#### UserDashboard
The user dashboard consists of several components:

1. **UserDashboard**: Main container component
   - Manages tab navigation
   - Handles component mounting/unmounting
   - Provides context for child components

2. **BookingHistory**: Displays user's booking history
   - Filterable by status (upcoming, completed, cancelled)
   - Supports booking cancellation
   - Pagination for large lists

3. **UserProfile**: Manages user information
   - Form for updating personal details
   - Avatar upload functionality
   - Password change option

4. **UserPreferences**: Handles user preferences
   - Search radius settings
   - Price range preferences
   - Amenity preferences
   - Dog profile management

5. **SavedSpaces**: Shows saved/favorited spaces
   - Grid/List view options
   - Quick access to space details
   - Remove from saved functionality

#### BecomeHostPage

The BecomeHostPage component is a landing page for potential hosts who want to list their space on PawSpace.

### Features
- Full-screen hero section with background image and overlay
- "Host a private dog park" value proposition
- Earning potential highlight ($3,000/month)
- Call-to-action button to start the hosting process
- Features section highlighting key benefits:
  - Earn Extra Income
  - Safe & Secure
  - Easy to Start
- FAQ section with common host questions
- Final CTA section encouraging sign-up

### Usage
```tsx
import { BecomeHostPage } from '../components/BecomeHostPage';

// In your router
<Route path="/host" element={<BecomeHostPage />} />
```

### Required Assets
- `/host-hero.jpg`: Background image showing host with dog
- `/pawspace-logo.svg`: PawSpace logo

### Dependencies
- React Router for navigation
- Tailwind CSS for styling

### 🗺️ Map Components (`/src/components/map`)
Components related to map functionality and location services.

### 📝 Form Components (`/src/components/forms`)
Reusable form components and form-related utilities.

### 📱 Layout Components (`/src/components/layout`)
Components that define the application's layout structure.

## 🔧 Best Practices

### Component Structure
```typescript
// ComponentName.tsx
import React from 'react';
import type { ComponentProps } from './types';

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX
  );
};

// types.ts
export interface ComponentProps {
  prop1: string;
  prop2: number;
}
```

### Testing
- Every component should have corresponding test file
- Test both success and error states
- Test user interactions
- Test accessibility

### Accessibility
- Use semantic HTML elements
- Include ARIA labels where necessary
- Ensure keyboard navigation
- Maintain proper color contrast

### Performance
- Lazy load when appropriate
- Memoize expensive computations
- Use proper React hooks
- Optimize re-renders

## 🎯 Component Development Workflow

1. **Planning**
   - Define component requirements
   - Design component API
   - Plan for reusability

2. **Implementation**
   - Create component file
   - Implement core functionality
   - Add proper typing
   - Include error handling

3. **Testing**
   - Write unit tests
   - Test edge cases
   - Verify accessibility
   - Check performance

4. **Documentation**
   - Update this document
   - Add JSDoc comments
   - Include usage examples

## 🔄 State Management

### Local State
Use React's useState for component-level state:
```typescript
const [value, setValue] = useState(initialValue);
```

### Global State
Use appropriate global state management based on needs:
- Context API for theme/auth
- Redux for complex state
- React Query for server state

## 🎨 Styling

### Tailwind CSS
- Use utility classes
- Follow component-specific patterns
- Maintain consistency with design system

### CSS Modules
When needed for complex styling:
```typescript
import styles from './Component.module.css';
```

## 📦 Code Organization

### File Structure
```
components/
├── ui/
│   ├── core/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── types.ts
│   │   └── Input/
│   └── composite/
├── feature/
│   └── UserDashboard/
│   └── BecomeHostPage/
└── layout/
```

### Import Order
1. React and external libraries
2. Types and interfaces
3. Components
4. Hooks
5. Utils
6. Styles
