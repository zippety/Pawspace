import React from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Users, Bell } from 'lucide-react';

export function PawPatrolHero() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold sm:text-5xl md:text-6xl"
          >
            Paw Patrol Premium
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 max-w-md mx-auto text-xl text-indigo-100 sm:text-2xl md:mt-5 md:max-w-3xl"
          >
            Join our exclusive community of verified dog walkers
          </motion.p>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <Shield className="h-12 w-12 text-indigo-300" />
              <h3 className="mt-4 text-lg font-medium">Verified Members</h3>
              <p className="mt-2 text-sm text-indigo-100">
                Background checked and verified walkers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <MapPin className="h-12 w-12 text-indigo-300" />
              <h3 className="mt-4 text-lg font-medium">Premium Routes</h3>
              <p className="mt-2 text-sm text-indigo-100">
                Access to exclusive walking routes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center"
            >
              <Users className="h-12 w-12 text-indigo-300" />
              <h3 className="mt-4 text-lg font-medium">Community Events</h3>
              <p className="mt-2 text-sm text-indigo-100">
                Monthly walks and meetups
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center"
            >
              <Bell className="h-12 w-12 text-indigo-300" />
              <h3 className="mt-4 text-lg font-medium">Smart Alerts</h3>
              <p className="mt-2 text-sm text-indigo-100">
                Weather and safety notifications
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex justify-center gap-6"
          >
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              Join Monthly - $29.99
            </button>
            <button className="px-8 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-400 transition-colors">
              Join Annually - $299.99
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
