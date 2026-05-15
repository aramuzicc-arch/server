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

## Vercel (`vercel.json`)

1. **Root Directory** = `server`
2. Set env vars from `.env.example` (especially `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `JWT_SECRET`)
3. **`CLIENT_ORIGIN`** must include every frontend origin, e.g.  
   `http://localhost:3000,https://aramuzicc.vercel.app`
4. **`vercel.json` CORS headers** use `https://aramuzicc.vercel.app` for edge OPTIONS/responses. If the client URL changes, update those headers and `CLIENT_ORIGIN` together.
5. Deploy → API base: `https://<server-project>.vercel.app/api`

Client project: set `VITE_API_BASE_URL=https://<server-project>.vercel.app/api`

Health (no DB): `GET /api/health`
