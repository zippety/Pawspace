import React from 'react';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocationsStore } from '../../store/locationsStore';
import type { PetLocation } from '../../types';

interface LocationCardProps {
  location: PetLocation;
}

export function LocationCard({ location }: LocationCardProps) {
  const { setSelectedLocation } = useLocationsStore();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => setSelectedLocation(location.id)}
    >
      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
        {location.images.length > 0 ? (
          <img
            src={location.images[0]}
            alt={location.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl">🐾</div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium shadow-md">
          {location.type}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-yellow-700">
              {location.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{location.description}</p>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {location.address}
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <DollarSign className="h-4 w-4 mr-1" />
          ${location.price}/hour
        </div>

        {location.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {location.amenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
