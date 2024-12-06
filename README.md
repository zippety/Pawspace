# 🐾 PawSpace

## Vision
PawSpace is revolutionizing pet care spaces by creating an ecosystem where pet owners can find and book various pet-friendly spaces:

- 🏡 **Yard Rentals**: Like Airbnb for dog parks - rent private yards for your dogs to play
- 🏕️ **Dog Camps**: Overnight adventures and day camps for dogs
- 🌳 **Dog Paradise**: A dedicated space combining play areas, wildlife center, and animal sanctuary
- 😺 **Cat Cafes**: Cozy spaces for cat lovers and adoptable cats
- 🦮 **Senior Integration**: Programs connecting seniors with animal companionship

## 🚀 Current Features

### Data Collection System
- 📊 Sniffspot listings data in Ontario
- 🖼️ Automated image processing
- 📍 Geolocation mapping
- 💰 Price analysis

### Web Application
- 🗺️ Interactive map visualization
- 📱 Responsive design
- 📊 Data analytics dashboard
- 🔍 Advanced search features

## 🛠️ Tech Stack

### Frontend
- ⚛️ React with TypeScript
- 🏃‍♂️ Vite for fast builds
- 🎨 Tailwind CSS
- 🗺️ Mapbox for visualization

### Backend
- 🐍 Python for data collection
- 🤖 AI-powered matching system
- 🗄️ MongoDB database
- 📊 Analytics engine

### AI Components
- 🧠 HuggingFace models
- 🔍 Vector search (Pinecone)
- 📈 Recommendation system
- 🛡️ Safety analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB
- Git

### Development Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/pawspace.git
cd pawspace

# Install frontend dependencies
npm install

# Install Python dependencies
pip install -r scripts/requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

### Running Data Collection
```bash
# Activate virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Run the scraper
python scripts/sniffspot_scraper.py
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Development Guidelines
- Write clean, documented code
- Follow the existing code style
- Add tests for new features
- Update documentation

## 📚 Documentation
- [Setup Guide](./docs/setup.md)
- [API Documentation](./docs/api.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
- [AI Integration Guide](./docs/ai.md)

## 🗺️ Roadmap

### Phase 1: Foundation
- [x] Basic data collection
- [x] Web visualization
- [ ] User authentication
- [ ] Basic booking system

### Phase 2: Space Management
- [ ] Yard space listings
- [ ] Booking management
- [ ] Payment integration
- [ ] Review system

### Phase 3: Camp Features
- [ ] Camp space management
- [ ] Activity scheduling
- [ ] Staff management
- [ ] Weather integration

### Phase 4: Paradise & Sanctuary
- [ ] Multi-space management
- [ ] Animal tracking
- [ ] Veterinary integration
- [ ] Senior programs

## 🐛 Known Issues
1. Data collection needs rate limiting
2. Map visualization performance with large datasets
3. Mobile responsiveness improvements needed

## 🤝 Support
- 📧 Email: support@pawspace.com
- 💬 Discord: [Join our community](https://discord.gg/pawspace)
- 🐦 Twitter: [@pawspace](https://twitter.com/pawspace)

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
