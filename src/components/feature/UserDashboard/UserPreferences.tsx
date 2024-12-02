import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  specialNeeds?: string;
}

interface Preferences {
  searchRadius: number;
  priceRange: [number, number];
  preferredAmenities: string[];
  spaceTypes: string[];
  dogProfiles: DogProfile[];
}

interface UserPreferencesProps {
  userId: string;
  onUpdate: (preferences: Preferences) => void;
}

const amenitiesOptions = [
  'Fenced Area',
  'Water Access',
  'Agility Equipment',
  'Shade',
  'Lighting',
  'Seating',
  'Storage',
  'Washing Station',
];

const spaceTypeOptions = [
  'Backyard',
  'Dog Park',
  'Training Facility',
  'Indoor Play Area',
  'Swimming Pool',
  'Agility Course',
];

export const UserPreferences: React.FC<UserPreferencesProps> = ({
  userId,
  onUpdate,
}) => {
  const [preferences, setPreferences] = useState<Preferences>({
    searchRadius: 10,
    priceRange: [0, 100],
    preferredAmenities: [],
    spaceTypes: [],
    dogProfiles: [],
  });

  const [showDogForm, setShowDogForm] = useState(false);
  const [newDog, setNewDog] = useState<Partial<DogProfile>>({});

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/users/${userId}/preferences`);
        const data = await response.json();
        setPreferences(data);
      } catch (error) {
        console.error('Failed to fetch preferences:', error);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleAmenityToggle = (amenity: string) => {
    setPreferences((prev) => {
      const newAmenities = prev.preferredAmenities.includes(amenity)
        ? prev.preferredAmenities.filter((a) => a !== amenity)
        : [...prev.preferredAmenities, amenity];

      return {
        ...prev,
        preferredAmenities: newAmenities,
      };
    });
  };

  const handleSpaceTypeToggle = (type: string) => {
    setPreferences((prev) => {
      const newTypes = prev.spaceTypes.includes(type)
        ? prev.spaceTypes.filter((t) => t !== type)
        : [...prev.spaceTypes, type];

      return {
        ...prev,
        spaceTypes: newTypes,
      };
    });
  };

  const handleAddDog = () => {
    if (newDog.name && newDog.breed && newDog.age && newDog.size) {
      setPreferences((prev) => ({
        ...prev,
        dogProfiles: [
          ...prev.dogProfiles,
          {
            id: Date.now().toString(),
            ...newDog as DogProfile,
          },
        ],
      }));
      setNewDog({});
      setShowDogForm(false);
    }
  };

  const handleRemoveDog = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      dogProfiles: prev.dogProfiles.filter((dog) => dog.id !== id),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Search Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search Radius (km)
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={preferences.searchRadius}
              onChange={(e) =>
                setPreferences((prev) => ({
                  ...prev,
                  searchRadius: parseInt(e.target.value),
                }))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600">{preferences.searchRadius} km</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price Range ($/hour)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="0"
                value={preferences.priceRange[0]}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    priceRange: [parseInt(e.target.value), prev.priceRange[1]],
                  }))
                }
                className="w-24 rounded-md border-gray-300"
              />
              <span>to</span>
              <input
                type="number"
                min="0"
                value={preferences.priceRange[1]}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)],
                  }))
                }
                className="w-24 rounded-md border-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Preferred Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {amenitiesOptions.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Switch
                checked={preferences.preferredAmenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className={`${
                  preferences.preferredAmenities.includes(amenity)
                    ? 'bg-primary'
                    : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable {amenity}</span>
                <span
                  className={`${
                    preferences.preferredAmenities.includes(amenity)
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Space Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {spaceTypeOptions.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Switch
                checked={preferences.spaceTypes.includes(type)}
                onChange={() => handleSpaceTypeToggle(type)}
                className={`${
                  preferences.spaceTypes.includes(type)
                    ? 'bg-primary'
                    : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable {type}</span>
                <span
                  className={`${
                    preferences.spaceTypes.includes(type)
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              <span className="text-sm">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Dog Profiles</h2>
          <button
            onClick={() => setShowDogForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Add Dog
          </button>
        </div>

        {showDogForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Dog's name"
                value={newDog.name || ''}
                onChange={(e) => setNewDog({ ...newDog, name: e.target.value })}
                className="rounded-md border-gray-300"
              />
              <input
                type="text"
                placeholder="Breed"
                value={newDog.breed || ''}
                onChange={(e) => setNewDog({ ...newDog, breed: e.target.value })}
                className="rounded-md border-gray-300"
              />
              <input
                type="number"
                placeholder="Age"
                value={newDog.age || ''}
                onChange={(e) =>
                  setNewDog({ ...newDog, age: parseInt(e.target.value) })
                }
                className="rounded-md border-gray-300"
              />
              <select
                value={newDog.size || ''}
                onChange={(e) =>
                  setNewDog({
                    ...newDog,
                    size: e.target.value as 'small' | 'medium' | 'large',
                  })
                }
                className="rounded-md border-gray-300"
              >
                <option value="">Select size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowDogForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDog}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Add
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {preferences.dogProfiles.map((dog) => (
            <div
              key={dog.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{dog.name}</h3>
                  <p className="text-gray-600">{dog.breed}</p>
                  <p className="text-gray-600">
                    {dog.age} years old • {dog.size} size
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveDog(dog.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <span className="sr-only">Remove {dog.name}</span>
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onUpdate(preferences)}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
