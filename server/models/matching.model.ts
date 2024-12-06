import mongoose, { Schema, Document } from 'mongoose';

export interface IMatchingHistory extends Document {
  pet: Schema.Types.ObjectId;
  space: Schema.Types.ObjectId;
  matchScore: number;
  safetyScore: number;
  mlScore: number;
  matchingCriteria: {
    petProfile: {
      species: string;
      size: string;
      age: number;
      temperament: string[];
      specialNeeds?: string[];
    };
    spacePreferences: {
      type?: string[];
      minSize?: number;
      maxDistance?: number;
      requiredFeatures?: string[];
      requiredAmenities?: string[];
    };
  };
  matchReasons: string[];
  userFeedback?: {
    rating: number;
    review?: string;
    tags: string[];
    createdAt: Date;
  };
  bookingStatus: 'viewed' | 'selected' | 'booked' | 'completed' | 'cancelled';
  success?: boolean;
  successFactors?: string[];
  failureReasons?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MatchingHistorySchema = new Schema<IMatchingHistory>({
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  space: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
  matchScore: { type: Number, required: true },
  safetyScore: { type: Number, required: true },
  mlScore: { type: Number, required: true },
  matchingCriteria: {
    petProfile: {
      species: { type: String, required: true },
      size: { type: String, required: true },
      age: { type: Number, required: true },
      temperament: [{ type: String }],
      specialNeeds: [{ type: String }]
    },
    spacePreferences: {
      type: [{ type: String }],
      minSize: Number,
      maxDistance: Number,
      requiredFeatures: [{ type: String }],
      requiredAmenities: [{ type: String }]
    }
  },
  matchReasons: [{ type: String }],
  userFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  },
  bookingStatus: {
    type: String,
    enum: ['viewed', 'selected', 'booked', 'completed', 'cancelled'],
    required: true
  },
  success: Boolean,
  successFactors: [{ type: String }],
  failureReasons: [{ type: String }]
}, {
  timestamps: true
});

// Create indexes for analytics and queries
MatchingHistorySchema.index({ pet: 1, createdAt: -1 });
MatchingHistorySchema.index({ space: 1, createdAt: -1 });
MatchingHistorySchema.index({ matchScore: -1 });
MatchingHistorySchema.index({ 'userFeedback.rating': 1 });
MatchingHistorySchema.index({ bookingStatus: 1, success: 1 });

export const MatchingHistory = mongoose.model<IMatchingHistory>('MatchingHistory', MatchingHistorySchema);

// ML Model Schema for storing trained models
export interface IMLModel extends Document {
  version: string;
  type: 'matching' | 'safety' | 'recommendation';
  modelData: Buffer;
  parameters: {
    [key: string]: any;
  };
  performance: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  trainingMetadata: {
    startTime: Date;
    endTime: Date;
    samplesUsed: number;
    epochs: number;
    learningRate: number;
  };
  status: 'training' | 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const MLModelSchema = new Schema<IMLModel>({
  version: { type: String, required: true },
  type: {
    type: String,
    enum: ['matching', 'safety', 'recommendation'],
    required: true
  },
  modelData: { type: Buffer, required: true },
  parameters: { type: Map, of: Schema.Types.Mixed },
  performance: {
    accuracy: { type: Number, required: true },
    precision: { type: Number, required: true },
    recall: { type: Number, required: true },
    f1Score: { type: Number, required: true }
  },
  trainingMetadata: {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    samplesUsed: { type: Number, required: true },
    epochs: { type: Number, required: true },
    learningRate: { type: Number, required: true }
  },
  status: {
    type: String,
    enum: ['training', 'active', 'archived'],
    default: 'training'
  }
}, {
  timestamps: true
});

// Create indexes for model management
MLModelSchema.index({ version: 1, type: 1 }, { unique: true });
MLModelSchema.index({ status: 1 });
MLModelSchema.index({ 'performance.accuracy': -1 });

export const MLModel = mongoose.model<IMLModel>('MLModel', MLModelSchema);
