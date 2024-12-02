# 🐾 PawSpace - Sniffspot Data Collection

PawSpace is a Python-based project that scrapes and processes data from Sniffspot listings in Ontario. It automates the collection of pet-friendly space information to help analyze and understand the market better.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Chrome WebDriver for Selenium
- Required Python packages (see requirements.txt)

### Installation
```bash
# Clone the repository
git clone https://github.com/zippety/Pawspace.git
cd Pawspace

# Install dependencies
pip install -r requirements.txt
```

## 📁 Project Structure

```
pawspace/
├── scripts/              # Main scraping scripts
│   ├── sniffspot_scraper.py    # Main scraping logic
│   └── image_converter.py      # Image processing utilities
├── utils/               # Utility functions
│   └── screenshot_watcher.py   # Screenshot monitoring
├── data/               # Scraped data storage
└── requirements.txt    # Python dependencies
```

## 🛠️ Main Components

1. **Sniffspot Scraper**
   - Automates data collection from Sniffspot listings
   - Handles pagination and data extraction
   - Stores results in structured format

2. **Image Processing**
   - Converts and processes listing images
   - Handles screenshot monitoring and conversion

3. **Data Collection**
   - Focuses on Ontario region listings
   - Captures key listing information
   - Stores data for analysis

## 📝 Usage

1. **Running the Scraper**
```python
python scripts/sniffspot_scraper.py
```

2. **Processing Images**
```python
python scripts/image_converter.py
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is for educational purposes only. Please respect Sniffspot's terms of service when using this tool.
