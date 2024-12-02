import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar, Star, Shield } from 'lucide-react';

export function BecomeHost() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Share Your Space,<br />
              Earn Extra Income
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Turn your backyard or private space into a dog park, or your café into a cat haven.
              Join our community of hosts and start earning today.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-start space-x-3">
                <DollarSign className="h-6 w-6 text-indigo-200" />
                <div>
                  <h3 className="font-semibold">Earn Money</h3>
                  <p className="text-indigo-100 text-sm">Average $500/month</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="h-6 w-6 text-indigo-200" />
                <div>
                  <h3 className="font-semibold">Flexible Schedule</h3>
                  <p className="text-indigo-100 text-sm">You set your hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Star className="h-6 w-6 text-indigo-200" />
                <div>
                  <h3 className="font-semibold">Great Reviews</h3>
                  <p className="text-indigo-100 text-sm">4.8/5 avg rating</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-indigo-200" />
                <div>
                  <h3 className="font-semibold">Full Support</h3>
                  <p className="text-indigo-100 text-sm">Insurance included</p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-indigo-50 transition-colors duration-200"
              onClick={() => {
                // Handle host signup
              }}
            >
              Become a Host
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
                  alt="Happy dog in park"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1472491235688-bdc81a63246e?auto=format&fit=crop&w=800&q=80"
                  alt="Cat cafe interior"
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
                  alt="Dogs playing"
                  className="rounded-lg shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=800&q=80"
                  alt="Cat in cafe"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
