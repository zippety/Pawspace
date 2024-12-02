# 🐾 PawSpace - Find Pet-Friendly Spaces

PawSpace is a modern web application that helps pet owners discover and book pet-friendly spaces. Inspired by Sniffspot, it provides a seamless experience for finding the perfect spot for your furry friends.

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/pawspace.git
cd pawspace

# Install dependencies
npm install

# Create .env file (for local development)
cp .env.example .env
```

### 2. Start Development Server
```bash
# Run both client and server
npm run dev
```

Visit http://localhost:5173 to see the application running!

## 🏗️ Project Structure

```
pawspace/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── server/           # Backend server code
│   ├── styles/           # Global styles and themes
│   └── utils/            # Utility functions
├── public/               # Static assets
├── docs/                 # Documentation
└── scripts/             # Build and setup scripts
```

## 🎯 Key Features

- 🗺️ Interactive map with Leaflet integration
- 🔍 Advanced search and filtering
- 📸 Image carousels and galleries
- ⭐ Reviews and ratings system
- 📱 Responsive design

## 🛠️ Technology Stack

- **Frontend**
  - React 18 with TypeScript
  - Vite for blazing fast builds
  - Leaflet for maps
  - Tailwind CSS for styling

- **Backend**
  - Node.js with Express
  - MongoDB with Mongoose
  - TypeScript for type safety

## 📚 Documentation

Detailed documentation is available in the `/docs` directory:

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Component Guide](./docs/COMPONENTS.md)
- [API Documentation](./docs/API.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 📸 Screenshot Watcher

The project includes a utility script that automatically processes screenshots for the application. To use it:

1. Install Python dependencies:
```bash
pip install watchdog Pillow
```

2. Run the screenshot watcher:
```bash
# From the project root
python utils/screenshot_watcher.py
```

The script will:
- Monitor your Screenshots folder (`C:\Users\[username]\Pictures\Screenshots`)
- Automatically convert new screenshots to JPEG format
- Save processed images to the project's screenshots directory
- Create base64 versions when needed

Keep this script running while taking screenshots for the project.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- components
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

## 📝 Code Style

We use ESLint and Prettier to maintain code quality. Run:

```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Sniffspot](https://www.sniffspot.com/) for inspiration
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- All our contributors!
