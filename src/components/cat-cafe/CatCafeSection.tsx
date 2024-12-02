import React from 'react';
import { motion } from 'framer-motion';
import { CatCafeCard } from './CatCafeCard';
import { CatProfile } from './CatProfile';
import { UserProgress } from './UserProgress';
import { SAMPLE_CAFES } from '../../data/sampleCafes';

export function CatCafeSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Cat Cafes in Ontario
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Enjoy a purr-fect blend of coffee and feline companionship
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SAMPLE_CAFES.map((cafe, index) => (
                <motion.div
                  key={cafe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CatCafeCard cafe={cafe} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Meet Our Resident Cats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SAMPLE_CAFES.flatMap(cafe =>
                  cafe.residentCats.map(cat => (
                    <CatProfile key={cat.id} cat={cat} />
                  ))
                )}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <UserProgress />
          </div>
        </div>
      </div>
    </section>
  );
}
