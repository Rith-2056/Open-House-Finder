"""
Script to create all database tables in Supabase
Run this once to set up your database schema
"""
from app.core.database import engine
from app.models.database import Base

def create_tables():
    """Create all tables defined in our models"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

if __name__ == "__main__":
    create_tables()
