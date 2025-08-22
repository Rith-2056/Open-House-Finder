from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Open House Finder API",
    description="API for finding and managing open house listings",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Open House Finder API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/v1/open-houses")
def get_open_houses():
    return {
        "open_houses": [
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
    }

# Simple export for Vercel
app_handler = app
