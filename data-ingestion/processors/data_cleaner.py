import re
from typing import Dict, List, Optional
import logging

class DataCleaner:
    """Clean and standardize scraped real estate data"""
    
    def __init__(self):
        self.logger = logging.getLogger(self.__class__.__name__)
    
    def clean_listing(self, raw_listing: Dict) -> Optional[Dict]:
        """Clean and validate a single listing"""
        try:
            cleaned = {
                'source': raw_listing.get('source', '').lower(),
                'address': self._clean_address(raw_listing.get('address', '')),
                'price': self._validate_price(raw_listing.get('price')),
                'beds': self._validate_beds(raw_listing.get('beds')),
                'baths': self._validate_baths(raw_listing.get('baths')),
                'open_house_time': self._clean_open_house_time(raw_listing.get('open_house_time', '')),
                'description': self._clean_description(raw_listing.get('description', '')),
                'latitude': raw_listing.get('latitude'),
                'longitude': raw_listing.get('longitude'),
                'listing_url': raw_listing.get('listing_url', ''),
            }
            
            # Validate required fields
            if not all([cleaned['address'], cleaned['price']]):
                self.logger.warning(f"Missing required fields in listing: {cleaned['address']}")
                return None
            
            return cleaned
            
        except Exception as e:
            self.logger.error(f"Error cleaning listing: {e}")
            return None
    
    def _clean_address(self, address: str) -> str:
        """Standardize address format"""
        if not address:
            return ""
        
        # Remove extra whitespace and standardize
        address = re.sub(r'\s+', ' ', address.strip())
        
        # Add basic formatting improvements
        address = address.title()
        
        return address
    
    def _validate_price(self, price) -> Optional[int]:
        """Validate and ensure price is reasonable"""
        if not price or not isinstance(price, (int, float)):
            return None
        
        # Convert to int if float
        price = int(price)
        
        # Basic sanity check (between $100K and $50M)
        if 10000000 <= price <= 5000000000:  # In cents
            return price
        
        return None
    
    def _validate_beds(self, beds) -> Optional[int]:
        """Validate bedroom count"""
        if beds is None:
            return None
        
        try:
            beds = int(beds)
            return beds if 0 <= beds <= 10 else None
        except (ValueError, TypeError):
            return None
    
    def _validate_baths(self, baths) -> Optional[float]:
        """Validate bathroom count"""
        if baths is None:
            return None
        
        try:
            baths = float(baths)
            return baths if 0 <= baths <= 20 else None
        except (ValueError, TypeError):
            return None
    
    def _clean_open_house_time(self, time_str: str) -> str:
        """Standardize open house time format"""
        if not time_str:
            return ""
        
        # Clean up common formats
        time_str = time_str.strip()
        
        # Convert to standard format if possible
        # This would need more sophisticated parsing for real data
        return time_str
    
    def _clean_description(self, description: str) -> str:
        """Clean property description"""
        if not description:
            return ""
        
        # Remove extra whitespace
        description = re.sub(r'\s+', ' ', description.strip())
        
        # Limit length
        if len(description) > 500:
            description = description[:497] + "..."
        
        return description
