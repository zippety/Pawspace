# Path System Documentation

## Overview

PawSpaces implements a robust path handling system to ensure consistent and maintainable path management across the project. This document provides detailed information about the path system, its components, and best practices for usage.

## Key Components

### 1. PathUtils

Located at `@/utils/pathUtils`, this utility class provides methods for handling paths consistently:

```typescript
import { PathUtils } from '@/utils/pathUtils';

// Convert relative to absolute path
const absolutePath = PathUtils.toAbsolute('./components/MyComponent');

// Convert absolute to relative path
const relativePath = PathUtils.toRelative('/full/path/to/file');

// Normalize path separators
const normalizedPath = PathUtils.normalizePath('path\\to\\file');

// Join path segments
const joinedPath = PathUtils.join('src', 'components', 'MyComponent');
```

### 2. Path Configuration

Located at `@/config/paths`, this module provides predefined paths and helper functions:

```typescript
import { paths, getAbsolutePath, getRelativePath } from '@/config/paths';

// Access predefined paths
const componentsDir = paths.components;
const assetsDir = paths.assets;

// Convert paths
const absolutePath = getAbsolutePath('src/components/MyComponent');
const relativePath = getRelativePath('/full/path/to/file');
```

## Import System

### Absolute Imports

We use the `@/` alias to reference files from the `src` directory:

```typescript
// Components
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';

// Utilities
import { formatDate } from '@/utils/dateUtils';
import { validateEmail } from '@/utils/validation';
```

### Import Organization

Organize imports in the following order:

1. External packages
2. Path utilities and configuration
3. Components
4. Hooks
5. Utilities
6. Types
7. Assets

Example:

```typescript
// 1. External packages
import React from 'react';
import { motion } from 'framer-motion';

// 2. Path utilities and configuration
import { paths } from '@/config/paths';
import { PathUtils } from '@/utils/pathUtils';

// 3. Components
import { PropertyCard } from '@/components/PropertyCard';
import { SearchBar } from '@/components/SearchBar';

// 4. Hooks
import { usePropertySearch } from '@/hooks/usePropertySearch';
import { useFilters } from '@/hooks/useFilters';

// 5. Utilities
import { formatPrice } from '@/utils/formatters';
import { validateInput } from '@/utils/validation';

// 6. Types
import type { Property } from '@/types/property';
import type { SearchFilters } from '@/types/filters';

// 7. Assets
import logo from '@/assets/images/logo.svg';
```

## Path Migration

### Using the Migration Script

The project includes a path migration script to help convert existing code to use the new path system:

```bash
# Run the migration script
npm run migrate-paths
```

The script will:
1. Convert relative imports to absolute imports using the `@/` alias
2. Update TypeScript and Vite configurations
3. Provide a summary of changes made

### Manual Migration

If you need to manually migrate paths:

1. Replace relative imports with `@/` alias:
   ```typescript
   // Before
   import { Component } from '../../components/Component';

   // After
   import { Component } from '@/components/Component';
   ```

2. Use PathUtils for path operations:
   ```typescript
   // Before
   const path = require('path');
   const filePath = path.join(__dirname, 'file.txt');

   // After
   import { PathUtils } from '@/utils/pathUtils';
   const filePath = PathUtils.join('path', 'to', 'file.txt');
   ```

## Best Practices

1. **Always Use the `@/` Alias**
   - Makes imports more maintainable
   - Prevents deep nesting issues
   - Improves code readability

2. **Use Path Utilities**
   - Always use `PathUtils` for path operations
   - Avoid direct path manipulation
   - Maintain cross-platform compatibility

3. **Reference Common Paths**
   - Use the `paths` configuration for common directories
   - Keep path definitions centralized
   - Avoid hardcoding paths

4. **Organize Imports**
   - Follow the import organization guidelines
   - Group related imports together
   - Keep imports alphabetically sorted within groups

5. **Update Documentation**
   - Document new path patterns
   - Keep path-related documentation up to date
   - Include examples for complex cases

## Troubleshooting

### Common Issues

1. **Import Not Found**
   - Ensure the `@/` alias is properly configured in `tsconfig.json` and `vite.config.ts`
   - Check that the file path is correct relative to the `src` directory
   - Verify file extensions are correct

2. **Path Separator Issues**
   - Always use forward slashes (`/`) in imports
   - Use `PathUtils.normalizePath()` for path manipulation
   - Avoid platform-specific path separators

3. **Migration Script Errors**
   - Check file permissions
   - Ensure all files are saved
   - Review any conflicting Git changes

### Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review the migration script logs
3. Consult the team's technical documentation
4. Open an issue in the project repository

## Contributing

When contributing to the path system:

1. Follow the established conventions
2. Update relevant documentation
3. Add tests for new functionality
4. Use the provided utilities
5. Submit detailed pull requests
