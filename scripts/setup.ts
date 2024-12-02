import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const setup = async () => {
  // Smart dependency installation
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const hasTypeScript = packageJson.dependencies.typescript || packageJson.devDependencies.typescript;

  console.log('🚀 Setting up PawSpaces development environment...');

  // Auto-detect package manager
  const hasYarnLock = fs.existsSync('yarn.lock');
  const hasPnpmLock = fs.existsSync('pnpm-lock.yaml');
  const packageManager = hasPnpmLock ? 'pnpm' : (hasYarnLock ? 'yarn' : 'npm');

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync(`${packageManager} install`, { stdio: 'inherit' });

  // Auto-create environment file if needed
  if (!fs.existsSync('.env')) {
    console.log('🔧 Creating development environment configuration...');
    const envExample = fs.readFileSync('.env.example', 'utf-8');
    const defaultEnv = envExample.replace(
      /^(VITE_|REACT_APP_).*=.*/gm,
      (match) => {
        // Smart defaults based on variable name
        if (match.includes('URL')) return `${match.split('=')[0]}=http://localhost:54321`;
        if (match.includes('KEY')) return `${match.split('=')[0]}=development-key-${Date.now()}`;
        if (match.includes('VERSION')) return `${match.split('=')[0]}=${packageJson.version}`;
        return match;
      }
    );
    fs.writeFileSync('.env', defaultEnv);
  }

  // Setup git hooks if needed
  if (fs.existsSync('.git')) {
    console.log('🔗 Setting up Git hooks...');
    execSync('npx husky install', { stdio: 'inherit' });
  }

  // Create VSCode settings if needed
  const vscodePath = '.vscode';
  if (!fs.existsSync(vscodePath)) {
    console.log('⚙️ Creating VSCode configuration...');
    fs.mkdirSync(vscodePath);
    const settings = {
      'editor.formatOnSave': true,
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': true
      },
      'typescript.tsdk': 'node_modules/typescript/lib'
    };
    fs.writeFileSync(
      path.join(vscodePath, 'settings.json'),
      JSON.stringify(settings, null, 2)
    );
  }

  console.log('✨ Setup complete! Run `npm run dev` to start development server');
};

setup().catch(console.error);
