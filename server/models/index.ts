import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Export all models
export * from './space.model';
export * from './pet.model';
export * from './booking.model';
export * from './safety.model';
export * from './matching.model';
