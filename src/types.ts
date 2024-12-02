export type LocationType =
  | 'PARK'
  | 'CAFE'
  | 'TRAIL'
  | 'BEACH'
  | 'INDOOR'
  | 'AGILITY';

export interface PetLocation {
  id: string;
  name: string;
  description: string;
  type: LocationType;
  coordinates: {
    lat: number;
    lng: number;
  };
  rating: number;
  price: number;
  amenities: string[];
  images: string[];
  address: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  visitedLocations: string[];
  favorites: string[];
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
}

export interface OperatingHours {
  monday: TimeRange;
  tuesday: TimeRange;
  wednesday: TimeRange;
  thursday: TimeRange;
  friday: TimeRange;
  saturday: TimeRange;
  sunday: TimeRange;
}

export interface TimeRange {
  open: string;
  close: string;
  closed?: boolean;
}

export interface Cat {
  id: string;
  name: string;
  age: number;
  breed: string;
  description: string;
  image: string;
  personality: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface TravelPreferences {
  budget: number;
  lengthOfStay: number;
  travelStyle: 'luxury' | 'budget' | 'adventure' | 'family' | 'romantic';
  amenities: string[];
  season: 'spring' | 'summer' | 'fall' | 'winter';
}
