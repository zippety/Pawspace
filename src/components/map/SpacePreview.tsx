import React from 'react';
import { Star, MapPin } from 'lucide-react';
import type { DogPark } from '../../types';

interface SpacePreviewProps {
  space: DogPark;
}

export function SpacePreview({ space }: SpacePreviewProps) {
  return (
    <div className="w-72">
      <img
        src={space.images[0]}
        alt={space.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <div className="mt-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{space.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{space.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          {space.location}
        </div>
        <p className="text-sm text-gray-600 mt-2">{space.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {space.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
            >
              {amenity}
            </span>
          ))}
        </div>
        <button
          onClick={() => {/* Handle booking */}}
          className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Book Now - ${space.price}/hour
        </button>
      </div>
    </div>
  );
}
