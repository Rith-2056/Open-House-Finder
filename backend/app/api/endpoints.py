from fastapi import APIRouter
import sys
import os
import random

router = APIRouter()

def get_dynamic_mock_data():
    """Get fresh mock data from the scraper"""
    try:
        # Add the data-ingestion directory to path
        ingestion_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data-ingestion')
        if ingestion_path not in sys.path:
            sys.path.append(ingestion_path)
        
        from scrapers.mock_scraper import MockScraper
        from processors.data_cleaner import DataCleaner
        
        # Generate fresh mock data
        scraper = MockScraper()
        raw_data = scraper.scrape()
        
        # Clean the data
        cleaner = DataCleaner()
        cleaned_data = cleaner.clean_listings(raw_data)
        
        # Convert to API format
        formatted_data = []
        for i, listing in enumerate(cleaned_data[:10]):  # Limit to 10 for performance
            formatted_data.append({
                "id": i + 1,
                "address": listing.get('address', 'Unknown Address'),
                "price": listing.get('price', 0),
                "beds": listing.get('beds', 1),
                "baths": listing.get('baths', 1),
                "latitude": listing.get('latitude', 37.7749 + random.uniform(-0.1, 0.1)),
                "longitude": listing.get('longitude', -122.4194 + random.uniform(-0.1, 0.1)),
                "open_house_time": listing.get('open_house_time', 'TBD'),
                "description": listing.get('description', 'Beautiful property')
            })
        
        return formatted_data
        
    except Exception as e:
        print(f"Error getting dynamic data: {e}")
        # Fallback to static data if scraper fails
        return [
            {
                "id": 1,
                "address": "123 Market St, San Francisco, CA",
                "price": 1200000,
                "beds": 2,
                "baths": 2,
                "latitude": 37.7749,
                "longitude": -122.4194,
                "open_house_time": "Sat 1-4pm",
                "description": "Beautiful downtown condo with city views"
            }
        ]

@router.get("/")
def read_root():
    return {"message": "Open House Finder API", "status": "active"}

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "open-house-api"}

@router.get("/open-houses")
def get_open_houses():
    """Get current open house listings with fresh mock data"""
    houses = get_dynamic_mock_data()
    return {"open_houses": houses}

@router.post("/test-data")
def create_test_data():
    """Endpoint to refresh mock data"""
    houses = get_dynamic_mock_data()
    return {
        "message": "Dynamic test data generated successfully!",
        "count": len(houses)
    }
