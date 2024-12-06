export interface SafetyScore {
  score: number;
  reasons: string[];
  recommendations: string[];
}

export interface SpaceMatch {
  spaceId: string;
  score: number;
  matchReasons: string[];
  safetyScore: SafetyScore;
}

export interface PetProfile {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  temperament: string[];
  specialNeeds?: string[];
  preferences?: {
    environment?: string[];
    playmates?: string[];
    activities?: string[];
  };
}

export interface Space {
  id: string;
  name: string;
  type: 'yard' | 'camp' | 'sanctuary' | 'cafe';
  features: string[];
  size: number; // in square feet
  capacity: number;
  restrictions?: string[];
  amenities: string[];
  safetyFeatures: string[];
  environment: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface MatchingCriteria {
  petProfile: PetProfile;
  preferredType?: Space['type'][];
  minSize?: number;
  maxDistance?: number;
  requiredFeatures?: string[];
  requiredAmenities?: string[];
  activityLevel?: 'low' | 'medium' | 'high';
}
