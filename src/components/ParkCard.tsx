import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Ruler, Users, Heart } from 'lucide-react';
import type { DogPark } from '../types';

interface ParkCardProps {
  park: DogPark;
}

export default function ParkCard({ park }: ParkCardProps) {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-48">
        <img
          src={park.images[0]}
          alt={park.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ${park.price}/hour
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-200 ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{park.name}</h3>
          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-yellow-700">{park.rating}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {park.location}
        </div>

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Ruler className="h-4 w-4 mr-1" />
            {park.size} acres
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Up to {park.maxDogs} dogs
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {park.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
        >
          Book Now
        </motion.button>
      </div>
    </motion.div>
  );
}
