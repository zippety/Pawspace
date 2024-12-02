import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Coffee, Cat } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export function UserProgress() {
  const { pawPoints, visitedLocations, achievements } = useUserStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
        <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 font-medium text-yellow-700">{pawPoints} points</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-rose-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Cat className="h-5 w-5 text-rose-600" />
            <span className="font-medium text-rose-900">Cats Met</span>
          </div>
          <p className="text-2xl font-bold text-rose-700">{visitedLocations.length}</p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-indigo-900">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-indigo-700">
            {achievements.length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="bg-white p-2 rounded-full">
              <img
                src={achievement.icon}
                alt=""
                className="w-6 h-6"
              />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{achievement.title}</h4>
              <p className="text-sm text-gray-500">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
