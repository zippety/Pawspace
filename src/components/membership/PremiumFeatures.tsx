import React from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  Users,
  Shield,
  Phone,
  Calendar,
  Tag,
  Cloud,
  Car
} from 'lucide-react';

const features = [
  {
    icon: Map,
    title: 'Interactive Route Map',
    description: 'Access premium walking routes with safety ratings and amenities'
  },
  {
    icon: Users,
    title: 'Community Features',
    description: 'Connect with verified walkers and organize group walks'
  },
  {
    icon: Shield,
    title: 'Safety Verification',
    description: 'Background checks and dog temperament verification'
  },
  {
    icon: Phone,
    title: 'Emergency Support',
    description: '24/7 access to emergency vet contacts and incident reporting'
  },
  {
    icon: Calendar,
    title: 'Exclusive Events',
    description: 'Monthly community walks and pet-friendly gatherings'
  },
  {
    icon: Tag,
    title: 'Member Discounts',
    description: 'Special offers at partner pet stores and services'
  },
  {
    icon: Cloud,
    title: 'Weather Alerts',
    description: 'Real-time updates for optimal walking conditions'
  },
  {
    icon: Car,
    title: 'Parking Info',
    description: 'Find available parking spots near popular routes'
  }
];

export function PremiumFeatures() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Premium Membership Benefits
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need for a better walking experience
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white p-6 rounded-lg shadow-md"
            >
              <div className="absolute top-6 left-6 bg-indigo-100 rounded-lg p-3">
                <feature.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-16">
                <h3 className="text-lg font-medium text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
