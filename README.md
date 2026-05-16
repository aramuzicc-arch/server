# Server

## Local

```bash
cp .env.example .env
npm install
npm run seed:admin
npm run dev
```

API: `http://localhost:5050/api`

## Vercel

- **Root Directory:** `server`
- Env: `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*` (see `.env.example`)
- **`MONGODB_URI`:** use Atlas `mongodb+srv://…` (never `127.0.0.1` on Vercel)
- Atlas → **Network Access** → add `0.0.0.0/0` (or Vercel IPs)
- Run `npm run seed:admin` once locally with your Atlas URI in `.env`
- Test: `GET /api/health` (no DB), then `GET /api/albums` (needs DB)
- API URL: `https://<your-server>.vercel.app/api`

Client: `VITE_API_BASE_URL=https://<your-server>.vercel.app/api`

CORS allows all origins for now (`cors` `origin: true`).
