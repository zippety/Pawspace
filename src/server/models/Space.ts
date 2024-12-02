import mongoose, { Schema, Document } from 'mongoose';

export interface ISpace extends Document {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  location: string;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  owner: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SpaceSchema = new Schema<ISpace>({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  rating: { type: Number, default: 0 },
  location: { type: String, required: true },
  amenities: [{ type: String }],
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

const Space = mongoose.model<ISpace>('Space', SpaceSchema);
export default Space;
