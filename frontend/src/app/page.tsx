'use client'

import { useState } from 'react'
import MapView from '@/components/MapView'
import FilterPanel from '@/components/FilterPanel'
import ListingCards from '@/components/ListingCards'

// Move mock data here so both components can access it
const ALL_OPEN_HOUSES = [
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

interface FilterState {
  priceRange: [number, number];
  beds: number | null;
  timeFilter: 'all' | 'today' | 'weekend' | 'open-now';
}

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

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000000],
    beds: null,
    timeFilter: 'all'
  })
  
  const [selectedHouse, setSelectedHouse] = useState<OpenHouse | null>(null)

  // Filter houses based on current filters
  const filteredHouses = ALL_OPEN_HOUSES.filter(house => {
    // Price filter
    if (house.price < filters.priceRange[0] || house.price > filters.priceRange[1]) {
      return false;
    }

    // Beds filter
    if (filters.beds !== null && house.beds !== filters.beds) {
      return false;
    }

    // Time filter (simplified for demo)
    if (filters.timeFilter === 'weekend' && !house.open_house_time.includes('Sat') && !house.open_house_time.includes('Sun')) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Open House Finder</h1>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Save Search
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                My Saved
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Filters + Map */}
      <main className="flex-1 flex">
        {/* Sidebar with Filters & Listings */}
        <div className="w-96 bg-gray-50 flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b bg-white">
            <FilterPanel onFiltersChange={setFilters} />
          </div>
          
          {/* Listing Cards */}
          <div className="flex-1 p-4 overflow-hidden">
            <ListingCards 
              houses={filteredHouses}
              onHouseSelect={setSelectedHouse}
              selectedHouse={selectedHouse}
            />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1">
          <MapView 
            filters={filters} 
            selectedHouse={selectedHouse}
            onHouseSelect={setSelectedHouse}
            houses={filteredHouses}
          />
        </div>
      </main>
    </div>
  )
}
