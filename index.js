/**
 * Vercel serverless entry (`vercel.json` → builds/routes → this file).
 * Local dev uses `src/index.js` (listen on PORT).
 */
import serverless from "serverless-http";
import app from "./src/app.js";

export default serverless(app, {
  binary: ["image/*", "video/*", "multipart/form-data", "application/octet-stream"],
});
