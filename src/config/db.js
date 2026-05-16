import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Vercel serverless: reuse one connection across warm invocations.
 * @see https://www.mongodb.com/docs/atlas/manage-connections-serverless/
 */
const globalCache = globalThis;

if (!globalCache.__mongoose) {
  globalCache.__mongoose = { conn: null, promise: null };
}

const cache = globalCache.__mongoose;

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5_000,
        socketTimeoutMS: 45_000,
      })
      .then((m) => m);
  }

  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }

  return cache.conn;
}
