import React from 'react';
import { Search, Filter } from 'lucide-react';
import { LocationCard } from './LocationCard';
import { useLocationsStore } from '../../store/locationsStore';
import { SearchFilters } from '../SearchFilters';

interface LocationsSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
}

export function LocationsSidebar({ isOpen, isMobile }: LocationsSidebarProps) {
  const { locations, filters } = useLocationsStore();

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesType = filters.types.length === 0 || filters.types.includes(location.type);
    const matchesRating = location.rating >= filters.rating;
    return matchesSearch && matchesType && matchesRating;
  });

  if (!isOpen) return null;

  return (
    <div className={`h-full bg-white shadow-lg z-10 flex flex-col overflow-hidden ${isMobile ? 'w-full' : ''}`}>
      <div className="p-2 md:p-4 border-b">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Pet-Friendly Locations</h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          {filteredLocations.length} locations found
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 md:p-4 space-y-2 md:space-y-4">
          <SearchFilters className="sticky top-0 bg-white z-10" />
          {filteredLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              className="hover:bg-gray-50 transition-colors"
            />
          ))}
          {filteredLocations.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>No locations found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
