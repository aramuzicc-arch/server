import mongoose from "mongoose";
import { env } from "./env.js";

/** Safe for Vercel serverless: reuse an open connection instead of reconnecting every invocation. */
export async function connectDb() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.mongodbUri);
}
