import { create } from 'zustand';
import type { PetLocation, LocationType } from '../types';
import { mockLocations } from '../data/mockLocations';

/**
 * Interface defining the shape of the locations state and its actions
 * @interface LocationsState
 * @property {PetLocation[]} locations - Array of pet-friendly locations
 * @property {string | null} selectedLocation - ID of the currently selected location
 * @property {Object} filters - Current filter settings for locations
 * @property {LocationType[]} filters.types - Array of selected location types to filter by
 * @property {string} filters.searchQuery - Current search query for filtering locations
 * @property {number} filters.rating - Minimum rating filter for locations
 */
interface LocationsState {
  locations: PetLocation[];
  selectedLocation: string | null;
  filters: {
    types: LocationType[];
    searchQuery: string;
    rating: number;
  };
  setLocations: (locations: PetLocation[]) => void;
  setSelectedLocation: (locationId: string | null) => void;
  updateFilters: (filters: Partial<LocationsState['filters']>) => void;
}

/**
 * Zustand store managing the state of pet-friendly locations
 *
 * State Flow:
 * 1. Initial state loaded with mock data
 * 2. User interactions update filters
 * 3. Filtered data displayed in UI
 *
 * @example
 * ```typescript
 * const { locations, filters, updateFilters } = useLocationsStore();
 *
 * // Update search query
 * updateFilters({ searchQuery: 'park' });
 *
 * // Filter by location types
 * updateFilters({ types: ['PARK', 'TRAIL'] });
 * ```
 */
export const useLocationsStore = create<LocationsState>((set) => ({
  // Initial state
  locations: mockLocations,
  selectedLocation: null,
  filters: {
    types: [],
    searchQuery: '',
    rating: 0
  },

  /**
   * Updates the locations array
   * @param {PetLocation[]} locations - New array of locations to set
   */
  setLocations: (locations) => set({ locations }),

  /**
   * Updates the selected location
   * @param {string | null} locationId - ID of the location to select, or null to deselect
   */
  setSelectedLocation: (locationId) => set({ selectedLocation: locationId }),

  /**
   * Updates the filter settings
   * @param {Partial<LocationsState['filters']>} filters - Partial filter object to merge with current filters
   */
  updateFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  }))
}));
