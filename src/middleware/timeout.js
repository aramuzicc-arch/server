/**
 * Timeout middleware for Vercel serverless.
 * Prevents requests from hanging indefinitely.
 * OPTIONS requests timeout after 5 seconds (should respond in ms).
 * Other requests timeout after 28 seconds (leaving 2s buffer for Vercel's 30s timeout).
 */
export function requestTimeout(req, res, next) {
  const timeoutMs = req.method === "OPTIONS" ? 5000 : 28000;

  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(504).json({
        message: `Request timeout (${timeoutMs}ms) — server may be unreachable or overloaded`,
      });
    }
    res.destroy();
  }, timeoutMs);

  res.on("finish", () => {
    clearTimeout(timeout);
  });

  res.on("close", () => {
    clearTimeout(timeout);
  });

  next();
}
