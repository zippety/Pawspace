import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Property, PropertyFilter } from '../types/property';
import { supabase } from '../services/supabase';
import { reportError } from '../utils/sentry';

interface PropertyState {
  properties: Property[];
  loading: boolean;
  error: Error | null;
  filters: PropertyFilter;
  selectedProperty: Property | null;
  // Actions
  fetchProperties: (filter?: PropertyFilter) => Promise<void>;
  createProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  setFilters: (filters: PropertyFilter) => void;
  setSelectedProperty: (property: Property | null) => void;
  clearError: () => void;
}

export const usePropertyStore = create<PropertyState>()(
  devtools(
    persist(
      (set, get) => ({
        properties: [],
        loading: false,
        error: null,
        filters: {},
        selectedProperty: null,

        fetchProperties: async (filter?: PropertyFilter) => {
          try {
            set({ loading: true, error: null });

            let query = supabase
              .from('properties')
              .select('*')
              .eq('isActive', true);

            // Apply filters
            if (filter?.location?.city) {
              query = query.eq('location->city', filter.location.city);
            }

            if (filter?.priceRange) {
              if (filter.priceRange.min !== undefined) {
                query = query.gte('pricePerHour', filter.priceRange.min);
              }
              if (filter.priceRange.max !== undefined) {
                query = query.lte('pricePerHour', filter.priceRange.max);
              }
            }

            if (filter?.size) {
              if (filter.size.min !== undefined) {
                query = query.gte('size', filter.size.min);
              }
              if (filter.size.max !== undefined) {
                query = query.lte('size', filter.size.max);
              }
            }

            if (filter?.amenities?.length) {
              query = query.contains('amenities', filter.amenities);
            }

            if (filter?.rating) {
              query = query.gte('rating', filter.rating);
            }

            const { data, error } = await query;

            if (error) throw error;

            set({ properties: data as Property[], loading: false });
          } catch (error) {
            reportError(error as Error, {
              component: 'propertyStore',
              action: 'fetchProperties',
              filters: filter
            });
            set({ error: error as Error, loading: false });
          }
        },

        createProperty: async (property) => {
          try {
            set({ loading: true, error: null });

            const { data, error } = await supabase
              .from('properties')
              .insert([{
                ...property,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }])
              .select()
              .single();

            if (error) throw error;

            set(state => ({
              properties: [...state.properties, data as Property],
              loading: false
            }));

            return data as Property;
          } catch (error) {
            reportError(error as Error, {
              component: 'propertyStore',
              action: 'createProperty'
            });
            set({ error: error as Error, loading: false });
            throw error;
          }
        },

        updateProperty: async (id, updates) => {
          try {
            set({ loading: true, error: null });

            const { error } = await supabase
              .from('properties')
              .update({
                ...updates,
                updatedAt: new Date().toISOString()
              })
              .eq('id', id);

            if (error) throw error;

            set(state => ({
              properties: state.properties.map(p =>
                p.id === id ? { ...p, ...updates } : p
              ),
              loading: false
            }));
          } catch (error) {
            reportError(error as Error, {
              component: 'propertyStore',
              action: 'updateProperty',
              propertyId: id
            });
            set({ error: error as Error, loading: false });
            throw error;
          }
        },

        deleteProperty: async (id) => {
          try {
            set({ loading: true, error: null });

            const { error } = await supabase
              .from('properties')
              .delete()
              .eq('id', id);

            if (error) throw error;

            set(state => ({
              properties: state.properties.filter(p => p.id !== id),
              loading: false
            }));
          } catch (error) {
            reportError(error as Error, {
              component: 'propertyStore',
              action: 'deleteProperty',
              propertyId: id
            });
            set({ error: error as Error, loading: false });
            throw error;
          }
        },

        setFilters: (filters) => set({ filters }),
        setSelectedProperty: (property) => set({ selectedProperty: property }),
        clearError: () => set({ error: null })
      }),
      {
        name: 'property-storage',
        partialize: (state) => ({
          filters: state.filters,
          selectedProperty: state.selectedProperty
        })
      }
    )
  )
);
