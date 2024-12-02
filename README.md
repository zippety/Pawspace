# 🐾 Pawspace

## Overview
Pawspace is a dual-purpose project consisting of:
1. A data collection system for Sniffspot listings in Ontario
2. A web application for visualizing and analyzing the collected data

## 📁 Project Structure
```
pawspace/
├── src/                  # Frontend React/TypeScript application
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components and routing
│   ├── utils/          # Utility functions and helpers
│   └── styles/         # Global styles and themes
├── scripts/             # Python data collection scripts
│   ├── sniffspot_scraper.py
│   └── image_converter.py
├── utils/               # Python utility scripts
└── data/               # Data storage (gitignored)
```

## 🚀 Quick Start

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Data Collection Scripts
```bash
# Install Python dependencies
pip install -r scripts/requirements.txt

# Run the scraper
python scripts/sniffspot_scraper.py
```

## 📚 Documentation
- [Frontend Documentation](./docs/frontend/README.md)
- [Data Collection Documentation](./docs/backend/README.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
- [Code of Conduct](./docs/CODE_OF_CONDUCT.md)

## 🛠️ Tech Stack
- **Frontend**
  - React with TypeScript
  - Vite for build tooling
  - Tailwind CSS for styling
  - Sentry for error tracking

- **Data Collection**
  - Python 3.8+
  - Selenium WebDriver
  - Image processing utilities

## 🤝 Contributing
We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

## 📝 License
This project is for educational purposes only. Please respect Sniffspot's terms of service when using the data collection tools.
