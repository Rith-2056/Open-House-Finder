from .base_scraper import BaseScraper
import random
from typing import List, Dict

class MockScraper(BaseScraper):
    """Generate mock data for testing while building real scrapers"""
    
    MOCK_ADDRESSES = [
        "425 1st St, San Francisco, CA",
        "789 Mission St, San Francisco, CA", 
        "321 Hayes St, San Francisco, CA",
        "654 Irving St, San Francisco, CA",
        "987 Lombard St, San Francisco, CA",
        "147 Geary St, San Francisco, CA",
        "258 Folsom St, San Francisco, CA",
        "369 Bush St, San Francisco, CA"
    ]
    
    MOCK_DESCRIPTIONS = [
        "Stunning modern condo with city views and updated kitchen",
        "Charming Victorian home with original details and garden",
        "Contemporary apartment with hardwood floors and balcony", 
        "Spacious family home with garage and private yard",
        "Luxury penthouse with panoramic bay views",
        "Cozy starter home in quiet residential neighborhood",
        "Historic building converted to modern loft space",
        "Bright and airy unit with in-unit laundry"
    ]
    
    MOCK_TIMES = [
        "Sat 1-4pm", "Sun 2-5pm", "Sat 12-3pm", "Sun 1-4pm",
        "Sat 2-5pm", "Sun 12-3pm", "Sat 11am-2pm", "Sun 3-6pm"
    ]
    
    def scrape_listings(self, location: str = "San Francisco, CA") -> List[Dict]:
        """Generate mock listings for testing"""
        listings = []
        
        for i in range(6):  # Generate 6 mock listings
            listing = {
                'source': 'mock',
                'address': random.choice(self.MOCK_ADDRESSES),
                'price': random.randint(80000000, 200000000),  # $800K - $2M in cents
                'beds': random.randint(1, 4),
                'baths': random.choice([1, 1.5, 2, 2.5, 3]),
                'open_house_time': random.choice(self.MOCK_TIMES),
                'description': random.choice(self.MOCK_DESCRIPTIONS),
                'latitude': round(37.7749 + random.uniform(-0.05, 0.05), 6),
                'longitude': round(-122.4194 + random.uniform(-0.05, 0.05), 6),
                'listing_url': f"https://example.com/listing/{i+1}"
            }
            listings.append(listing)
        
        self.logger.info(f"Generated {len(listings)} mock listings")
        return listings
    
    def parse_listing_details(self, listing_url: str) -> Dict:
        """Mock listing details"""
        return {
            'square_feet': random.randint(800, 3000),
            'year_built': random.randint(1950, 2023),
            'parking': random.choice(['None', '1 space', '2 spaces', 'Garage'])
        }
