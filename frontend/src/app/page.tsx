import MapView from '@/components/MapView'

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Open House Finder</h1>
            <div className="flex space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Filters
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                My Saved
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Map */}
      <main className="flex-1">
        <MapView />
      </main>
    </div>
  )
}
