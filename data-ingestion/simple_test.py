import logging
import sys
import os
import json

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.mock_scraper import MockScraper
from processors.data_cleaner import DataCleaner

logging.basicConfig(level=logging.INFO)

def simple_test():
    """Simple test without database dependencies"""
    
    print("🚀 Testing Mock Scraper (Simplified)")
    print("=" * 50)
    
    # Test 1: Mock Scraper
    print("\n1️⃣ Testing Mock Scraper...")
    scraper = MockScraper()
    raw_listings = scraper.scrape_listings()
    
    print(f"✅ Generated {len(raw_listings)} raw listings")
    
    # Test 2: Data Cleaner
    print("\n2️⃣ Testing Data Cleaner...")
    cleaner = DataCleaner()
    cleaned_listings = []
    
    for raw in raw_listings:
        cleaned = cleaner.clean_listing(raw)
        if cleaned:
            cleaned_listings.append(cleaned)
    
    print(f"✅ Cleaned {len(cleaned_listings)} listings")
    
    # Test 3: Display Results
    print("\n3️⃣ Sample Results:")
    print("-" * 60)
    
    for i, listing in enumerate(cleaned_listings[:3], 1):
        print(f"\nListing {i}:")
        print(f"  📍 {listing['address']}")
        print(f"  💰 ${listing['price'] / 100:,.0f}")
        print(f"  🏠 {listing['beds']} bed, {listing['baths']} bath")
        print(f"  📅 {listing['open_house_time']}")
        print(f"  🗺️  ({listing['latitude']:.4f}, {listing['longitude']:.4f})")
    
    # Test 4: Save to JSON
    print("\n4️⃣ Saving to JSON...")
    with open('test_listings.json', 'w') as f:
        json.dump(cleaned_listings, f, indent=2)
    
    print(f"💾 Saved to test_listings.json")
    
    print("\n🎉 Mock scraper test successful!")
    return cleaned_listings

if __name__ == "__main__":
    try:
        listings = simple_test()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
