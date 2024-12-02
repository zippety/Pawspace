import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ComponentConfig {
  name: string;
  type: 'component' | 'page' | 'hook' | 'store';
  feature?: string;
  withTest?: boolean;
  withStory?: boolean;
}

const templates = {
  component: (name: string) => `import React from 'react';
import { cn } from '../../utils/cn';

interface ${name}Props {
  className?: string;
}

export function ${name}({ className }: ${name}Props) {
  return (
    <div className={cn('', className)}>
      {/* Component content */}
    </div>
  );
}`,

  hook: (name: string) => `import { useState, useEffect } from 'react';

export function ${name}() {
  // Hook implementation
  return {
    // Hook return values
  };
}`,

  store: (name: string) => `import { create } from 'zustand';

interface ${name}State {
  // State types
}

export const use${name} = create<${name}State>((set, get) => ({
  // Store implementation
}));`,

  test: (name: string) => `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name} />);
    // Add your test cases
  });
});`,

  story: (name: string) => `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  component: ${name},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${name}>;

export const Default: Story = {
  args: {
    // Add your story args
  },
};`
};

async function generateComponent(config: ComponentConfig) {
  const { name, type, feature, withTest, withStory } = config;

  // Determine base path
  let basePath = path.join('src');
  if (type === 'component') {
    basePath = path.join(basePath, feature ? `features/${feature}/components` : 'components');
  } else if (type === 'page') {
    basePath = path.join(basePath, 'pages');
  } else if (type === 'hook') {
    basePath = path.join(basePath, 'hooks');
  } else if (type === 'store') {
    basePath = path.join(basePath, 'store');
  }

  // Create directory if it doesn't exist
  const componentDir = path.join(basePath, name);
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  // Create main component file
  const template = templates[type];
  fs.writeFileSync(
    path.join(componentDir, `${name}.tsx`),
    template(name)
  );

  // Create test file if requested
  if (withTest) {
    fs.writeFileSync(
      path.join(componentDir, `${name}.test.tsx`),
      templates.test(name)
    );
  }

  // Create story file if requested
  if (withStory) {
    fs.writeFileSync(
      path.join(componentDir, `${name}.stories.tsx`),
      templates.story(name)
    );
  }

  // Create index file
  fs.writeFileSync(
    path.join(componentDir, 'index.ts'),
    `export * from './${name}';\n`
  );

  // Format files
  try {
    execSync(`npx prettier --write "${componentDir}/**/*"`);
  } catch (error) {
    console.warn('Failed to format files:', error);
  }

  console.log(`✨ Generated ${type} "${name}" successfully!`);
}

// Example usage:
// generateComponent({
//   name: 'UserProfile',
//   type: 'component',
//   feature: 'user',
//   withTest: true,
//   withStory: true,
// });
