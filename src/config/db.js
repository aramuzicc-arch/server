import mongoose from "mongoose";
import { env } from "./env.js";

const opts = { serverSelectionTimeoutMS: 5_000, connectTimeoutMS: 5_000 };

export async function connectDb() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.mongodbUri, opts);
}
