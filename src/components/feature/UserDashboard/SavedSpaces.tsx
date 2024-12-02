import React, { useState, useEffect } from 'react';
import { SpaceCard } from '@/components/ui/SpaceCard';

interface SavedSpace {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  location: string;
}

interface SavedSpacesProps {
  userId: string;
}

export const SavedSpaces: React.FC<SavedSpacesProps> = ({ userId }) => {
  const [savedSpaces, setSavedSpaces] = useState<SavedSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchSavedSpaces = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/users/${userId}/saved-spaces`);
        const data = await response.json();
        setSavedSpaces(data);
      } catch (error) {
        console.error('Failed to fetch saved spaces:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSpaces();
  }, [userId]);

  const handleRemoveSpace = async (spaceId: string) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/users/${userId}/saved-spaces/${spaceId}`, {
        method: 'DELETE',
      });
      setSavedSpaces((prev) => prev.filter((space) => space.id !== spaceId));
    } catch (error) {
      console.error('Failed to remove saved space:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Saved Spaces</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-md ${
              view === 'grid'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-md ${
              view === 'list'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {savedSpaces.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No saved spaces yet</p>
          <button
            onClick={() => {
              // TODO: Navigate to space search
              console.log('Navigate to space search');
            }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Find Spaces
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedSpaces.map((space) => (
            <div key={space.id} className="relative group">
              <SpaceCard
                title={space.title}
                description={space.description}
                price={space.price}
                imageUrl={space.imageUrl}
                rating={space.rating}
                location={space.location}
                onSelect={() => {
                  // TODO: Navigate to space details
                  console.log('Navigate to space details:', space.id);
                }}
              />
              <button
                onClick={() => handleRemoveSpace(space.id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {savedSpaces.map((space) => (
            <div
              key={space.id}
              className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm"
            >
              <img
                src={space.imageUrl}
                alt={space.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold">{space.title}</h3>
                <p className="text-gray-600">{space.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-primary font-bold">
                    ${space.price}/hour
                  </span>
                  <span className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{space.rating}</span>
                  </span>
                  <span className="text-gray-500">{space.location}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    // TODO: Navigate to space details
                    console.log('Navigate to space details:', space.id);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleRemoveSpace(space.id)}
                  className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
