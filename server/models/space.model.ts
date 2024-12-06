import mongoose, { Schema, Document } from 'mongoose';

export interface ISpace extends Document {
  name: string;
  type: 'yard' | 'camp' | 'sanctuary' | 'cafe';
  description: string;
  features: string[];
  size: number;
  capacity: number;
  restrictions?: string[];
  amenities: string[];
  safetyFeatures: string[];
  environment: string[];
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  pricing: {
    baseRate: number;
    currency: string;
    minimumDuration: number;
    maximumDuration?: number;
  };
  availability: {
    monday: { start: string; end: string; }[];
    tuesday: { start: string; end: string; }[];
    wednesday: { start: string; end: string; }[];
    thursday: { start: string; end: string; }[];
    friday: { start: string; end: string; }[];
    saturday: { start: string; end: string; }[];
    sunday: { start: string; end: string; }[];
  };
  owner: {
    userId: Schema.Types.ObjectId;
    name: string;
    phone: string;
    email: string;
  };
  status: 'active' | 'maintenance' | 'inactive';
  ratings: {
    average: number;
    count: number;
  };
  photos: {
    url: string;
    caption?: string;
    isPrimary: boolean;
  }[];
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
    coverage: string[];
  };
  lastSafetyCheck: Date;
  nextSafetyCheck: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SpaceSchema = new Schema<ISpace>({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['yard', 'camp', 'sanctuary', 'cafe']
  },
  description: { type: String, required: true },
  features: [{ type: String }],
  size: { type: Number, required: true },
  capacity: { type: Number, required: true },
  restrictions: [{ type: String }],
  amenities: [{ type: String }],
  safetyFeatures: [{ type: String }],
  environment: [{ type: String }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (v: number[]) => v.length === 2,
        message: 'Coordinates must be [longitude, latitude]'
      }
    },
    address: { type: String, required: true }
  },
  pricing: {
    baseRate: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    minimumDuration: { type: Number, required: true },
    maximumDuration: { type: Number }
  },
  availability: {
    monday: [{ start: String, end: String }],
    tuesday: [{ start: String, end: String }],
    wednesday: [{ start: String, end: String }],
    thursday: [{ start: String, end: String }],
    friday: [{ start: String, end: String }],
    saturday: [{ start: String, end: String }],
    sunday: [{ start: String, end: String }]
  },
  owner: {
    userId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'inactive'],
    default: 'active'
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  photos: [{
    url: { type: String, required: true },
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  insurance: {
    provider: { type: String, required: true },
    policyNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    coverage: [{ type: String }]
  },
  lastSafetyCheck: { type: Date, default: Date.now },
  nextSafetyCheck: { type: Date, required: true }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
SpaceSchema.index({ location: '2dsphere' });

// Create text index for search
SpaceSchema.index({
  name: 'text',
  description: 'text',
  'features': 'text',
  'amenities': 'text'
});

export const Space = mongoose.model<ISpace>('Space', SpaceSchema);
