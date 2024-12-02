import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PremiumMember, WalkingRoute, EmergencyContact } from '../types';

interface MembershipState {
  member: PremiumMember | null;
  savedRoutes: WalkingRoute[];
  emergencyContacts: EmergencyContact[];
  activeWalkers: Map<string, number>;
  weatherAlerts: string[];
  setMember: (member: PremiumMember) => void;
  addSavedRoute: (route: WalkingRoute) => void;
  removeSavedRoute: (routeId: string) => void;
  updateActiveWalkers: (routeId: string, count: number) => void;
  addEmergencyContact: (contact: EmergencyContact) => void;
  removeEmergencyContact: (contactId: string) => void;
  setWeatherAlerts: (alerts: string[]) => void;
}

export const useMembershipStore = create<MembershipState>()(
  persist(
    (set) => ({
      member: null,
      savedRoutes: [],
      emergencyContacts: [],
      activeWalkers: new Map(),
      weatherAlerts: [],

      setMember: (member) => set({ member }),

      addSavedRoute: (route) =>
        set((state) => ({
          savedRoutes: [...state.savedRoutes, route]
        })),

      removeSavedRoute: (routeId) =>
        set((state) => ({
          savedRoutes: state.savedRoutes.filter((route) => route.id !== routeId)
        })),

      updateActiveWalkers: (routeId, count) =>
        set((state) => {
          const newMap = new Map(state.activeWalkers);
          newMap.set(routeId, count);
          return { activeWalkers: newMap };
        }),

      addEmergencyContact: (contact) =>
        set((state) => ({
          emergencyContacts: [...state.emergencyContacts, contact]
        })),

      removeEmergencyContact: (contactId) =>
        set((state) => ({
          emergencyContacts: state.emergencyContacts.filter(
            (contact) => contact.id !== contactId
          )
        })),

      setWeatherAlerts: (alerts) => set({ weatherAlerts: alerts })
    }),
    {
      name: 'membership-storage'
    }
  )
);
