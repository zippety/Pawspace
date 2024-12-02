import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function executeCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Failed to execute command: ${command}`);
        return false;
    }
}

function checkEnvFile() {
    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', '.env.example');

    if (!fs.existsSync(envPath)) {
        console.log('\n⚠️ No .env file found. Creating one from .env.example...');
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ Created .env file. Please update it with your actual credentials.');
        return false;
    }
    return true;
}

async function promptToContinue() {
    return new Promise((resolve) => {
        rl.question('Press Enter to continue or Ctrl+C to exit...', () => {
            resolve();
        });
    });
}

async function main() {
    console.log('🚀 Starting Pawspace Demo Setup...\n');

    // Check environment setup
    const envReady = checkEnvFile();
    if (!envReady) {
        console.log('\n⚠️ Please update your .env file with the required credentials before continuing.');
        await promptToContinue();
    }

    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    if (!executeCommand('npm install')) {
        console.error('❌ Failed to install dependencies');
        process.exit(1);
    }

    // Run setup check
    console.log('\n🔍 Running setup check...');
    if (!executeCommand('npm run setup')) {
        console.log('\n⚠️ Setup check failed. Please resolve any issues before continuing.');
        await promptToContinue();
    }

    // Build the project first
    console.log('\n🏗️ Building the project...');
    if (!executeCommand('npm run build')) {
        console.log('\n⚠️ Build failed. Please check the build errors.');
        await promptToContinue();
    }

    // Start the development server
    console.log('\n🌐 Starting the development server...');
    console.log('The application will be available at http://localhost:3000\n');
    executeCommand('npm run dev');
}

main().catch(console.error).finally(() => rl.close());
