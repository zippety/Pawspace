import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function checkDependencies() {
  console.log('Checking dependencies...');

  const requiredDependencies = {
    dependencies: [
      '@supabase/supabase-js',
      'framer-motion',
      'lucide-react',
      'zustand',
      'react-leaflet',
      'leaflet',
      'express',
      'mongoose',
      'cors',
      'react-hook-form',
      '@hookform/resolvers',
      'react-router-dom'
    ],
    devDependencies: [
      '@types/leaflet'
    ]
  };

  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);

    const missingDeps = [];
    const missingDevDeps = [];

    requiredDependencies.dependencies.forEach(dep => {
      if (!packageJson.dependencies?.[dep]) {
        missingDeps.push(dep);
      }
    });

    requiredDependencies.devDependencies.forEach(dep => {
      if (!packageJson.devDependencies?.[dep]) {
        missingDevDeps.push(dep);
      }
    });

    if (missingDeps.length > 0 || missingDevDeps.length > 0) {
      console.log('Missing dependencies detected. Installing...');

      if (missingDeps.length > 0) {
        const depsCommand = `npm install ${missingDeps.join(' ')}`;
        console.log(`Installing dependencies: ${missingDeps.join(', ')}`);
        await execAsync(depsCommand, { cwd: projectRoot });
      }

      if (missingDevDeps.length > 0) {
        const devDepsCommand = `npm install -D ${missingDevDeps.join(' ')}`;
        console.log(`Installing dev dependencies: ${missingDevDeps.join(', ')}`);
        await execAsync(devDepsCommand, { cwd: projectRoot });
      }

      console.log('Dependencies installed successfully!');
    } else {
      console.log('All required dependencies are installed.');
    }
  } catch (error) {
    console.error('Error checking dependencies:', error);
    process.exit(1);
  }
}

async function checkRequiredFiles() {
  console.log('Checking required files...');

  const requiredFiles = [
    '.env',
    'tsconfig.json',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js'
  ];

  const missingFiles = [];

  for (const file of requiredFiles) {
    try {
      await fs.access(path.join(projectRoot, file));
    } catch {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    console.log('Missing required files:', missingFiles.join(', '));
    console.log('Running fix script to create missing files...');
    await execAsync('npm run fix', { cwd: projectRoot });
  } else {
    console.log('All required files are present.');
  }
}

async function main() {
  try {
    await checkDependencies();
    await checkRequiredFiles();
    console.log('Setup check completed successfully!');
  } catch (error) {
    console.error('Error during setup check:', error);
    process.exit(1);
  }
}

main();
