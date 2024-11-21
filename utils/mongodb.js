import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw new Error('MongoDB connection failed');
  }
}