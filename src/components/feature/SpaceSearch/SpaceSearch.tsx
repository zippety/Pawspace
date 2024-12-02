import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SpaceCard } from '@/components/ui/SpaceCard';

interface SearchFormData {
  location: string;
  date: string;
  timeSlot: string;
  priceRange: [number, number];
}

interface Space {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  location: string;
}

export const SpaceSearch: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Space[]>([]);
  const { register, handleSubmit } = useForm<SearchFormData>();

  const onSubmit = async (data: SearchFormData) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/spaces/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Failed to search spaces:', error);
      // TODO: Show error notification
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            {...register('location')}
            placeholder="Location"
            className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
          />
          <input
            {...register('date')}
            type="date"
            className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
          />
          <select
            {...register('timeSlot')}
            className="rounded-lg border-gray-300 focus:ring-primary focus:border-primary"
          >
            <option value="">Select time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
          <button
            type="submit"
            className="bg-primary text-white rounded-lg py-2 px-4 hover:bg-primary-dark transition-colors"
          >
            Search Spaces
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((space) => (
          <SpaceCard
            key={space.id}
            title={space.title}
            description={space.description}
            price={space.price}
            imageUrl={space.imageUrl}
            rating={space.rating}
            location={space.location}
            onSelect={() => {
              // TODO: Navigate to space details
            }}
          />
        ))}
      </div>
    </div>
  );
};
