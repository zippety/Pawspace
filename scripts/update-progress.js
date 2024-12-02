import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROGRESS_FILE = path.join(__dirname, '..', 'PROGRESS.md');
const DATE_SEPARATOR = '\n\n## ';

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function getGitChanges() {
    try {
        const changes = execSync('git diff --name-status HEAD@{1} HEAD').toString();
        return changes.split('\n')
            .filter(line => line.trim())
            .map(line => {
                const [status, file] = line.split('\t');
                const changeType = status === 'M' ? 'Modified' :
                                 status === 'A' ? 'Added' :
                                 status === 'D' ? 'Deleted' : 'Changed';
                return `- ${changeType}: \`${file}\``;
            })
            .join('\n');
    } catch (error) {
        return '- No git changes detected';
    }
}

function getNpmChanges() {
    try {
        const packageLock = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package-lock.json'), 'utf8'));
        const dependencies = Object.keys(packageLock.dependencies || {}).length;
        return `- Total dependencies: ${dependencies}`;
    } catch (error) {
        return '- No package changes detected';
    }
}

function updateProgress() {
    const date = getCurrentDate();
    const gitChanges = getGitChanges();
    const npmChanges = getNpmChanges();

    const newEntry = `${DATE_SEPARATOR}${date}\n\n### Changes\n${gitChanges}\n\n### Dependencies\n${npmChanges}\n`;

    let content = fs.readFileSync(PROGRESS_FILE, 'utf8');

    // Add new entry after the title
    const titleEnd = content.indexOf('\n\n');
    if (titleEnd !== -1) {
        content = content.slice(0, titleEnd + 2) + newEntry + content.slice(titleEnd + 2);
    } else {
        content = content + newEntry;
    }

    fs.writeFileSync(PROGRESS_FILE, content);
    console.log(`Progress updated for ${date}`);
}

// Run the update
updateProgress();
