import logging
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.mock_scraper import MockScraper
from processors.data_cleaner import DataCleaner
from utils.backend_integration import BackendIntegrator

logging.basicConfig(level=logging.INFO)

def test_full_pipeline():
    """Test complete pipeline: scrape -> clean -> send to backend"""
    
    print("🚀 Testing Full Data Pipeline")
    print("=" * 50)
    
    # Initialize components
    scraper = MockScraper()
    cleaner = DataCleaner()
    backend = BackendIntegrator()
    
    # Step 1: Test backend connection
    print("\n1️⃣ Testing backend connection...")
    if not backend.test_backend_connection():
        print("❌ Backend not available. Make sure it's running on localhost:8000")
        return False
    
    # Step 2: Scrape data
    print("\n2️⃣ Scraping mock listings...")
    raw_listings = scraper.scrape_listings()
    print(f"   📊 Scraped: {len(raw_listings)} listings")
    
    # Step 3: Clean data
    print("\n3️⃣ Cleaning data...")
    cleaned_listings = []
    for raw in raw_listings:
        cleaned = cleaner.clean_listing(raw)
        if cleaned:
            cleaned_listings.append(cleaned)
    print(f"   🧹 Cleaned: {len(cleaned_listings)} listings")
    
    # Step 4: Send to backend
    print("\n4️⃣ Sending to backend...")
    success = backend.send_listings(cleaned_listings)
    
    if success:
        print("\n🎉 Pipeline test successful!")
        print("📱 Check your frontend at http://localhost:3000")
        print("   You should see new dynamic listings on the map!")
        return True
    else:
        print("\n❌ Pipeline test failed")
        return False

if __name__ == "__main__":
    test_full_pipeline()
