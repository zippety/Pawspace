# Installation Guide

This guide provides detailed installation instructions for setting up PawSpace locally.

## System Requirements

### Minimum Requirements
- CPU: 2 cores
- RAM: 4GB
- Storage: 1GB free space

### Software Requirements
- Node.js 18.x or later
- MongoDB 6.0 or later
- Git
- npm or yarn package manager

## Step-by-Step Installation

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Install MongoDB
Follow the [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

### 3. Clone the Repository
```bash
git clone https://github.com/yourusername/pawspace.git
cd pawspace
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Environment Setup
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
- Database connection string
- API keys
- Port settings
- Environment variables

### 6. Build the Application
```bash
npm run build
```

### 7. Start the Server
```bash
npm start
```

## Verification
- Frontend should be accessible at `http://localhost:5173`
- Backend API should be running at `http://localhost:3000`

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   lsof -i :5173  # Check what's using the port
   kill -9 PID    # Kill the process if needed
   ```

2. **MongoDB Connection Issues**
   - Verify MongoDB is running
   - Check connection string in `.env`
   - Ensure network connectivity

3. **Node.js Version Mismatch**
   ```bash
   nvm install 18  # Install Node.js 18
   nvm use 18      # Switch to Node.js 18
   ```

## Next Steps

- [Configuration Guide](configuration.md)
- [Development Setup](../development/setup.md)
- [Contributing Guide](../development/contributing.md)
