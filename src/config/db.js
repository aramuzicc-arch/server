import mongoose from "mongoose";
import { env } from "./env.js";

// Cache connection for serverless environments (Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with serverless-optimized settings.
 * Returns cached connection if available; queues operations until connected.
 */
export async function connectDb() {
  // If we already have an active connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is already pending, wait for it
  if (!cached.promise) {
    const connectOptions = {
      // Queue operations until connected (prevents errors on cold start)
      bufferCommands: true,
      // Serverless-optimized pool size
      maxPoolSize: process.env.VERCEL === "1" ? 1 : 10,
      // Fail fast if MongoDB is unreachable
      serverSelectionTimeoutMS: 8000,
      // Allow operations to wait (Vercel timeout is 300s)
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(env.mongodbUri, connectOptions)
      .then((mongooseInstance) => {
        console.log("[DB] Connected to MongoDB");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("[DB] Connection failed:", error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export default connectDb;
