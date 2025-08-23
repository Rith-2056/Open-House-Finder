import logging
import sys
import os
from typing import List, Dict

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.mock_scraper import MockScraper
from processors.data_cleaner import DataCleaner

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def test_mock_scraper():
    """Test the mock scraper and data cleaning pipeline"""
    
    print("🔄 Starting Mock Scraper Test...")
    
    # Initialize components
    scraper = MockScraper()
    cleaner = DataCleaner()
    
    # Scrape mock data
    print("\n📊 Scraping mock listings...")
    raw_listings = scraper.scrape_listings("San Francisco, CA")
    
    print(f"✅ Scraped {len(raw_listings)} raw listings")
    
    # Clean the data
    print("\n🧹 Cleaning scraped data...")
    cleaned_listings = []
    
    for raw_listing in raw_listings:
        cleaned = cleaner.clean_listing(raw_listing)
        if cleaned:
            cleaned_listings.append(cleaned)
    
    print(f"✅ Cleaned {len(cleaned_listings)} listings")
    
    # Display results
    print("\n📋 Sample Cleaned Listings:")
    print("=" * 80)
    
    for i, listing in enumerate(cleaned_listings[:3], 1):
        print(f"\nListing {i}:")
        print(f"  Address: {listing['address']}")
        print(f"  Price: ${listing['price'] / 100:,.0f}")
        print(f"  Beds/Baths: {listing['beds']} bed, {listing['baths']} bath")
        print(f"  Open House: {listing['open_house_time']}")
        print(f"  Location: ({listing['latitude']}, {listing['longitude']})")
        print(f"  Description: {listing['description'][:60]}...")
    
    return cleaned_listings

def save_to_json(listings: List[Dict], filename: str = "mock_listings.json"):
    """Save listings to JSON file for inspection"""
    import json
    
    with open(filename, 'w') as f:
        json.dump(listings, f, indent=2)
    
    print(f"\n💾 Saved {len(listings)} listings to {filename}")

if __name__ == "__main__":
    try:
        # Test the scraper
        listings = test_mock_scraper()
        
        # Save results
        save_to_json(listings)
        
        print("\n🎉 Mock scraper test completed successfully!")
        print(f"📁 Check 'mock_listings.json' for full results")
        
    except Exception as e:
        print(f"\n❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
