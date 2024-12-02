# 📝 PawSpace Style Guide

## Code Style Philosophy

Our code style emphasizes readability, maintainability, and consistency. We follow modern TypeScript/React best practices with a focus on type safety and component reusability.

## 🎨 TypeScript Guidelines

### Types and Interfaces

```typescript
// ✅ DO: Use descriptive interface names
interface SpaceListingProps {
  title: string;
  description: string;
  price: number;
}

// ❌ DON'T: Use vague names
interface Data {
  t: string;
  d: string;
  p: number;
}
```

### Type Assertions

```typescript
// ✅ DO: Use type assertions sparingly and only when necessary
const userInput = event.target as HTMLInputElement;

// ❌ DON'T: Use type assertions to silence TypeScript
const data = apiResponse as any;
```

### Generics

```typescript
// ✅ DO: Use descriptive generic names
function fetchData<TData>(url: string): Promise<TData> {
  return fetch(url).then(res => res.json());
}

// ❌ DON'T: Use single letters for generics (except in simple cases)
function process<T>(data: T): T {
  return data;
}
```

## 🎯 React Component Guidelines

### Component Structure

```typescript
// ✅ DO: Use functional components with proper typing
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  children,
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ DON'T: Use untyped components
export const Button = (props) => {
  return <button {...props} />;
};
```

### Hooks Usage

```typescript
// ✅ DO: Use proper dependency arrays
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// ❌ DON'T: Ignore exhaustive-deps warnings
useEffect(() => {
  fetchUserData(userId);
}, []); // Missing dependency
```

### State Management

```typescript
// ✅ DO: Use proper state initialization
const [isLoading, setIsLoading] = useState<boolean>(false);

// ❌ DON'T: Use undefined state types
const [data, setData] = useState();
```

## 📚 File Organization

### Directory Structure

```
src/
├── components/
│   ├── common/          # Shared components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── Button.module.css
│   │   └── ...
│   └── features/        # Feature-specific components
├── hooks/               # Custom hooks
├── utils/               # Utility functions
└── types/               # Type definitions
```

### File Naming

```
// ✅ DO: Use PascalCase for components
Button.tsx
UserProfile.tsx

// ✅ DO: Use camelCase for utilities
formatDate.ts
validateInput.ts

// ❌ DON'T: Mix naming conventions
button.tsx
user-profile.tsx
```

## 🎯 CSS/Styling Guidelines

### CSS Modules

```typescript
// ✅ DO: Use CSS Modules with descriptive classnames
import styles from './Button.module.css';

export const Button = () => (
  <button className={styles.primaryButton}>
    Click me
  </button>
);

// ❌ DON'T: Use inline styles for recurring elements
export const Button = () => (
  <button style={{ backgroundColor: 'blue', padding: '10px' }}>
    Click me
  </button>
);
```

### Tailwind CSS

```typescript
// ✅ DO: Group related classes
<div className="
  flex items-center justify-between
  p-4 bg-white rounded-lg
  shadow-md hover:shadow-lg
">

// ❌ DON'T: Write unorganized classes
<div className="p-4 hover:shadow-lg flex rounded-lg shadow-md items-center bg-white justify-between">
```

## 📝 Documentation Guidelines

### Component Documentation

```typescript
/**
 * Primary button component with various style variants
 * @param variant - Button style variant
 * @param onClick - Click handler function
 * @param children - Button content
 */
export const Button: React.FC<ButtonProps> = // ...

// ❌ DON'T: Leave components undocumented
export const Button = // ...
```

### Function Documentation

```typescript
/**
 * Formats a date string into a localized format
 * @param date - ISO date string
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(
  date: string,
  locale = 'en-US'
): string {
  // Implementation
}
```

## 🧪 Testing Guidelines

### Test Structure

```typescript
describe('Button', () => {
  // ✅ DO: Write descriptive test cases
  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });

  // ❌ DON'T: Write vague tests
  it('works', () => {
    // Test implementation
  });
});
```

### Test Coverage

- Aim for 80% coverage for business logic
- Test all user interactions
- Test error cases and edge conditions

## 🔒 Security Guidelines

### Data Handling

```typescript
// ✅ DO: Sanitize user input
const sanitizedInput = DOMPurify.sanitize(userInput);

// ❌ DON'T: Trust user input directly
dangerouslySetInnerHTML={{ __html: userInput }}
```

### Authentication

```typescript
// ✅ DO: Use proper token handling
const token = localStorage.getItem('token');
if (!token) {
  redirectToLogin();
}

// ❌ DON'T: Store sensitive data in localStorage
localStorage.setItem('password', userPassword);
```

## 🚀 Performance Guidelines

### React Performance

```typescript
// ✅ DO: Memoize expensive calculations
const memoizedValue = useMemo(() =>
  expensiveCalculation(prop), [prop]
);

// ❌ DON'T: Create new objects in render
const style = { margin: '10px' }; // Created every render
```

### Image Optimization

```typescript
// ✅ DO: Use proper image optimization
<Image
  src="/large-image.jpg"
  width={800}
  height={600}
  loading="lazy"
  alt="Description"
/>

// ❌ DON'T: Use unoptimized images
<img src="/large-image.jpg" />
```
