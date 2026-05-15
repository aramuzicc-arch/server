import mongoose from "mongoose";
import { env } from "./env.js";

const connectOptions = {
  serverSelectionTimeoutMS: 8_000,
  connectTimeoutMS: 8_000,
  socketTimeoutMS: 8_000,
};

let connectPromise = null;

/** Safe for Vercel serverless: reuse an open connection; fail fast when Atlas is unreachable. */
export async function connectDb() {
  const { readyState } = mongoose.connection;
  if (readyState === 1) return;

  // Stale / stuck connect from a previous invocation — reset before retrying.
  if (readyState === 2 || readyState === 3) {
    try {
      await mongoose.disconnect();
    } catch {
      /* ignore */
    }
    connectPromise = null;
  }

  if (!connectPromise) {
    connectPromise = mongoose
      .connect(env.mongodbUri, connectOptions)
      .finally(() => {
        connectPromise = null;
      });
  }

  await connectPromise;
}
