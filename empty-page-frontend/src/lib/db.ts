import mongoose from "mongoose";
const MONGODB_URI: string = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define env variables for application to work");
}

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose; // Use 'globalThis' instead of 'global' for browser compatibility

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }; // Use 'globalThis' instead of 'global' for browser compatibility
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    // @ts-ignore
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
