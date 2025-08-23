from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import json
import os

app = FastAPI(title="Open House Finder API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for now
listings_storage = []

@app.get("/")
def root():
    return {"message": "Open House Finder API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.get("/api/v1/open-houses")
def get_open_houses():
    """Return all listings"""
    return {"open_houses": listings_storage}

@app.post("/api/v1/listings/bulk")
def bulk_upload_listings(data: Dict):
    """Accept bulk listings from data ingestion"""
    global listings_storage
    
    try:
        new_listings = data.get("listings", [])
        
        # Clear old data and add new
        listings_storage.clear()
        
        # Convert format to match frontend expectations
        for listing in new_listings:
            formatted_listing = {
                "id": len(listings_storage) + 1,
                "address": listing.get("address", ""),
                "price": listing.get("price", 0) // 100,  # Convert cents to dollars
                "beds": listing.get("beds", 0),
                "baths": listing.get("baths", 0),
                "latitude": listing.get("latitude", 37.7749),
                "longitude": listing.get("longitude", -122.4194),
                "open_house_time": listing.get("open_house_time", "TBD"),
                "description": listing.get("description", "")
            }
            listings_storage.append(formatted_listing)
        
        return {
            "status": "success",
            "message": f"Added {len(new_listings)} listings",
            "total_listings": len(listings_storage)
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.delete("/api/v1/listings/clear")
def clear_listings():
    """Clear all listings"""
    global listings_storage
    count = len(listings_storage)
    listings_storage.clear()
    return {"message": f"Cleared {count} listings"}

# Export for Vercel
app_handler = app
