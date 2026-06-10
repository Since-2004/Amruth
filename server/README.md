# Amrut Backend

This backend uses Express, Prisma, and SQLite for local development.

## Run

```bash
npm run db:setup
npm run dev:api
```

The API starts at `http://localhost:5000/api`.

## Database

Data is stored in `prisma/dev.db` after running `npm run db:setup`. The schema contains:

- `users`
- `programs`
- `contacts`
- `feedback`
- `enrollments`

## Main Endpoints

- `GET /api/health`
- `GET /api/programs`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/contact`
- `POST /api/feedback`
- `POST /api/enrollments`

For production, replace the default `TOKEN_SECRET`, use a production database URL, and run Prisma migrations during deployment.
