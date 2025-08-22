from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Source(Base):
    """Track where listing data comes from (Zillow, Redfin, etc.)"""
    __tablename__ = "sources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)  # "zillow", "redfin"
    base_url = Column(String)
    last_scraped = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class Listing(Base):
    """Property information - the main listing data"""
    __tablename__ = "listings"
    
    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, index=True)
    city = Column(String, index=True)
    state = Column(String, index=True)
    zip_code = Column(String, index=True)
    price = Column(Integer)  # Store in cents to avoid float issues
    beds = Column(Integer)
    baths = Column(Float)  # 1.5 baths possible
    square_feet = Column(Integer)
    latitude = Column(Float, index=True)  # For map queries
    longitude = Column(Float, index=True)
    description = Column(Text)
    source_id = Column(Integer, ForeignKey("sources.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    source = relationship("Source")
    open_houses = relationship("OpenHouse", back_populates="listing")

class OpenHouse(Base):
    """Open house events - when you can visit the property"""
    __tablename__ = "open_houses"
    
    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    start_time = Column(DateTime, index=True)
    end_time = Column(DateTime, index=True)
    status = Column(String, default="scheduled")  # scheduled, cancelled, completed
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    listing = relationship("Listing", back_populates="open_houses")
