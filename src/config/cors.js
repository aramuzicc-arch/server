import { env } from "./env.js";

/** Must match `Access-Control-Allow-Headers` in `vercel.json` and the `cors` package. */
export const corsAllowedHeaders = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
];

export const corsAllowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"];

/** Primary production client — keep in sync with `vercel.json` route headers when you change domains. */
export const primaryClientOrigin =
  [...env.clientOriginAllowlist].find((o) => o.startsWith("https://")) ||
  env.clientOrigin;

export function isOriginAllowed(origin) {
  if (!origin) return true;
  const normalized = origin.replace(/\/$/, "");
  if (env.clientOriginAllowlist.has(normalized)) return true;
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
