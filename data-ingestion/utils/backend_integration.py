import requests
import json
from typing import List, Dict
import logging

class BackendIntegrator:
    """Send scraped data to the backend API"""
    
    def __init__(self, backend_url: str = "http://localhost:8000"):
        self.backend_url = backend_url.rstrip('/')
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def send_listings(self, listings: List[Dict]) -> bool:
        """Send listings to backend API"""
        try:
            url = f"{self.backend_url}/api/v1/listings/bulk"
            
            # Format data for API
            payload = {
                "listings": listings,
                "source": "data-ingestion"
            }
            
            response = requests.post(
                url, 
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                self.logger.info(f"✅ Successfully sent {len(listings)} listings to backend")
                return True
            else:
                self.logger.error(f"❌ Backend returned {response.status_code}: {response.text}")
                return False
                
        except requests.RequestException as e:
            self.logger.error(f"❌ Failed to send data to backend: {e}")
            return False
    
    def test_backend_connection(self) -> bool:
        """Test if backend is reachable"""
        try:
            response = requests.get(f"{self.backend_url}/health", timeout=5)
            if response.status_code == 200:
                self.logger.info("✅ Backend connection successful")
                return True
            else:
                self.logger.error(f"❌ Backend health check failed: {response.status_code}")
                return False
        except requests.RequestException as e:
            self.logger.error(f"❌ Cannot reach backend: {e}")
            return False
