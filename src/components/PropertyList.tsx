import React from 'react';
import { Property } from '../types/property';
import { PropertyCard } from './PropertyCard';
import { usePropertyStore } from '../store/propertyStore';

export const PropertyList: React.FC = () => {
  const { properties, loading, error } = usePropertyStore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error loading properties: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Off leash dog parks for rent</h1>
        <p className="mt-2 text-lg text-gray-600">
          {properties.length} spots found
        </p>
        <p className="mt-4 text-gray-600">
          Pawspace's private dog parks are the best way to exercise your dog. We have the best variety and the best priced dog parks anywhere!
        </p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['Fully fenced', 'Water parks', 'No dogs seen/heard', '< 10 miles away', '0.5+ acres', 'Top spots', 'Hiking'].map((filter) => (
          <button
            key={filter}
            className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Property grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={(p) => {/* Handle property click */}}
          />
        ))}
      </div>
    </div>
  );
};
