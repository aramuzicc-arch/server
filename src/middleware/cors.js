import {
  corsAllowedHeaders,
  corsAllowedMethods,
  isOriginAllowed,
} from "../config/cors.js";

/** Set CORS headers on every response (including OPTIONS and errors). */
export function applyCors(req, res, next) {
  const origin = req.headers.origin;
  const allowed = origin && isOriginAllowed(origin);

  // Log CORS decisions in production for debugging
  if (process.env.NODE_ENV === "production" && !allowed && origin) {
    console.warn(`[CORS] Origin not allowed: ${origin}`);
  }

  // Set CORS headers if origin is allowed or it's a preflight request
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", corsAllowedMethods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsAllowedHeaders.join(", "));
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    // Always respond to OPTIONS (preflight) requests immediately
    res.status(204).end();
    return;
  }

  next();
}
