'use client'

import { useState } from 'react'

interface FilterProps {
  onFiltersChange: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  beds: number | null;
  timeFilter: 'all' | 'today' | 'weekend' | 'open-now';
}

export default function FilterPanel({ onFiltersChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000000],
    beds: null,
    timeFilter: 'all'
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      <h3 className="font-semibold text-lg">Filters</h3>
      
      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium mb-2">Price Range</label>
        <div className="flex gap-2">
          <select 
            className="border rounded px-2 py-1 text-sm"
            value={filters.priceRange[0]}
            onChange={(e) => handleFilterChange({
              priceRange: [Number(e.target.value), filters.priceRange[1]]
            })}
          >
            <option value={0}>Any</option>
            <option value={500000}>$500K+</option>
            <option value={1000000}>$1M+</option>
            <option value={1500000}>$1.5M+</option>
          </select>
          <span className="self-center">to</span>
          <select 
            className="border rounded px-2 py-1 text-sm"
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange({
              priceRange: [filters.priceRange[0], Number(e.target.value)]
            })}
          >
            <option value={2000000}>Any</option>
            <option value={1000000}>$1M</option>
            <option value={1500000}>$1.5M</option>
            <option value={2000000}>$2M</option>
          </select>
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-sm font-medium mb-2">Bedrooms</label>
        <div className="flex gap-2">
          {[null, 1, 2, 3, 4].map(bed => (
            <button
              key={bed || 'any'}
              className={`px-3 py-1 rounded text-sm ${
                filters.beds === bed 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange({ beds: bed })}
            >
              {bed || 'Any'}
            </button>
          ))}
        </div>
      </div>

      {/* Time Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Open House Time</label>
        <select 
          className="border rounded px-2 py-1 text-sm w-full"
          value={filters.timeFilter}
          onChange={(e) => handleFilterChange({ 
            timeFilter: e.target.value as FilterState['timeFilter'] 
          })}
        >
          <option value="all">All Times</option>
          <option value="open-now">Open Now</option>
          <option value="today">Today</option>
          <option value="weekend">This Weekend</option>
        </select>
      </div>
    </div>
  )
}
