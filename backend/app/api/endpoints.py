from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.database import Listing, OpenHouse, Source

router = APIRouter()

@router.get("/open-houses")
async def get_open_houses(db: Session = Depends(get_db)):
    """Get all open house listings from database"""
    # Query listings that have open houses
    listings_with_open_houses = (
        db.query(Listing)
        .join(OpenHouse)
        .all()
    )
    
    # Format response similar to mock data
    result = []
    for listing in listings_with_open_houses:
        for open_house in listing.open_houses:
            result.append({
                "id": listing.id,
                "address": listing.address,
                "price": listing.price,
                "beds": listing.beds,
                "baths": listing.baths,
                "latitude": listing.latitude,
                "longitude": listing.longitude,
                "open_house_time": f"{open_house.start_time.strftime('%a %I-%p')}", # Sat 1-4pm format
                "description": listing.description
            })
    
    return {"open_houses": result}

@router.get("/open-houses/{house_id}")
async def get_open_house(house_id: int, db: Session = Depends(get_db)):
    """Get a specific open house by listing ID"""
    listing = db.query(Listing).filter(Listing.id == house_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Open house not found")
    
    # Format single listing response
    open_house = listing.open_houses[0] if listing.open_houses else None
    return {
        "id": listing.id,
        "address": listing.address,
        "price": listing.price,
        "beds": listing.beds,
        "baths": listing.baths,
        "latitude": listing.latitude,
        "longitude": listing.longitude,
        "open_house_time": f"{open_house.start_time.strftime('%a %I-%p')}" if open_house else "TBD",
        "description": listing.description
    }

@router.post("/test-data")
async def create_test_data(db: Session = Depends(get_db)):
    """Create some test data to see if everything works"""
    # Create a source
    source = Source(name="manual", base_url="localhost")
    db.add(source)
    db.commit()
    db.refresh(source)
    
    # Create test listings
    listing1 = Listing(
        address="123 Market St, San Francisco, CA",
        city="San Francisco",
        state="CA",
        price=1200000,
        beds=2,
        baths=2,
        latitude=37.7749,
        longitude=-122.4194,
        description="Beautiful downtown condo with city views",
        source_id=source.id
    )
    
    listing2 = Listing(
        address="456 Valencia St, San Francisco, CA", 
        city="San Francisco",
        state="CA",
        price=950000,
        beds=1,
        baths=1,
        latitude=37.7849,
        longitude=-122.4094,
        description="Charming Mission district apartment",
        source_id=source.id
    )
    
    db.add_all([listing1, listing2])
    db.commit()
    db.refresh(listing1)
    db.refresh(listing2)
    
    # Create open houses
    from datetime import datetime, timedelta
    
    open_house1 = OpenHouse(
        listing_id=listing1.id,
        start_time=datetime.now() + timedelta(days=1, hours=13),  # Tomorrow 1pm
        end_time=datetime.now() + timedelta(days=1, hours=16)     # Tomorrow 4pm
    )
    
    open_house2 = OpenHouse(
        listing_id=listing2.id,
        start_time=datetime.now() + timedelta(days=2, hours=14),  # Day after 2pm
        end_time=datetime.now() + timedelta(days=2, hours=17)     # Day after 5pm
    )
    
    db.add_all([open_house1, open_house2])
    db.commit()
    
    return {"message": "Test data created successfully!"}
