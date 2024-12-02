import React from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';

export const SearchFilters: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center bg-white rounded-full border border-gray-300 hover:border-gray-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-opacity-50">
        <div className="flex-1 min-w-0 px-4 py-2">
          <div className="flex items-center">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search location"
              className="ml-2 block w-full border-0 bg-transparent focus:outline-none focus:ring-0 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-center border-l border-gray-300 px-4 py-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <button className="ml-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none">
            Any date • Any time
          </button>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
        </div>

        <button className="h-full px-6 bg-green-500 text-white rounded-r-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
          Search
        </button>
      </div>
    </div>
  );
};
