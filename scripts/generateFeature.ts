import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface FeatureConfig {
  name: string;
  parts: string[];
  includes: ('api' | 'tests' | 'stories' | 'hooks' | 'store')[];
  withErrorBoundary?: boolean;
  withLoadingStates?: boolean;
  withRetry?: boolean;
}

const templates = {
  component: (name: string, { withErrorBoundary, withLoadingStates, withRetry }: Partial<FeatureConfig>) => `
import React from 'react';
import { cn } from '@/utils/cn';
${withErrorBoundary ? "import { withErrorBoundary } from '@/utils/errorTracking';" : ''}
${withLoadingStates ? "import { Skeleton } from '@/components/ui/Skeleton';" : ''}
${withRetry ? "import { useSmartRequest } from '@/hooks/useSmartRequest';" : ''}

interface ${name}Props {
  className?: string;
}

function ${name}Content({ className }: ${name}Props) {
  ${withRetry ? `
  const { data, isLoading, error, retry } = useSmartRequest(
    'key',
    async () => {
      // Fetch data
    },
    {
      retry: { maxAttempts: 3 },
      cache: { ttl: 5 * 60 * 1000 }
    }
  );
  ` : ''}

  ${withLoadingStates ? `
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-32" />
      </div>
    );
  }
  ` : ''}

  ${withErrorBoundary ? `
  if (error) {
    return (
      <div className="text-red-500">
        Error: {error.message}
        <button onClick={retry}>Retry</button>
      </div>
    );
  }
  ` : ''}

  return (
    <div className={cn('', className)}>
      {/* Component content */}
    </div>
  );
}

${withErrorBoundary
  ? `export const ${name} = withErrorBoundary('${name}')(${name}Content);`
  : `export const ${name} = ${name}Content;`}`,

  hook: (name: string) => `
import { useState, useEffect } from 'react';
import { smartCache } from '@/utils/smartCache';

export function use${name}() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch${name} = async () => {
    try {
      const result = await smartCache.smartRequest(
        '${name.toLowerCase()}-key',
        async () => {
          // Fetch data
        },
        {
          cache: { ttl: 5 * 60 * 1000, staleWhileRevalidate: true },
          retry: { maxAttempts: 3 }
        }
      );
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch${name}();
  }, []);

  return { data, isLoading, error, refetch: fetch${name} };
}`,

  api: (name: string) => `
import { supabase } from '@/utils/supabase';

export const ${name}Api = {
  async fetch(): Promise<any> {
    const { data, error } = await supabase
      .from('${name.toLowerCase()}')
      .select('*');

    if (error) throw error;
    return data;
  },

  async create(data: any): Promise<any> {
    const { data: result, error } = await supabase
      .from('${name.toLowerCase()}')
      .insert(data)
      .single();

    if (error) throw error;
    return result;
  },

  // Add more API methods as needed
};`,

  store: (name: string) => `
import { create } from 'zustand';
import { ${name}Api } from '../api/${name}Api';

interface ${name}State {
  data: any[];
  isLoading: boolean;
  error: Error | null;
  fetch: () => Promise<void>;
  create: (data: any) => Promise<void>;
}

export const use${name}Store = create<${name}State>((set, get) => ({
  data: [],
  isLoading: false,
  error: null,

  fetch: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await ${name}Api.fetch();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  create: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const result = await ${name}Api.create(data);
      set(state => ({
        data: [...state.data, result],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
}));`,

  test: (name: string) => `
import { render, screen, fireEvent } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name} />);
    // Add test cases
  });

  it('handles loading state', () => {
    // Test loading state
  });

  it('handles error state', () => {
    // Test error state
  });
});`
};

async function generateFeature(config: FeatureConfig) {
  const { name, parts, includes } = config;
  const featureDir = path.join('src', 'features', name.toLowerCase());

  // Create feature directory structure
  const directories = [
    '',
    'components',
    ...includes.map(include => include === 'api' ? 'api' : `${include}`)
  ];

  directories.forEach(dir => {
    const fullPath = path.join(featureDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  // Generate components
  for (const part of parts) {
    const componentName = `${name}${part.charAt(0).toUpperCase()}${part.slice(1)}`;
    const componentPath = path.join(featureDir, 'components', componentName);
    fs.mkdirSync(componentPath, { recursive: true });

    // Main component
    fs.writeFileSync(
      path.join(componentPath, `${componentName}.tsx`),
      templates.component(componentName, config)
    );

    // Index file
    fs.writeFileSync(
      path.join(componentPath, 'index.ts'),
      `export * from './${componentName}';\n`
    );

    // Tests
    if (includes.includes('tests')) {
      fs.writeFileSync(
        path.join(componentPath, `${componentName}.test.tsx`),
        templates.test(componentName)
      );
    }
  }

  // Generate API
  if (includes.includes('api')) {
    fs.writeFileSync(
      path.join(featureDir, 'api', `${name}Api.ts`),
      templates.api(name)
    );
  }

  // Generate hooks
  if (includes.includes('hooks')) {
    fs.writeFileSync(
      path.join(featureDir, 'hooks', `use${name}.ts`),
      templates.hook(name)
    );
  }

  // Generate store
  if (includes.includes('store')) {
    fs.writeFileSync(
      path.join(featureDir, 'store', `${name}Store.ts`),
      templates.store(name)
    );
  }

  // Format all generated files
  try {
    execSync(`npx prettier --write "${featureDir}/**/*"`);
  } catch (error) {
    console.warn('Failed to format files:', error);
  }

  console.log(`✨ Generated feature "${name}" successfully!`);
}

// Example usage:
// generateFeature({
//   name: 'PropertyListing',
//   parts: ['list', 'card', 'filter', 'search'],
//   includes: ['api', 'tests', 'stories', 'hooks', 'store'],
//   withErrorBoundary: true,
//   withLoadingStates: true,
//   withRetry: true
// });
