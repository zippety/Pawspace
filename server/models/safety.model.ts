import mongoose, { Schema, Document } from 'mongoose';

export interface ISafetyReport extends Document {
  space: Schema.Types.ObjectId;
  inspector: Schema.Types.ObjectId;
  date: Date;
  score: number;
  type: 'routine' | 'incident' | 'complaint';
  status: 'pending' | 'in_progress' | 'completed' | 'requires_action';
  checklist: {
    category: string;
    items: {
      item: string;
      status: 'pass' | 'fail' | 'na';
      notes?: string;
      photos?: string[];
      severity?: 'low' | 'medium' | 'high';
      action?: string;
    }[];
  }[];
  incidents?: {
    description: string;
    date: Date;
    severity: 'low' | 'medium' | 'high';
    involvedPets?: Schema.Types.ObjectId[];
    witnesses?: string[];
    photos?: string[];
    actionTaken: string;
  }[];
  recommendations: {
    priority: 'low' | 'medium' | 'high';
    description: string;
    deadline?: Date;
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: Date;
    completedBy?: Schema.Types.ObjectId;
  }[];
  equipment: {
    name: string;
    condition: 'good' | 'fair' | 'poor';
    lastMaintenance?: Date;
    nextMaintenance: Date;
    notes?: string;
  }[];
  environmentalFactors: {
    weather: string;
    temperature: number;
    conditions: string[];
  };
  certifications: {
    name: string;
    issuer: string;
    expiryDate: Date;
    status: 'valid' | 'expired' | 'pending';
  }[];
  signature: {
    name: string;
    title: string;
    date: Date;
    digitalSignature: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SafetyReportSchema = new Schema<ISafetyReport>({
  space: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
  inspector: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  type: {
    type: String,
    enum: ['routine', 'incident', 'complaint'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'requires_action'],
    default: 'pending'
  },
  checklist: [{
    category: { type: String, required: true },
    items: [{
      item: { type: String, required: true },
      status: {
        type: String,
        enum: ['pass', 'fail', 'na'],
        required: true
      },
      notes: String,
      photos: [String],
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      action: String
    }]
  }],
  incidents: [{
    description: { type: String, required: true },
    date: { type: Date, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    involvedPets: [{ type: Schema.Types.ObjectId, ref: 'Pet' }],
    witnesses: [String],
    photos: [String],
    actionTaken: { type: String, required: true }
  }],
  recommendations: [{
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true
    },
    description: { type: String, required: true },
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending'
    },
    completedAt: Date,
    completedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  equipment: [{
    name: { type: String, required: true },
    condition: {
      type: String,
      enum: ['good', 'fair', 'poor'],
      required: true
    },
    lastMaintenance: Date,
    nextMaintenance: { type: Date, required: true },
    notes: String
  }],
  environmentalFactors: {
    weather: { type: String, required: true },
    temperature: { type: Number, required: true },
    conditions: [{ type: String }]
  },
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['valid', 'expired', 'pending'],
      required: true
    }
  }],
  signature: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    digitalSignature: { type: String, required: true }
  }
}, {
  timestamps: true
});

// Create indexes for common queries
SafetyReportSchema.index({ space: 1, date: -1 });
SafetyReportSchema.index({ space: 1, status: 1 });
SafetyReportSchema.index({ score: 1 });
SafetyReportSchema.index({ type: 1, status: 1 });

export const SafetyReport = mongoose.model<ISafetyReport>('SafetyReport', SafetyReportSchema);
