import React from 'react';

const categories = [
  { id: 'water', name: 'Dog Water Parks', color: 'border-cyan-400 hover:bg-cyan-50' },
  { id: 'hiking', name: 'Dog Hiking Trails', color: 'border-cyan-400 hover:bg-cyan-50' },
  { id: 'fenced', name: 'Fully Fenced Dog Parks', color: 'border-red-400 hover:bg-red-50' },
  { id: 'agility', name: 'Dog Agility Parks', color: 'border-yellow-400 hover:bg-yellow-50' },
  { id: 'beaches', name: 'Dog Beaches', color: 'border-indigo-400 hover:bg-indigo-50' },
  { id: 'indoor', name: 'Indoor Dog Parks', color: 'border-cyan-400 hover:bg-cyan-50' },
  { id: 'small', name: 'Small Dog Parks', color: 'border-red-400 hover:bg-red-50' },
];

export const Categories: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-[#6366F1] mb-2">
        Find Private Dog Parks
      </h1>
      <p className="text-gray-600 mb-8">
        Discover safe, private spaces for your dog in North York
      </p>

      <h2 className="text-lg font-medium text-gray-900 mb-4">Categories</h2>
      <div className="space-y-3">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`w-full px-4 py-3 text-left text-gray-700 rounded-lg border ${category.color} transition-colors duration-200 hover:shadow-sm`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};
