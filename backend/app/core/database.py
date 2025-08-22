from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create database engine
# echo=True shows SQL queries in console (helpful for debugging)
engine = create_engine(
    settings.database_url,
    echo=settings.debug,  # Show SQL queries in development
    pool_pre_ping=True    # Verify connections before use
)

# Create session factory
# Sessions handle database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency to get database session
def get_db():
    """
    Provides database session to API endpoints
    Ensures connection is properly closed after use
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
