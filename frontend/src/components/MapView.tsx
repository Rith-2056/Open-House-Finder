'use client'

import { useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

// Complete mock data - no backend needed!
const MOCK_OPEN_HOUSES = [
  {
    id: 1,
    address: "123 Market St, San Francisco, CA",
    price: 1200000,
    beds: 2,
    baths: 2,
    latitude: 37.7749,
    longitude: -122.4194,
    open_house_time: "Sat 1-4pm",
    description: "Beautiful downtown condo with city views"
  },
  {
    id: 2,
    address: "456 Valencia St, San Francisco, CA",
    price: 950000,
    beds: 1,
    baths: 1,
    latitude: 37.7849,
    longitude: -122.4094,
    open_house_time: "Sun 2-5pm",
    description: "Charming Mission district apartment"
  },
  {
    id: 3,
    address: "789 Castro St, San Francisco, CA",
    price: 1450000,
    beds: 3,
    baths: 2,
    latitude: 37.7609,
    longitude: -122.4350,
    open_house_time: "Sat 2-5pm",
    description: "Spacious Castro district home"
  },
  {
    id: 4,
    address: "321 Fillmore St, San Francisco, CA",
    price: 875000,
    beds: 1,
    baths: 1,
    latitude: 37.7849,
    longitude: -122.4324,
    open_house_time: "Sun 1-3pm",
    description: "Modern Fillmore apartment"
  }
]

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

  return (
    <div className="w-full h-screen relative">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{width: '100%', height: '100%'}}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      >
        {MOCK_OPEN_HOUSES.map(house => (
          <Marker
            key={house.id}
            longitude={house.longitude}
            latitude={house.latitude}
            onClick={() => setSelectedHouse(house)}
          >
            <div className="bg-blue-500 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-600 text-sm font-semibold shadow-lg transform hover:scale-105 transition-all">
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
            <div className="p-4 min-w-[280px]">
              <h3 className="font-bold text-xl text-green-600 mb-2">
                ${(selectedHouse.price / 1000000).toFixed(1)}M
              </h3>
              <p className="text-sm text-gray-700 mb-3 font-medium">{selectedHouse.address}</p>
              <div className="flex items-center gap-4 mb-3">
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                  🛏️ {selectedHouse.beds} bed
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                  🚿 {selectedHouse.baths} bath
                </span>
              </div>
              <p className="text-sm font-semibold text-blue-600 mb-2 bg-blue-50 px-2 py-1 rounded">
                📅 {selectedHouse.open_house_time}
              </p>
              <p className="text-xs text-gray-600 border-t pt-2">
                {selectedHouse.description}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
