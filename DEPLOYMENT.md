# Free Deploy Guide

## Local Check Before Deploy

```bash
npm install
npm run db:setup
npm run lint
npm run build
npm run dev:all
```

Open:

- Frontend: `http://localhost:5173`
- API health: `http://localhost:5000/api/health`
- Owner dashboard: `http://localhost:5173/owner`

Default local owner login:

- Email: `owner@amrut.local`
- Password: `owner123`

Change these in `.env` before a real launch.

## Free Demo Deploy Option

### 1. Backend on Render

Create a new Web Service from the repo.

Build command:

```bash
npm install && npm run db:setup
```

Start command:

```bash
npm run dev:api
```

Environment variables:

```bash
DATABASE_URL=file:./prisma/dev.db
API_PORT=10000
CLIENT_ORIGIN=https://your-frontend-domain.vercel.app
TOKEN_SECRET=use-a-long-random-secret
OWNER_EMAIL=your-owner-email@example.com
OWNER_PASSWORD=your-strong-owner-password
```

The backend automatically reads the platform `PORT`, so you usually do not need to set `API_PORT` on Render.

Important: SQLite on a free web service is good for demos, but not ideal for production persistence. For a real business launch, move Prisma to a hosted PostgreSQL database such as Neon or Supabase.

### 2. Frontend on Vercel or Netlify

Build command:

```bash
npm run build
```

Publish directory:

```bash
dist
```

Frontend environment variable:

```bash
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

## Production Upgrade

For a proper production setup:

- Use Neon or Supabase Postgres.
- Change `prisma/schema.prisma` datasource provider from `sqlite` to `postgresql`.
- Use the normal Prisma migration flow.
- Replace the SQLite adapter in `server/index.js` and `prisma/seed.js` with the standard Prisma Client configuration.
- Keep `TOKEN_SECRET`, `OWNER_EMAIL`, and `OWNER_PASSWORD` private.
