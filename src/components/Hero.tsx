import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1602268381389-c10fdb75112b?auto=format&fit=crop&w=1600&q=80"
          alt="Featured Dog Park"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 mix-blend-multiply opacity-60" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover Private Dog Parks in Ontario
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              Find safe and secure spaces for your furry friends to play and explore.
              Book by the hour and enjoy exclusive access to beautiful private parks.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter your location in Ontario..."
                className="block w-full pl-10 pr-3 py-3 text-base rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white focus:outline-none"
              />
              <button className="absolute inset-y-0 right-0 px-6 flex items-center bg-indigo-500 hover:bg-indigo-400 text-white rounded-r-lg font-medium">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
