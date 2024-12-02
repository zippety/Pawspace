import React, { useState } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';

interface MapSearchBoxProps {
  onPlaceSelect: (coords: { lat: number; lng: number }) => void;
  className?: string;
}

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function MapSearchBox({ onPlaceSelect, className = '' }: MapSearchBoxProps) {
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}+Ontario&limit=5&countrycodes=ca`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
    setIsLoading(false);
  };

  // Debounce the search to avoid too many API calls
  const debouncedSearch = debounce(searchLocation, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleSelect = (result: SearchResult) => {
    setSearchValue(result.display_name.split(',')[0]); // Show only the first part of the address
    setResults([]);
    onPlaceSelect({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
  };

  return (
    <div className={`${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search locations in Ontario..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {results.length > 0 && isFocused && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {results.map((result) => {
            const mainText = result.display_name.split(',')[0];
            const secondaryText = result.display_name
              .split(',')
              .slice(1, 3)
              .join(',');

            return (
              <button
                key={result.place_id}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-100"
              >
                <span className="font-medium">{mainText}</span>
                <span className="text-gray-500 text-sm ml-1">{secondaryText}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
