import mongoose from 'mongoose';

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }
  return uri;
}

// Use a global variable to maintain a cached connection across hot reloads
declare global {
  var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Only connect if we're not in a build environment
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    console.warn('MONGODB_URI not set, skipping database connection');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    try {
      cached.promise = mongoose.connect(getMongoUri(), opts).then((mongoose) => {
        return mongoose;
      });
    } catch (error) {
      console.error('Failed to connect to database:', error);
      cached.promise = null;
      return null;
    }
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Database connection error:', e);
    return null;
  }

  return cached.conn;
}

export default connectDB;