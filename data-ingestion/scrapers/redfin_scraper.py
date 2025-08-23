from .base_scraper import BaseScraper
import re
from typing import List, Dict
from urllib.parse import urljoin, quote

class RedfinScraper(BaseScraper):
    """Scraper for Redfin open house listings"""
    
    BASE_URL = "https://www.redfin.com"
    
    def __init__(self):
        super().__init__(delay_range=(2, 4))  # Be extra respectful
    
    def scrape_listings(self, location: str = "San Francisco, CA") -> List[Dict]:
        """Scrape open house listings from Redfin"""
        listings = []
        
        # Build search URL for open houses
        search_url = self._build_search_url(location)
        
        soup = self.get_page(search_url)
        if not soup:
            return listings
        
        # Find listing containers (this will need adjustment based on actual HTML)
        listing_containers = soup.find_all('div', class_='HomeCard')
        
        for container in listing_containers[:10]:  # Limit to 10 for testing
            try:
                listing_data = self._parse_listing_container(container)
                if listing_data:
                    listings.append(listing_data)
            except Exception as e:
                self.logger.error(f"Error parsing listing: {e}")
                continue
        
        self.logger.info(f"Scraped {len(listings)} listings from {location}")
        return listings
    
    def _build_search_url(self, location: str) -> str:
        """Build Redfin search URL for open houses"""
        # This is a simplified example - real URL would be more complex
        encoded_location = quote(location)
        return f"{self.BASE_URL}/city/{encoded_location}/filter/include=open-house"
    
    def _parse_listing_container(self, container) -> Dict:
        """Parse individual listing from HTML container"""
        # This is example parsing - would need to match actual Redfin HTML
        try:
            # Price
            price_elem = container.find('span', class_='price')
            price = self.normalize_price(price_elem.text) if price_elem else None
            
            # Address
            address_elem = container.find('div', class_='address')
            address = address_elem.text.strip() if address_elem else ""
            
            # Beds/Baths
            stats_elem = container.find('div', class_='stats')
            beds, baths = self._parse_bed_bath(stats_elem.text) if stats_elem else (None, None)
            
            # Open house time
            oh_elem = container.find('div', class_='open-house-time')
            open_house_time = oh_elem.text.strip() if oh_elem else ""
            
            # Listing URL for details
            link_elem = container.find('a', href=True)
            listing_url = urljoin(self.BASE_URL, link_elem['href']) if link_elem else ""
            
            return {
                'source': 'redfin',
                'price': price,
                'address': address,
                'beds': beds,
                'baths': baths,
                'open_house_time': open_house_time,
                'listing_url': listing_url,
                'description': "",  # Will fill from detail page
                'latitude': None,   # Will geocode later
                'longitude': None,
            }
            
        except Exception as e:
            self.logger.error(f"Error parsing listing container: {e}")
            return None
    
    def _parse_bed_bath(self, stats_text: str) -> tuple:
        """Extract beds/baths from stats string like '2 beds, 1 bath'"""
        beds_match = re.search(r'(\d+)\s*bed', stats_text.lower())
        baths_match = re.search(r'(\d+(?:\.\d+)?)\s*bath', stats_text.lower())
        
        beds = int(beds_match.group(1)) if beds_match else None
        baths = float(baths_match.group(1)) if baths_match else None
        
        return beds, baths
    
    def parse_listing_details(self, listing_url: str) -> Dict:
        """Get additional details from listing page"""
        soup = self.get_page(listing_url)
        if not soup:
            return {}
        
        # Extract description, more details, etc.
        # This would be implemented based on actual Redfin page structure
        return {
            'description': 'Beautiful property with modern amenities',  # Placeholder
            'square_feet': None,
            'year_built': None,
        }
