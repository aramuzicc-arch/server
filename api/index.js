/**
 * Vercel serverless entry (auto-detected from `api/`).
 * Minimal configuration for reliability.
 */
import serverless from "serverless-http";
import app from "../src/app.js";

export default serverless(app);
