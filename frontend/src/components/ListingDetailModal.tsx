'use client'

import { useState } from 'react'

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

interface ListingDetailModalProps {
  house: OpenHouse | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ListingDetailModal({ house, isOpen, onClose }: ListingDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'contact'>('overview')

  if (!isOpen || !house) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
          
          <h2 className="text-2xl font-bold mb-2">${(house.price / 1000000).toFixed(1)}M</h2>
          <p className="text-blue-100 flex items-center gap-2">
            📍 {house.address}
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              🛏️ {house.beds} bed{house.beds !== 1 ? 's' : ''}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              🚿 {house.baths} bath{house.baths !== 1 ? 's' : ''}
            </span>
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
              📅 {house.open_house_time}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: '🏠 Overview', icon: '🏠' },
            { id: 'details', label: '📋 Details', icon: '📋' },
            { id: 'contact', label: '📞 Contact', icon: '📞' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">🏡 Property Description</h3>
                <p className="text-gray-700 leading-relaxed">{house.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">💰 Price per Sq Ft</h4>
                  <p className="text-2xl font-bold text-green-600">$850</p>
                  <p className="text-sm text-gray-600">Estimated</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">📊 Market Trend</h4>
                  <p className="text-2xl font-bold text-blue-600">+5.2%</p>
                  <p className="text-sm text-gray-600">vs last year</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">📋 Property Details</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Property Type:</span>
                    <span className="float-right font-medium">Condo</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Year Built:</span>
                    <span className="float-right font-medium">2018</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Square Feet:</span>
                    <span className="float-right font-medium">1,200 sq ft</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Parking:</span>
                    <span className="float-right font-medium">1 space</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">HOA Fees:</span>
                    <span className="float-right font-medium">$450/month</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Property Tax:</span>
                    <span className="float-right font-medium">$14,400/year</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Days on Market:</span>
                    <span className="float-right font-medium">12 days</span>
                  </div>
                  <div>
                    <span className="text-gray-600">MLS#:</span>
                    <span className="float-right font-medium">ML{house.id}234567</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg mb-4">📞 Contact Information</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">🏢 Listing Agent</h4>
                <div className="space-y-2">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">📞 (415) 555-0123</p>
                  <p className="text-sm text-gray-600">📧 sarah.johnson@realty.com</p>
                  <p className="text-sm text-gray-600">🏢 SF Premium Realty</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                  📞 Call Agent
                </button>
                <button className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors">
                  📧 Send Message
                </button>
              </div>
              
              <button className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors">
                📅 Schedule Private Tour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
