import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, PawPrint } from 'lucide-react';

const NORTH_YORK_COORDS = {
  lat: 43.7615,
  lng: -79.4111
};

export function NorthYorkParks() {
  const handleExploreClick = () => {
    // Center map on North York and update filters
    if (window.google) {
      const map = document.querySelector('[aria-label="Map"]');
      if (map) {
        map.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-500 to-teal-600 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Discover North York Dog Parks
            </h2>
            <p className="mt-2 text-emerald-50">
              Find the perfect spot for your furry friend in North York
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExploreClick}
            className="flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-emerald-50 transition-colors"
          >
            <PawPrint className="h-5 w-5" />
            Explore Local Parks
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
