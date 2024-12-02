import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

async function createFileIfNotExists(filePath, content) {
  try {
    await fs.access(filePath);
    console.log(`File exists: ${filePath}`);
  } catch {
    await fs.writeFile(filePath, content);
    console.log(`Created file: ${filePath}`);
  }
}

async function fixProject() {
  // Ensure required directories exist
  const directories = [
    'src',
    'src/client',
    'src/server',
    'src/client/components',
    'src/client/hooks',
    'src/client/utils',
    'src/server/models',
    'src/server/routes',
    'src/server/controllers',
  ];

  for (const dir of directories) {
    await ensureDirectoryExists(path.join(projectRoot, dir));
  }

  // Create essential files
  const files = [
    {
      path: '.env',
      content: `MONGODB_URI=mongodb://localhost:27017/pawspace
PORT=3001
VITE_API_URL=http://localhost:3001`
    },
    {
      path: 'src/client/vite-env.d.ts',
      content: '/// <reference types="vite/client" />'
    },
    {
      path: 'tsconfig.json',
      content: JSON.stringify({
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          esModuleInterop: true
        },
        include: ["src"],
        references: [{ path: "./tsconfig.node.json" }]
      }, null, 2)
    },
    {
      path: 'tsconfig.node.json',
      content: JSON.stringify({
        compilerOptions: {
          composite: true,
          skipLibCheck: true,
          module: "ESNext",
          moduleResolution: "bundler",
          allowSyntheticDefaultImports: true
        },
        include: ["vite.config.ts"]
      }, null, 2)
    },
    {
      path: 'vite.config.ts',
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})`
    },
    {
      path: 'postcss.config.js',
      content: `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
    },
    {
      path: 'tailwind.config.js',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
    }
  ];

  for (const file of files) {
    await createFileIfNotExists(path.join(projectRoot, file.path), file.content);
  }

  console.log('Project structure has been fixed!');
}

fixProject().catch(console.error);
