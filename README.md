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
- Atlas: allow `0.0.0.0/0` in Network Access
- API URL: `https://<your-server>.vercel.app/api`

Client: `VITE_API_BASE_URL=https://<your-server>.vercel.app/api`

CORS allows all origins for now (`cors` `origin: true`).
