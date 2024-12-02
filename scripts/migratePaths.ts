import { PathUtils } from '../src/utils/pathUtils';
import { paths } from '../src/config/paths';
import * as fs from 'fs/promises';
import * as path from 'path';

interface FileUpdate {
  filePath: string;
  changes: number;
}

async function updateImportPaths(content: string, filePath: string): Promise<[string, number]> {
  let changes = 0;

  // Replace relative imports with absolute imports
  const updatedContent = content.replace(
    /(import\s+(?:(?:\{[^}]*\}|\*\s+as\s+[^,\s]+|\w+)\s*,?\s*)*\s*from\s+['"])([.]{1,2}\/[^'"]+)(['"])/g,
    (match, importStart, importPath, importEnd) => {
      changes++;
      const absolutePath = path.resolve(path.dirname(filePath), importPath);
      const relativePath = PathUtils.toRelative(absolutePath);
      return `${importStart}@/${relativePath}${importEnd}`;
    }
  );

  return [updatedContent, changes];
}

async function processFile(filePath: string): Promise<FileUpdate | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const [updatedContent, changes] = await updateImportPaths(content, filePath);

    if (changes > 0) {
      await fs.writeFile(filePath, updatedContent, 'utf-8');
      return {
        filePath: PathUtils.toRelative(filePath),
        changes
      };
    }

    return null;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return null;
  }
}

async function* walkDirectory(dir: string): AsyncGenerator<string> {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Skip node_modules and other unnecessary directories
      if (!['node_modules', 'dist', 'build', '.git'].includes(file.name)) {
        yield* walkDirectory(fullPath);
      }
    } else if (file.isFile() && /\.(ts|tsx|js|jsx)$/.test(file.name)) {
      yield fullPath;
    }
  }
}

async function updateTsConfig(): Promise<void> {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');

  try {
    const tsConfig = JSON.parse(await fs.readFile(tsConfigPath, 'utf-8'));

    // Add or update path aliases
    tsConfig.compilerOptions = {
      ...tsConfig.compilerOptions,
      baseUrl: ".",
      paths: {
        "@/*": ["src/*"]
      }
    };

    await fs.writeFile(tsConfigPath, JSON.stringify(tsConfig, null, 2), 'utf-8');
    console.log('✅ Updated tsconfig.json with path aliases');
  } catch (error) {
    console.error('Error updating tsconfig.json:', error);
  }
}

async function updateViteConfig(): Promise<void> {
  const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');

  try {
    let content = await fs.readFile(viteConfigPath, 'utf-8');

    // Add path alias configuration
    if (!content.includes('@/*')) {
      const aliasConfig = `
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },`;

      content = content.replace(
        /(defineConfig\(\{)/,
        `$1\n${aliasConfig}`
      );

      await fs.writeFile(viteConfigPath, content, 'utf-8');
      console.log('✅ Updated vite.config.ts with path aliases');
    }
  } catch (error) {
    console.error('Error updating vite.config.ts:', error);
  }
}

async function main() {
  console.log('🔄 Starting path migration...');

  const updates: FileUpdate[] = [];

  for await (const filePath of walkDirectory(paths.src)) {
    const update = await processFile(filePath);
    if (update) {
      updates.push(update);
    }
  }

  // Update configuration files
  await updateTsConfig();
  await updateViteConfig();

  // Print summary
  console.log('\n📊 Migration Summary:');
  console.log(`Updated ${updates.length} files:`);
  updates.forEach(update => {
    console.log(`  - ${update.filePath} (${update.changes} changes)`);
  });

  console.log('\n✨ Path migration complete!');
  console.log('\nNext steps:');
  console.log('1. Review the changes in your version control system');
  console.log('2. Update any remaining manual path references');
  console.log('3. Run your test suite to ensure everything works correctly');
}

main().catch(console.error);
