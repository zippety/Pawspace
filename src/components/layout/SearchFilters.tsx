import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useLocationsStore } from '../../store/locationsStore';
import type { LocationType } from '../../types';

export function SearchFilters() {
  const { filters, updateFilters } = useLocationsStore();

  return (
    <div className="p-4 border-b space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search by name or location..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          value={filters.searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Filters</h3>
        <button
          onClick={() => updateFilters({
            types: [],
            searchQuery: '',
            rating: 0
          })}
          className="text-sm text-indigo-600 hover:text-indigo-700"
        >
          Clear all
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.rating}
          onChange={(e) => updateFilters({ rating: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-sm text-gray-500 mt-1">
          {filters.rating} stars and above
        </div>
      </div>
    </div>
  );
}
