import dotenv from "dotenv";

dotenv.config();

const required = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

/** Comma-separated origins; trailing slashes stripped; localhost ↔ 127.0.0.1 paired. */
function buildClientOriginAllowlist() {
  const raw = process.env.CLIENT_ORIGIN || "http://localhost:3000";
  const parts = raw
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean);
  const set = new Set(parts);
  for (const o of [...set]) {
    try {
      const u = new URL(o);
      const port = u.port ? `:${u.port}` : "";
      if (u.hostname === "localhost") {
        set.add(`${u.protocol}//127.0.0.1${port}`);
      }
      if (u.hostname === "127.0.0.1") {
        set.add(`${u.protocol}//localhost${port}`);
      }
    } catch {
      // skip invalid URL entries
    }
  }
  return set;
}

const clientOriginAllowlist = buildClientOriginAllowlist();

export const env = {
  // Default 5050: macOS AirPlay Receiver often binds :5000, breaking local APIs.
  port: Number(process.env.PORT || 5050),
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  /** First allowlisted origin (legacy / display); prefer `clientOriginAllowlist` for CORS. */
  clientOrigin: [...clientOriginAllowlist][0] || "http://localhost:3000",
  clientOriginAllowlist,
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === "1",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "",
  adminNotifyEmail: process.env.ADMIN_NOTIFY_EMAIL || "",
};
