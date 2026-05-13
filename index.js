/**
 * Vercel serverless entry (legacy `builds` + `routes` → this file).
 * Do not use `src/index.js` here — that process listens on a port.
 */
import serverless from "serverless-http";
import app from "./src/app.js";

export default serverless(app);
