import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Only connect for API routes. SPA/static (GET /, /assets/*) must not block on MongoDB — unreachable DB
// would otherwise hang until the serverless max duration (e.g. 300s on Vercel).
app.use(async (req, _res, next) => {
  if (!req.path.startsWith("/api")) {
    next();
    return;
  }
  try {
    await connectDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      const normalized = origin.replace(/\/$/, "");
      if (env.clientOriginAllowlist.has(normalized)) {
        callback(null, true);
        return;
      }
      if (process.env.NODE_ENV !== "production") {
        try {
          const { hostname } = new URL(origin);
          if (hostname === "localhost" || hostname === "127.0.0.1") {
            callback(null, true);
            return;
          }
        } catch {
          /* ignore */
        }
      }
      callback(null, false);
    },
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Vercel legacy single-function deploy: static client copied to `server/public` (see vercel.json buildCommand).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const indexHtml = path.join(publicDir, "index.html");
if (fs.existsSync(indexHtml)) {
  app.use(express.static(publicDir, { index: false }));
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }
    if (req.path.startsWith("/api")) {
      next();
      return;
    }
    res.sendFile(indexHtml, (err) => (err ? next(err) : undefined));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
