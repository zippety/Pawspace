# Data Collection Documentation

## Overview
The data collection system is built in Python and is responsible for gathering information about pet-friendly spaces from Sniffspot. It includes web scraping capabilities and image processing utilities.

## Getting Started

### Prerequisites
- Python 3.8+
- Chrome WebDriver
- Virtual Environment (recommended)

### Installation
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r scripts/requirements.txt
```

## Components

### 1. Sniffspot Scraper
Located in `scripts/sniffspot_scraper.py`

#### Features
- Automated data collection from Sniffspot listings
- Pagination handling
- Data extraction and storage
- Rate limiting and retry logic

#### Usage
```bash
python scripts/sniffspot_scraper.py
```

#### Configuration
Environment variables:
- `CHROME_DRIVER_PATH`: Path to Chrome WebDriver
- `DATA_DIR`: Directory for storing scraped data
- `MAX_PAGES`: Maximum number of pages to scrape

### 2. Image Processing
Located in `scripts/image_converter.py`

#### Features
- Image format conversion
- Resizing and optimization
- Metadata extraction

#### Usage
```bash
python scripts/image_converter.py
```

### 3. Screenshot Watcher
Located in `utils/screenshot_watcher.py`

#### Features
- Monitors screenshot directory
- Automatic image processing
- File organization

#### Usage
```bash
python utils/screenshot_watcher.py
```

## Data Storage

### Directory Structure
```
data/
├── raw/                 # Raw scraped data
├── processed/           # Processed data
└── images/             # Processed images
```

### Data Formats
- Listing data: JSON format
- Images: JPEG/PNG
- Metadata: YAML

## Error Handling
- Automatic retries for failed requests
- Logging to `logs/scraper.log`
- Error reporting via console

## Best Practices
1. Always use the virtual environment
2. Respect rate limits
3. Check logs regularly
4. Back up data directory
5. Update Chrome WebDriver regularly

## Troubleshooting
Common issues and solutions:
1. WebDriver errors: Update Chrome and WebDriver
2. Rate limiting: Adjust sleep intervals
3. Data parsing errors: Check site structure changes
