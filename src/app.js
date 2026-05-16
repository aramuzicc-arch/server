import express from "express";
import { normalizeVercelApiPath } from "./middleware/vercelPath.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Normalize paths from Vercel serverless before CORS
app.use(normalizeVercelApiPath);

// CORS: Simple, fast headers on all responses
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

  // Respond to OPTIONS immediately without further processing
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
});

app.use(express.json());

// Health check - no dependencies
app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "ARA API",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found", path: req.path });
});

// Error handler
app.use((error, req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "production" ? undefined : error.message,
  });
});

export default app;
