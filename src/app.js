import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// Allow all origins (reflects the request Origin header when present)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Vercel `api/index.js` sometimes receives `/albums` instead of `/api/albums`
app.use((req, _res, next) => {
  if (!req.path.startsWith("/api") && req.path !== "/") {
    const q = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    req.url = `/api${req.path}${q}`;
  }
  next();
});

app.get("/", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use(async (req, _res, next) => {
  if (req.method === "OPTIONS" || req.path === "/api/health" || !req.path.startsWith("/api")) {
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
