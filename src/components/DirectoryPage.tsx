import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/leaflet.css';
import { defaultIcon } from '../utils/leaflet-setup';
import '../utils/leaflet-setup';

// interface DogPark {
//   id: number;
//   title: string;
//   location: string;
//   price: number;
//   size: string;
//   distance: string;
//   rating: number;
//   reviews: number;
//   features: string[];
//   images: string[];
//   position: [number, number];
//   totalImages: number;
//   isTopSpot: boolean;
// }

interface DogPark {
  id: number;
  title: string;
  location: string;
  price: number;
  size: string;
  distance: string;
  rating: number;
  reviews: number;
  features: string[];
  images: string[];
  position: [number, number];
  totalImages: number;
  isTopSpot: boolean;
}

export const DirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sampleParks: DogPark[] = [
    {
      id: 1,
      title: "Claudia's Fully Fenced Yard For Dogs To R...",
      location: "North York, ON",
      price: 10,
      size: "0.06 acres",
      distance: "2 mi from you",
      rating: 5,
      reviews: 14,
      features: ["Fully Fenced"],
      images: ["/sample-yard-1.jpg"],
      position: [43.7615, -79.4111],
      totalImages: 15,
      isTopSpot: true
    },
    {
      id: 2,
      title: "Fully Fenced Yard For Dogs To Rent In Sc...",
      location: "Scarborough, ON",
      price: 10,
      size: "0.5 acres",
      distance: "6 mi from you",
      rating: 5,
      reviews: 94,
      features: ["Fully Fenced"],
      images: ["/sample-yard-2.jpg"],
      position: [43.7764, -79.2318],
      totalImages: 45,
      isTopSpot: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700">Home</a>
            <span>›</span>
            <span>All Dog Parks</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-104px)]">
        {/* Left Side - Map and Search */}
        <div className="w-1/2 flex flex-col border-r border-gray-200">
          {/* Search Bar */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search location / Any date • Any time"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <MapContainer
              center={[43.6532, -79.3832]}
              zoom={10}
              className="h-full w-full absolute"
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {sampleParks.map((park) => (
                <Marker
                  key={park.id}
                  position={park.position}
                  icon={defaultIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <h3 className="font-semibold">{park.title}</h3>
                      <p>${park.price}/hour</p>
                      <p>{park.size}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right Side - Listings */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Off leash dog parks for rent</h1>
            <p className="text-gray-600">Sniffspot's private dog parks are the best way to exercise your dog. We have the best variety and the best priced dog parks anywhere!</p>

            {/* Filter Pills */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {["Fully fenced", "Water parks", "No dogs seen/heard", "< 10 miles away", "0.5+ acres", "Top spots", "Hiking"].map((filter) => (
                <button
                  key={filter}
                  className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Listings */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {sampleParks.map((park) => (
              <div key={park.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Image Container */}
                <div className="relative">
                  <img
                    src={park.images[0]}
                    alt={park.title}
                    className="w-full h-64 object-cover"
                  />
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    1 of {park.totalImages}
                  </div>
                  {/* Top Spot Badge */}
                  {park.isTopSpot && (
                    <div className="absolute top-2 left-2 bg-[#22C55E] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Top spot
                    </div>
                  )}
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{park.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </span>
                        <span className="text-sm text-gray-600">({park.reviews})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${park.price}</p>
                      <p className="text-sm text-gray-600">dog / hour</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{park.location} • {park.distance}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {park.features.map((feature) => (
                      <span key={feature} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {feature}
                      </span>
                    ))}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {park.size}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
