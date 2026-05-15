/**
 * Vercel serverless entry (auto-detected from `api/`).
 * Local dev: `npm run dev` → `src/index.js`
 */
import serverless from "serverless-http";
import app from "../src/app.js";

export default serverless(app, {
  binary: ["image/*", "video/*", "multipart/form-data", "application/octet-stream"],
  // Disable keep-alive to prevent connection reuse issues in serverless
  request: (request) => {
    request.headers["connection"] = "close";
  },
});
