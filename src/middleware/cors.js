import {
  corsAllowedHeaders,
  corsAllowedMethods,
  isOriginAllowed,
} from "../config/cors.js";

/** Set CORS headers on every response (including OPTIONS and errors). */
export function applyCors(req, res, next) {
  const origin = req.headers.origin;

  if (origin && isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", corsAllowedMethods.join(", "));
  res.setHeader("Access-Control-Allow-Headers", corsAllowedHeaders.join(", "));
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
}
