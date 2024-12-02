import React, { useCallback, useState, useRef } from 'react';
import { usePropertyStore } from '../store/propertyStore';
import { PropertyFilter as PropertyFilterType } from '../types/property';
import { Search, DollarSign, Maximize2, Star, X, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';
import debounce from 'lodash/debounce';

export const PropertyFilter: React.FC = () => {
  const { filters, setFilters } = usePropertyStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced filter change
  const debouncedFilterChange = useCallback(
    debounce((updates: Partial<PropertyFilterType>) => {
      setFilters({ ...filters, ...updates });
    }, 300),
    [filters, setFilters]
  );

  const handleFilterChange = (updates: Partial<PropertyFilterType>) => {
    debouncedFilterChange(updates);
  };

  const clearFilters = () => {
    setFilters({});
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const activeFilterCount = Object.keys(filters).filter(
    key => filters[key] !== undefined && filters[key] !== ''
  ).length;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Primary Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search by city, neighborhood, or address"
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          value={filters.location?.city || ''}
          onChange={(e) => handleFilterChange({
            location: { ...filters.location, city: e.target.value }
          })}
        />
        {filters.location?.city && (
          <button
            onClick={() => handleFilterChange({ location: { city: '' } })}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <span className="mr-2">Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={cn(
            "w-4 h-4 ml-1 transition-transform",
            isExpanded && "transform rotate-180"
          )} />
        </button>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Price Range */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.priceRange?.max || ''}
              onChange={(e) => {
                const max = e.target.value ? Number(e.target.value) : undefined;
                handleFilterChange({
                  priceRange: { ...filters.priceRange, max }
                });
              }}
            >
              <option value="">Any price</option>
              <option value="25">Up to $25/hr</option>
              <option value="50">Up to $50/hr</option>
              <option value="100">Up to $100/hr</option>
              <option value="200">Up to $200/hr</option>
            </select>
          </div>

          {/* Size */}
          <div className="relative">
            <Maximize2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.size || ''}
              onChange={(e) => handleFilterChange({ size: e.target.value })}
            >
              <option value="">Any size</option>
              <option value="small">Small (up to 500 sq ft)</option>
              <option value="medium">Medium (500-1000 sq ft)</option>
              <option value="large">Large (1000+ sq ft)</option>
            </select>
          </div>

          {/* Rating */}
          <div className="relative">
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.minRating || ''}
              onChange={(e) => handleFilterChange({
                minRating: e.target.value ? Number(e.target.value) : undefined
              })}
            >
              <option value="">Any rating</option>
              <option value="4.5">4.5+ stars</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
