import mongoose, { Schema, Document } from 'mongoose';

export interface IPet extends Document {
  name: string;
  owner: Schema.Types.ObjectId;
  species: string;
  breed?: string;
  age: number;
  size: 'small' | 'medium' | 'large';
  weight: number;
  temperament: string[];
  specialNeeds?: string[];
  preferences?: {
    environment?: string[];
    playmates?: string[];
    activities?: string[];
  };
  medicalInfo: {
    vaccinations: {
      name: string;
      date: Date;
      expiryDate: Date;
    }[];
    allergies?: string[];
    medications?: {
      name: string;
      dosage: string;
      frequency: string;
    }[];
    vetContact: {
      name: string;
      phone: string;
      email?: string;
      address?: string;
    };
    lastCheckup?: Date;
  };
  behavior: {
    socializing: 'excellent' | 'good' | 'fair' | 'poor';
    anxiety: 'none' | 'mild' | 'moderate' | 'severe';
    aggression: 'none' | 'mild' | 'moderate' | 'severe';
    training: string[];
  };
  photos: {
    url: string;
    caption?: string;
    isPrimary: boolean;
  }[];
  activityLevel: 'low' | 'medium' | 'high';
  dietaryRestrictions?: string[];
  emergencyContact: {
    name: string;
    phone: string;
    email?: string;
    relationship: string;
  };
  spacePreferences: {
    preferredTypes: ('yard' | 'camp' | 'sanctuary' | 'cafe')[];
    minSize?: number;
    maxDistance?: number;
    requiredFeatures?: string[];
    requiredAmenities?: string[];
  };
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema = new Schema<IPet>({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  species: { type: String, required: true },
  breed: String,
  age: { type: Number, required: true },
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: true
  },
  weight: { type: Number, required: true },
  temperament: [{ type: String }],
  specialNeeds: [{ type: String }],
  preferences: {
    environment: [{ type: String }],
    playmates: [{ type: String }],
    activities: [{ type: String }]
  },
  medicalInfo: {
    vaccinations: [{
      name: { type: String, required: true },
      date: { type: Date, required: true },
      expiryDate: { type: Date, required: true }
    }],
    allergies: [{ type: String }],
    medications: [{
      name: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true }
    }],
    vetContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
      address: String
    },
    lastCheckup: Date
  },
  behavior: {
    socializing: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true
    },
    anxiety: {
      type: String,
      enum: ['none', 'mild', 'moderate', 'severe'],
      required: true
    },
    aggression: {
      type: String,
      enum: ['none', 'mild', 'moderate', 'severe'],
      required: true
    },
    training: [{ type: String }]
  },
  photos: [{
    url: { type: String, required: true },
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  activityLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  dietaryRestrictions: [{ type: String }],
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    relationship: { type: String, required: true }
  },
  spacePreferences: {
    preferredTypes: [{
      type: String,
      enum: ['yard', 'camp', 'sanctuary', 'cafe']
    }],
    minSize: Number,
    maxDistance: Number,
    requiredFeatures: [{ type: String }],
    requiredAmenities: [{ type: String }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create text index for search
PetSchema.index({
  name: 'text',
  species: 'text',
  breed: 'text'
});

export const Pet = mongoose.model<IPet>('Pet', PetSchema);
