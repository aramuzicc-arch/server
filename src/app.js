import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors.js";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "ARA API",
    health: "/api/health",
    docs: "Use the client app; API routes are under /api",
  });
});

// MongoDB only for /api/* (except health). Avoids timeouts on non-API hits (see vercel.json catch-all).
app.use(async (req, _res, next) => {
  if (!req.path.startsWith("/api") || req.path === "/api/health") {
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
  if (req.path.startsWith("/api")) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(404).json({ message: "Not found" });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
