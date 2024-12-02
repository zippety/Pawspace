import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useLocationsStore } from '../../store/locationsStore';
import type { LocationType } from '../../types';

export function MapFilters() {
  const { filters, updateFilters } = useLocationsStore();

  const locationTypes: Array<{ type: LocationType; label: string }> = [
    { type: 'catCafe', label: 'Cat Cafes' },
    { type: 'dogPark', label: 'Dog Parks' },
    { type: 'waterPark', label: 'Water Parks' },
    { type: 'hikingTrail', label: 'Hiking Trails' },
    { type: 'fencedPark', label: 'Fenced Parks' },
    { type: 'agilityPark', label: 'Agility Parks' },
    { type: 'dogBeach', label: 'Dog Beaches' },
    { type: 'indoorFacility', label: 'Indoor Facilities' },
    { type: 'smallDogArea', label: 'Small Dog Areas' },
    { type: 'openField', label: 'Open Fields' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search locations..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          value={filters.searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        />
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Location Types</h3>
        <div className="space-y-2">
          {locationTypes.map(({ type, label }) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.types.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.types, type]
                    : filters.types.filter(t => t !== type);
                  updateFilters({ types: newTypes });
                }}
                className="rounded border-gray-300 text-indigo-600"
              />
              <span className="ml-2 text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Minimum Rating</h3>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.rating}
          onChange={(e) => updateFilters({ rating: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-1">
          {filters.rating} stars and above
        </div>
      </div>
    </div>
  );
}
