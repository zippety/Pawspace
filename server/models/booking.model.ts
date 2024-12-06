import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  space: Schema.Types.ObjectId;
  pet: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  matchScore: number;
  safetyScore: number;
  requirements: {
    specialNeeds?: string[];
    equipment?: string[];
    staffing?: string[];
  };
  checklist: {
    item: string;
    completed: boolean;
    completedAt?: Date;
    completedBy?: Schema.Types.ObjectId;
  }[];
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
    createdAt: Date;
    photos?: string[];
  };
  cancellation?: {
    reason: string;
    requestedBy: Schema.Types.ObjectId;
    requestedAt: Date;
    refundAmount?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  space: { type: Schema.Types.ObjectId, ref: 'Space', required: true },
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalPrice: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  matchScore: { type: Number, required: true },
  safetyScore: { type: Number, required: true },
  requirements: {
    specialNeeds: [{ type: String }],
    equipment: [{ type: String }],
    staffing: [{ type: String }]
  },
  checklist: [{
    item: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date,
    completedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  notes: String,
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now },
    photos: [{ type: String }]
  },
  cancellation: {
    reason: String,
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    requestedAt: Date,
    refundAmount: Number
  }
}, {
  timestamps: true
});

// Create indexes for common queries
BookingSchema.index({ space: 1, startTime: 1, endTime: 1 });
BookingSchema.index({ pet: 1, status: 1 });
BookingSchema.index({ owner: 1, status: 1 });
BookingSchema.index({ status: 1, startTime: 1 });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
