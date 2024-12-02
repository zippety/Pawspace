# 🤝 Contributing to PawSpace

Thank you for your interest in contributing to PawSpace! This document provides guidelines and instructions for contributing.

## 🎯 Getting Started

### 1. Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/pawspace.git
cd pawspace

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

### 2. Project Structure
Please familiarize yourself with our [Architecture Documentation](./ARCHITECTURE.md) and [Component Guide](./COMPONENTS.md).

## 📝 Development Guidelines

### Code Style
We use ESLint and Prettier to maintain consistent code style:

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

### TypeScript
- Always use TypeScript for new code
- Maintain proper type definitions
- Avoid using `any` type

### Component Guidelines
1. **Atomic Design**: Follow atomic design principles
2. **Props Interface**: Define prop interfaces for all components
3. **Documentation**: Add JSDoc comments for component props
4. **Testing**: Include unit tests for components

Example component structure:
```typescript
interface ButtonProps {
  /** Button variant style */
  variant?: 'default' | 'secondary' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Click handler */
  onClick?: () => void;
  /** Button contents */
  children: React.ReactNode;
}

/**
 * Primary button component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  onClick,
  children,
}) => {
  // Component implementation
};
```

### Testing
- Write tests for new features
- Maintain existing tests
- Run full test suite before submitting PR

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- components
```

## 🚀 Pull Request Process

1. **Branch Naming**
   - feature/feature-name
   - fix/bug-description
   - docs/documentation-update

2. **Commit Messages**
   Follow conventional commits:
   - feat: Add new feature
   - fix: Bug fix
   - docs: Documentation updates
   - style: Code style updates
   - refactor: Code refactoring
   - test: Test updates

3. **PR Description**
   - Clearly describe changes
   - Reference related issues
   - Include screenshots for UI changes
   - List breaking changes

4. **PR Checklist**
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] Code follows style guidelines
   - [ ] All tests passing
   - [ ] No new TypeScript errors
   - [ ] Reviewed own code

## 🐛 Bug Reports

When filing a bug report, please include:

1. **Description**
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior

2. **Environment**
   - Browser version
   - Operating system
   - Screen size (for UI issues)

3. **Screenshots**
   - Include relevant screenshots
   - Screen recordings for complex issues

## 💡 Feature Requests

When proposing new features:

1. **Description**
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach

2. **Additional Context**
   - Mockups or wireframes
   - Similar features in other apps
   - Technical considerations

## 📚 Documentation

- Keep documentation up to date
- Document new features
- Update API documentation
- Include code examples

## 🤝 Code Review Process

1. **Reviewer Guidelines**
   - Check code style
   - Verify test coverage
   - Review documentation
   - Test functionality
   - Check performance impact

2. **Author Guidelines**
   - Respond to feedback promptly
   - Make requested changes
   - Keep PR scope focused
   - Rebase when needed

## 🔒 Security

- Never commit sensitive data
- Report security issues privately
- Follow security best practices
- Keep dependencies updated

## 📝 License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
