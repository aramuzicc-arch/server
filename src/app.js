import express from "express";
import { isOriginAllowed } from "./config/cors.js";
import { applyCors } from "./middleware/cors.js";
import { normalizeVercelApiPath } from "./middleware/vercelPath.js";
import { connectDb } from "./config/db.js";
import { requestTimeout } from "./middleware/timeout.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Prevent requests from hanging indefinitely in Vercel serverless.
app.use(requestTimeout);
app.use(applyCors);
app.use(normalizeVercelApiPath);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "ARA API",
    health: "/api/health",
    docs: "Use the client app; API routes are under /api",
  });
});

app.use(async (req, _res, next) => {
  if (
    req.method === "OPTIONS" ||
    !req.path.startsWith("/api") ||
    req.path === "/api/health"
  ) {
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((error, req, res, _next) => {
  const origin = req.headers.origin;
  if (origin && !res.headersSent && isOriginAllowed(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }
  console.error(error);
  if (!res.headersSent) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default app;
