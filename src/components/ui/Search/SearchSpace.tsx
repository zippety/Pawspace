import React, { useState, useEffect } from 'react';
import { SpaceCard } from '../SpaceCard/SpaceCard';
import spaceSearchService, { SearchFilters, Space, SearchResponse } from '../../../services/spaceSearch';

interface SearchSpaceProps {
  initialSpaces?: Space[];
}

export const SearchSpace: React.FC<SearchSpaceProps> = ({
  initialSpaces = [],
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    page: 1,
    limit: 12
  });
  const [searchResult, setSearchResult] = useState<SearchResponse>({
    spaces: initialSpaces,
    total: initialSpaces.length,
    page: 1,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await spaceSearchService.searchSpaces(filters);
      setSearchResult(results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const loadMore = () => {
    if (searchResult.page < searchResult.totalPages) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  useEffect(() => {
    if (filters.query || filters.location) {
      const debounceTimer = setTimeout(() => {
        handleSearch();
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [filters]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search spaces..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Price Range:</label>
            <input
              type="number"
              placeholder="Min"
              className="w-24 px-2 py-1 border rounded"
              onChange={(e) => handleFilterChange('minPrice', parseFloat(e.target.value))}
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-24 px-2 py-1 border rounded"
              onChange={(e) => handleFilterChange('maxPrice', parseFloat(e.target.value))}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Min Rating:</label>
            <select
              className="px-2 py-1 border rounded"
              onChange={(e) => handleFilterChange('minRating', parseInt(e.target.value))}
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>{rating}+ Stars</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResult.spaces.map((space) => (
          <SpaceCard
            key={space.id}
            title={space.title}
            description={space.description}
            price={space.price}
            imageUrl={space.imageUrl}
            rating={space.rating}
            location={space.location}
          />
        ))}
      </div>

      {searchResult.spaces.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No spaces found. Try adjusting your search filters.
        </div>
      )}

      {searchResult.page < searchResult.totalPages && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="bg-white text-primary px-6 py-2 rounded-lg border border-primary hover:bg-primary hover:text-white transition-colors duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
