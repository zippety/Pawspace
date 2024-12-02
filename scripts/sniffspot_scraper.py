"""Sniffspot data scraper module.

This module provides functionality to scrape Sniffspot listings in Ontario,
extracting information about available pet-sitting spots including their
details, amenities, and host information.
"""

import json
import os
import time
from datetime import datetime
from typing import Any, Dict, List

import requests
from bs4 import BeautifulSoup


class SniffspotScraper:
    """Scrape and process Sniffspot listings data.

    This class handles the scraping of Sniffspot listings, including basic spot
    information and detailed spot data like amenities and host information.
    """

    def __init__(self):
        """Initialize the SniffspotScraper with base configuration."""
        self.base_url = "https://www.sniffspot.com"
        self.headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/91.0.4472.124 Safari/537.36"
            )
        }
        self.output_dir = "data"
        os.makedirs(self.output_dir, exist_ok=True)

    def get_ontario_spots(self) -> List[Dict[str, Any]]:
        """Scrape all Sniffspot listings in Ontario.

        Returns:
            List[Dict[str, Any]]: List of dictionaries with spot information.
        """
        spots = []
        page = 1
        while True:
            url_params = f"q=Ontario%2C+Canada&page={page}"
            url = f"{self.base_url}/spots/search?{url_params}"
            response = requests.get(url, headers=self.headers)
            if response.status_code != 200:
                break

            soup = BeautifulSoup(response.text, "html.parser")
            listings = soup.find_all("div", class_="spot-card")

            if not listings:
                break

            for listing in listings:
                try:
                    spot_data = self._parse_listing(listing)
                    spots.append(spot_data)
                except AttributeError as e:
                    print(f"Error parsing listing: {e}")
                    continue

            page += 1
            time.sleep(1)  # Be nice to their servers

        return spots

    def _parse_listing(self, listing: BeautifulSoup) -> Dict[str, Any]:
        """Parse a single Sniffspot listing.

        Args:
            listing: BeautifulSoup object representing a spot listing.

        Returns:
            Dict[str, Any]: Dictionary with parsed spot information.
        """
        rating_div = listing.find("div", class_="rating")
        rating = rating_div.text.strip() if rating_div else None

        features = []
        for feature in listing.find_all("div", class_="feature"):
            features.append(feature.text.strip())

        return {
            "title": listing.find("h3").text.strip(),
            "price": listing.find("div", class_="price").text.strip(),
            "location": listing.find("div", class_="location").text.strip(),
            "rating": rating,
            "features": features,
            "url": self.base_url + listing.find("a")["href"],
        }

    def get_spot_details(self, url: str) -> Dict[str, Any]:
        """Scrape detailed information for a specific spot.

        Args:
            url: URL of the spot to scrape details from.

        Returns:
            Dict[str, Any]: Dictionary with detailed spot information.
        """
        response = requests.get(url, headers=self.headers)
        if response.status_code != 200:
            return {}

        soup = BeautifulSoup(response.text, "html.parser")
        description = soup.find("div", class_="description").text.strip()

        amenities = []
        for amenity in soup.find_all("div", class_="amenity"):
            amenities.append(amenity.text.strip())

        rules = []
        for rule in soup.find_all("div", class_="rule"):
            rules.append(rule.text.strip())

        photos = []
        for img in soup.find_all("img", class_="spot-photo"):
            photos.append(img["src"])

        return {
            "description": description,
            "amenities": amenities,
            "rules": rules,
            "photos": photos,
            "host_info": self._parse_host_info(soup),
        }

    def _parse_host_info(self, soup: BeautifulSoup) -> Dict[str, Any]:
        """Parse host information from a spot's page.

        Args:
            soup: BeautifulSoup object of the spot's page.

        Returns:
            Dict[str, Any]: Dictionary with host information.
        """
        response_div = soup.find("div", class_="response-rate")
        response_rate = response_div.text.strip() if response_div else None

        return {
            "name": soup.find("div", class_="host-name").text.strip(),
            "joined": soup.find("div", class_="host-joined").text.strip(),
            "response_rate": response_rate,
        }

    def save_data(self, data: List[Dict[str, Any]], filename: str) -> None:
        """Save scraped data to a JSON file.

        Args:
            data: List of dictionaries with spot information.
            filename: Base name for the output file.
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = os.path.join(
            self.output_dir, f"{filename}_{timestamp}.json"
        )
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Data saved to {filepath}")


def main() -> None:
    """Run the Sniffspot scraper to collect Ontario listings."""
    scraper = SniffspotScraper()

    # Get all spots in Ontario
    print("Scraping Sniffspot listings in Ontario...")
    spots = scraper.get_ontario_spots()
    print(f"Found {len(spots)} spots")

    # Save basic spot data
    scraper.save_data(spots, "ontario_spots")

    # Get detailed information for each spot
    print("Scraping detailed information for each spot...")
    for spot in spots:
        time.sleep(2)  # Be nice to their servers
        details = scraper.get_spot_details(spot["url"])
        spot["details"] = details

    # Save detailed spot data
    scraper.save_data(spots, "ontario_spots_detailed")


if __name__ == "__main__":
    main()
