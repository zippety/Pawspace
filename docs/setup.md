# Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Git
- Node.js (v16 or later)
- Python 3.8 or later
- MongoDB (for local development)

## Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/pawspace.git
   cd pawspace
   ```

2. **Set Up Frontend**
   ```bash
   # Install Node.js dependencies
   npm install

   # Create environment file
   cp .env.example .env
   ```

3. **Set Up Python Environment**
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate

   # Install Python dependencies
   pip install -r scripts/requirements.txt
   ```

4. **Configure Environment Variables**
   Edit `.env` file and add your API keys:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/pawspace
   HUGGINGFACE_API_KEY=your_key_here
   PINECONE_API_KEY=your_key_here
   ```

## Running the Application

1. **Start MongoDB**
   ```bash
   # Start MongoDB service if not running
   mongod
   ```

2. **Start Development Server**
   ```bash
   # Start frontend development server
   npm run dev
   ```

3. **Run Data Collection Scripts**
   ```bash
   # Ensure virtual environment is activated
   python scripts/sniffspot_scraper.py
   ```

## Common Development Tasks

### Running Tests
```bash
# Frontend tests
npm test

# Python tests
python -m pytest scripts/tests/
```

### Linting
```bash
# Frontend linting
npm run lint

# Python linting
flake8 scripts/
```

### Building for Production
```bash
npm run build
```

## Git Workflow

1. **Create a New Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

3. **Push Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## Troubleshooting

### Common Issues

1. **Node.js Dependencies Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

2. **Python Virtual Environment Issues**
   ```bash
   # Remove and recreate virtual environment
   deactivate
   rm -rf venv
   python -m venv venv
   ```

3. **MongoDB Connection Issues**
   - Check if MongoDB service is running
   - Verify connection string in `.env`
   - Check MongoDB logs for errors

### Getting Help

- Check existing issues on GitHub
- Join our Discord community
- Review documentation in `/docs`
- Contact maintainers via GitHub discussions
