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

  const [isExpanded, setIsExpanded] = useState(true)

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const clearFilters = () => {
    const resetFilters = {
      priceRange: [0, 2000000] as [number, number],
      beds: null,
      timeFilter: 'all' as const
    }
    setFilters(resetFilters)
    onFiltersChange(resetFilters)
  }

  const hasActiveFilters = filters.beds !== null || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 2000000 || 
    filters.timeFilter !== 'all'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 rounded-t-xl transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-3">
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              Active
            </span>
          )}
        </h3>
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearFilters()
              }}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"
            >
              Clear all
            </button>
          )}
          <svg 
            className={`w-5 h-5 transition-transform duration-200 text-gray-600 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 space-y-6">
          
          {/* Price Range */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800">
              Price Range
            </label>
            <div className="flex gap-3 items-center">
              <select 
                className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              <span className="text-gray-500 text-sm font-medium">to</span>
              <select 
                className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange({
                  priceRange: [filters.priceRange[0], Number(e.target.value)]
                })}
              >
                <option value={2000000}>Any</option>
                <option value={1000000}>$1M</option>
                <option value={1500000}>$1.5M</option>
                <option value={2000000}>$2M+</option>
              </select>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800">
              Bedrooms
            </label>
            <div className="flex gap-2 flex-wrap">
              {[null, 1, 2, 3, 4].map(bed => (
                <button
                  key={bed || 'any'}
                  className={`px-5 py-3 rounded-lg text-sm font-bold transition-all transform hover:scale-105 ${
                    filters.beds === bed 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => handleFilterChange({ beds: bed })}
                >
                  {bed || 'Any'}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800">
              Open House Time
            </label>
            <select 
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
      </div>
    </div>
  )
}
