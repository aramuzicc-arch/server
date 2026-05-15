import { env } from "./env.js";

export const corsAllowedHeaders = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
];

export const corsAllowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

/** Vercel production + branch/preview URLs for the client (e.g. aramuzicc-git-main-….vercel.app). */
const VERCEL_CLIENT_SLUG = (process.env.CLIENT_VERCEL_SLUG || "aramuzicc").toLowerCase();

function isVercelClientPreview(origin) {
  try {
    const { protocol, hostname } = new URL(origin);
    return (
      protocol === "https:" &&
      hostname.endsWith(".vercel.app") &&
      hostname.toLowerCase().includes(VERCEL_CLIENT_SLUG)
    );
  } catch {
    return false;
  }
}

export function isOriginAllowed(origin) {
  if (!origin) return true;
  const normalized = origin.replace(/\/$/, "");
  if (env.clientOriginAllowlist.has(normalized)) return true;
  if (isVercelClientPreview(origin)) return true;
  if (process.env.NODE_ENV !== "production") {
    try {
      const { hostname } = new URL(origin);
      return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
      return false;
    }
  }
  return false;
}

export const corsOptions = {
  credentials: true,
  methods: corsAllowedMethods,
  allowedHeaders: corsAllowedHeaders,
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
};
