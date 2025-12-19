import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGO_URL;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URL environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongo;

if (!cached) {
  cached = (global as any).mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI!).then((client) => {
      return {
        client,
        db: client.db(),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
