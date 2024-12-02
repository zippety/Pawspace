import { create } from 'zustand';
import { LocationStore, Location } from './types';

export const useLocationStore = create<LocationStore>()((set, get) => ({
  // State
  locations: [],
  selectedLocation: null,
  loading: false,
  error: null,

  // Actions
  setLocations: (locations) => set({ locations }),

  selectLocation: (location) => set({ selectedLocation: location }),

  addLocation: (location) => {
    const currentLocations = get().locations;
    set({ locations: [...currentLocations, location] });
  },

  removeLocation: (locationId) => {
    const currentLocations = get().locations;
    set({
      locations: currentLocations.filter((loc) => loc.id !== locationId),
      selectedLocation: get().selectedLocation?.id === locationId ? null : get().selectedLocation,
    });
  },
}));
