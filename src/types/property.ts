import { Database } from './supabase';

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string;
}

export interface PropertyReviewImage {
  id: string;
  url: string;
  alt?: string;
}

export interface PropertyReview {
  id: string;
  propertyId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: PropertyReviewImage[];
  createdAt: string;
  visitDate?: string;
  verified: boolean;
  helpfulCount: number;
  hostResponse?: string;
  hostResponseDate?: string;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyRules {
  checkInTime: string;
  checkOutTime: string;
  maxGuests: number;
  maxPets: number;
  allowedPetTypes: string[];
  additionalRules?: string[];
}

export interface PropertyPricing {
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  currency: string;
  minimumStay: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  images: PropertyImage[];
  amenities: PropertyAmenity[];
  location: PropertyLocation;
  rules: PropertyRules;
  pricing: PropertyPricing;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'pending';
  reviews?: PropertyReview[];
  averageRating?: number;
  reviewCount?: number;
}

export type PropertyRow = Database['public']['Tables']['properties']['Row'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];
export type PropertyUpdate = Database['public']['Tables']['properties']['Update'];
