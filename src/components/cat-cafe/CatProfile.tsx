import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Award } from 'lucide-react';
import type { Cat } from '../../types';
import { useUserStore } from '../../store/userStore';

interface CatProfileProps {
  cat: Cat;
}

export function CatProfile({ cat }: CatProfileProps) {
  const { visitedLocations, addVisitedLocation, addPawPoints } = useUserStore();
  const hasVisited = visitedLocations.includes(cat.id);

  const handlePetCat = () => {
    if (!hasVisited) {
      addVisitedLocation(cat.id);
      addPawPoints(50);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="relative h-64">
        <img
          src={cat.image}
          alt={cat.name}
          className="w-full h-full object-cover"
        />
        {hasVisited && (
          <div className="absolute top-4 right-4">
            <Award className="h-6 w-6 text-yellow-400 fill-current" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {cat.age} years old • {cat.breed}
        </p>

        <p className="mt-3 text-gray-600">{cat.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {cat.personality.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePetCat}
          className={`mt-4 w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 ${
            hasVisited
              ? 'bg-gray-100 text-gray-500'
              : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
          disabled={hasVisited}
        >
          <Heart className={hasVisited ? 'fill-rose-500' : ''} />
          {hasVisited ? 'Already Petted' : 'Pet Me!'}
        </motion.button>
      </div>
    </motion.div>
  );
}
