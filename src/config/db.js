import mongoose from "mongoose";
import { env } from "./env.js";

const connectOptions = {
  /** Fail fast on Vercel when URI / network / Atlas IP access is wrong (default can hang for minutes). */
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000,
};

/** Safe for Vercel serverless: reuse an open connection instead of reconnecting every invocation. */
export async function connectDb() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.mongodbUri, connectOptions);
}
