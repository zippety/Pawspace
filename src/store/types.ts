import { User } from '@supabase/supabase-js';

// Auth Types
export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: any | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

// Location Types
export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface LocationState {
  locations: Location[];
  selectedLocation: Location | null;
  loading: boolean;
  error: string | null;
}

export interface LocationActions {
  setLocations: (locations: Location[]) => void;
  selectLocation: (location: Location | null) => void;
  addLocation: (location: Location) => void;
  removeLocation: (locationId: string) => void;
}

export type LocationStore = LocationState & LocationActions;
