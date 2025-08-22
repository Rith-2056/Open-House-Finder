'use client'

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

interface ListingCardsProps {
  houses: OpenHouse[];
  onHouseSelect: (house: OpenHouse) => void;
  selectedHouse: OpenHouse | null;
  onShowDetails: (house: OpenHouse) => void;
}

export default function ListingCards({ houses, onHouseSelect, selectedHouse, onShowDetails }: ListingCardsProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center p-1">
        <h3 className="font-semibold text-lg text-gray-800">
          Open Houses
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
            {houses.length} properties
          </span>
        </div>
      </div>
      
      {/* Cards Container */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {houses.map(house => (
          <div
            key={house.id}
            className={`group relative bg-white border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              selectedHouse?.id === house.id 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-lg' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onHouseSelect(house)}
          >
            {/* Main Content */}
            <div className="p-5">
              {/* Price & Status */}
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-2xl text-green-600 group-hover:text-green-700 transition-colors">
                  ${(house.price / 1000000).toFixed(1)}M
                </h4>
                <span className="text-xs bg-blue-500 text-white px-3 py-2 rounded-full font-semibold">
                  {house.open_house_time}
                </span>
              </div>
              
              {/* Address */}
              <p className="text-sm text-gray-800 mb-4 font-medium leading-relaxed">
                {house.address}
              </p>
              
              {/* Beds/Baths - FIXED VISIBILITY */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Beds:</span>
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {house.beds}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">Baths:</span>
                  <span className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {house.baths}
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 mb-5 leading-relaxed">
                {house.description}
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95 shadow-md"
                  onClick={(e) => {
                    e.stopPropagation()
                    onHouseSelect(house)
                  }}
                >
                  View on Map
                </button>
                <button 
                  className="px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-105 active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation()
                    onShowDetails(house)
                  }}
                >
                  Details
                </button>
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
        
        {/* Empty State */}
        {houses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-4xl mb-4 text-gray-400">🔍</div>
            <p className="text-gray-600 font-semibold text-lg">No properties match your filters</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
