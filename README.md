# Server (Express + MongoDB)

## Local

```bash
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:5050/api` (see `PORT` in `.env`).

```bash
npm run seed:admin   # creates AdminUser in MongoDB
```

Admin login: client app → `/admin/login`.

## Vercel (`vercel.json` + `api/index.js`)

Uses the modern **`api/`** serverless layout (no legacy `builds` block).

1. **Root Directory** = `server`
2. Set env vars from `.env.example` (especially `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `JWT_SECRET`)
3. **`CLIENT_ORIGIN`** — production + local, e.g. `http://localhost:3000,https://aramuzicc.vercel.app`  
   Vercel **preview** URLs (`https://aramuzicc-git-….vercel.app`) are allowed automatically (see `CLIENT_VERCEL_SLUG` in `.env.example`).
4. Deploy → API base: `https://<server-project>.vercel.app/api`  
   CORS is handled in Express (no hardcoded origins in `vercel.json`).

Client project: set `VITE_API_BASE_URL=https://<server-project>.vercel.app/api`

Health (no DB): `GET /api/health`
