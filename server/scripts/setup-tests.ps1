# Install dependencies
Write-Host "Installing test dependencies..."
npm install --save-dev jest ts-jest @types/jest @jest/types

# Create test directories if they don't exist
Write-Host "Setting up test directories..."
$testDirs = @(
    "src/ai/profiles/__tests__",
    "src/ai/utils/__tests__",
    "src/ai/spaces/__tests__"
)

foreach ($dir in $testDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

# Run tests
Write-Host "Running tests..."
npm test

Write-Host "`nTest setup complete! You can now run tests using:"
Write-Host "npm test          - Run all tests"
Write-Host "npm run test:watch    - Run tests in watch mode"
Write-Host "npm run test:coverage - Run tests with coverage report"
