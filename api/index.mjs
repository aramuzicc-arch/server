/**
 * Vercel serverless entry for this API.
 * Repo root has `api` → symlink to this folder so Vercel still mounts `/api/*` here.
 * `serverless-http` bridges the serverless invoke to Express.
 */
import serverless from "serverless-http";
import app from "../src/app.js";

export default serverless(app);
