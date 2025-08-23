from abc import ABC, abstractmethod
import requests
from bs4 import BeautifulSoup
import time
import random
from fake_useragent import UserAgent
import logging
from typing import List, Dict, Optional

class BaseScraper(ABC):
    """Base class for all real estate scrapers"""
    
    def __init__(self, delay_range=(1, 3)):
        self.delay_range = delay_range
        self.ua = UserAgent()
        self.session = requests.Session()
        self.logger = logging.getLogger(self.__class__.__name__)
        
        # Set up headers to look like a real browser
        self.session.headers.update({
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
    
    def get_page(self, url: str) -> Optional[BeautifulSoup]:
        """Get and parse a web page with error handling"""
        try:
            self.logger.info(f"Fetching: {url}")
            
            # Random delay to be respectful
            delay = random.uniform(*self.delay_range)
            time.sleep(delay)
            
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            return BeautifulSoup(response.content, 'html.parser')
            
        except requests.RequestException as e:
            self.logger.error(f"Error fetching {url}: {e}")
            return None
    
    @abstractmethod
    def scrape_listings(self, location: str) -> List[Dict]:
        """Scrape listings for a given location"""
        pass
    
    @abstractmethod
    def parse_listing_details(self, listing_url: str) -> Dict:
        """Parse detailed information from a listing page"""
        pass
    
    def normalize_price(self, price_str: str) -> Optional[int]:
        """Convert price string to integer (in cents)"""
        try:
            # Remove $ and commas, convert to int
            price_clean = price_str.replace('$', '').replace(',', '').strip()
            return int(float(price_clean) * 100)  # Store in cents
        except (ValueError, AttributeError):
            return None
    
    def normalize_address(self, address_str: str) -> str:
        """Clean and normalize address"""
        return address_str.strip() if address_str else ""
