/**
 * Vercel `api/index.js` often receives paths without the `/api` prefix
 * (e.g. `/albums` instead of `/api/albums`). Normalize before routing.
 */
export function normalizeVercelApiPath(req, _res, next) {
  const path = req.path || "/";
  
  // Don't normalize root "/" or paths already under "/api"
  if (path === "/" || path.startsWith("/api")) {
    next();
    return;
  }

  const query = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
  const segment = path.startsWith("/") ? path : `/${path}`;
  req.url = `/api${segment}${query}`;
  next();
}
