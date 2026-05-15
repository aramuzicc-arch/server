# Server (Express + MongoDB)

## Local

```bash
cp .env.example .env
npm install
npm run dev
```

API: `http://localhost:5050/api` (see `PORT` in `.env`).

## Vercel

1. Create a Vercel project with **Root Directory** = `server` (this folder).
2. Add environment variables from `.env.example` in the Vercel dashboard (not from `.env` in git).
3. Set **`CLIENT_ORIGIN`** to your frontend URL(s), comma-separated (e.g. `https://your-app.vercel.app`).
4. Use a cloud **`MONGODB_URI`** (Atlas). Allow network access from anywhere (`0.0.0.0/0`) or Vercel IPs.
5. Deploy. API base URL: `https://<your-project>.vercel.app/api`

Point the client at that URL with `VITE_API_BASE_URL=https://<your-project>.vercel.app/api`.

Health check (no DB): `GET /api/health`
