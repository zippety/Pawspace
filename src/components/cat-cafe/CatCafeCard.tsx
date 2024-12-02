import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Coffee, Cat } from 'lucide-react';
import type { CatCafe } from '../../types';

interface CatCafeCardProps {
  cafe: CatCafe;
}

export function CatCafeCard({ cafe }: CatCafeCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48">
        <img
          src={cafe.images[0]}
          alt={cafe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ${cafe.price}/hour
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{cafe.name}</h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-yellow-700">{cafe.rating}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {cafe.location}
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{cafe.description}</p>

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Cat className="h-4 w-4 mr-1" />
            {cafe.residentCats.length} Cats
          </div>
          <div className="flex items-center">
            <Coffee className="h-4 w-4 mr-1" />
            {cafe.menu.length} Menu Items
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {cafe.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors duration-200 font-medium"
        >
          Book Visit
        </motion.button>
      </div>
    </motion.div>
  );
}
