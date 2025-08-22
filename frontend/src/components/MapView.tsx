'use client'

import { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

interface OpenHouse {
  id: number;
  address: string;
  price: number;
  beds: number;
  baths: number;
  latitude: number;
  longitude: number;
  open_house_time: string;
  description: string;
}

export default function MapView() {
  const [viewState, setViewState] = useState({
    longitude: -122.4194,
    latitude: 37.7749,
    zoom: 12
  })
  const [selectedHouse, setSelectedHouse] = useState<OpenHouse | null>(null)
  const [openHouses, setOpenHouses] = useState<OpenHouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch open houses from backend
  useEffect(() => {
    const fetchOpenHouses = async () => {
      try {
        setLoading(true)
        console.log('Fetching open houses from backend...')
        
        const response = await fetch('https://your-backend.railway.app/api/v1/open-houses')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Backend response:', data)
        
        setOpenHouses(data.open_houses || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching open houses:', err)
        setError('Failed to load open houses. Make sure backend is running.')
        // Fallback to empty array if backend is down
        setOpenHouses([])
      } finally {
        setLoading(false)
      }
    }

    fetchOpenHouses()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700">Loading open houses...</div>
          <div className="text-sm text-gray-500 mt-2">Connecting to database...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative">
      {error && (
        <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10 max-w-sm">
          <div className="font-semibold">Backend Error</div>
          <div className="text-sm">{error}</div>
        </div>
      )}
      
      {openHouses.length === 0 && !error && (
        <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-10">
          <div className="font-semibold">No open houses found</div>
          <div className="text-sm">Try creating test data via the API</div>
        </div>
      )}
      
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100%', height: '100%'}}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      >
        {openHouses.map(house => (
          <Marker
            key={house.id}
            longitude={house.longitude}
            latitude={house.latitude}
            onClick={() => setSelectedHouse(house)}
          >
            <div className="bg-blue-500 text-white px-2 py-1 rounded-lg cursor-pointer hover:bg-blue-600 text-sm font-semibold shadow-lg">
              ${(house.price / 1000000).toFixed(1)}M
            </div>
          </Marker>
        ))}

        {selectedHouse && (
          <Popup
            longitude={selectedHouse.longitude}
            latitude={selectedHouse.latitude}
            onClose={() => setSelectedHouse(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-3 min-w-[250px]">
              <h3 className="font-semibold text-lg text-green-600">
                ${(selectedHouse.price / 1000000).toFixed(1)}M
              </h3>
              <p className="text-sm text-gray-600 mb-2">{selectedHouse.address}</p>
              <p className="text-sm mb-2">
                <span className="font-medium">{selectedHouse.beds}</span> bed • 
                <span className="font-medium"> {selectedHouse.baths}</span> bath
              </p>
              <p className="text-sm font-medium text-blue-600 mb-2">
                📅 {selectedHouse.open_house_time}
              </p>
              <p className="text-xs text-gray-500 border-t pt-2">
                {selectedHouse.description}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
