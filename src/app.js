import express from "express";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Initialize database connection at startup
// Errors are logged but don't crash the server (serverless can retry)
connectDb().catch((err) => {
  console.error("[STARTUP] Database connection failed:", err.message);
  console.log("[STARTUP] Server will attempt connection on first request");
});

// Path normalization: Vercel may send `/albums` instead of `/api/albums`
app.use((req, _res, next) => {
  if (!req.path.startsWith("/api") && req.path !== "/") {
    const q = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    req.url = `/api${req.path}${q}`;
  }
  next();
});

// CORS: Synchronous, no dependencies
app.use((req, res, next) => {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // OPTIONS requests respond immediately
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.use((_req, res) => res.status(404).json({ message: "Not found" }));

app.use((err, _req, res, _next) => {
  console.error(err);
  const dbError =
    err.name === "MongoServerSelectionError" ||
    err.name === "MongooseServerSelectionError" ||
    err.name === "MongoNetworkError";
  res.status(dbError ? 503 : 500).json({
    message: dbError ? "Database unavailable" : "Internal server error",
  });
});

export default app;
