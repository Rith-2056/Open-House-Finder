from fastapi import APIRouter

router = APIRouter()

# Mock data that matches your database structure
MOCK_OPEN_HOUSES = [
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
    },
    {
        "id": 2,
        "address": "456 Valencia St, San Francisco, CA",
        "price": 950000,
        "beds": 1,
        "baths": 1,
        "latitude": 37.7849,
        "longitude": -122.4094,
        "open_house_time": "Sun 2-5pm",
        "description": "Charming Mission district apartment"
    }
]

@router.get("/open-houses")
async def get_open_houses():
    """Get all open house listings"""
    return {"open_houses": MOCK_OPEN_HOUSES}

@router.get("/open-houses/{house_id}")
async def get_open_house(house_id: int):
    """Get a specific open house by ID"""
    house = next((h for h in MOCK_OPEN_HOUSES if h["id"] == house_id), None)
    if not house:
        return {"error": "Open house not found"}
    return house

@router.post("/test-data")
async def create_test_data():
    """Mock test data creation"""
    return {"message": "Test data created successfully! (using mock data)"}
