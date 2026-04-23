# Habit Streaks

A full-stack habit tracker: register, sign in, create habits, log days on a **month calendar**, see **streaks** and a **28-day heatmap**, **archive** or **edit** habits, and sign out. Built with **Next.js (App Router)**, **React**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Auth.js** (credentials).

## Features

- Email + password auth (bcrypt-hashed passwords)
- Habits with name and accent color
- Month calendar to toggle any day (past months via ‹ ›)
- Current streak, longest streak, and total check-ins
- 28-day activity heatmap
- Archive / restore / delete habits
- Responsive UI with reusable components under `src/components/ui`

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16, React 19 |
| API & server logic | Server Actions, Route Handlers (`/api/auth/*`) |
| Database | PostgreSQL via Prisma ORM + `pg` + `@prisma/adapter-pg` |
| Auth | Auth.js (NextAuth v5) with JWT sessions |
| Validation | Zod |
| Styling | Tailwind CSS v4 |

## Prerequisites

- **Node.js 20+** and npm  
- **Docker** (optional) — for the Docker deployment path below

## Local setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Copy `.env.example` to `.env` and set:

   - `DATABASE_URL` — PostgreSQL URL for the **running app** (Neon: pooled URL when offered)
   - `DIRECT_URL` — PostgreSQL URL for **`prisma migrate`** (Neon: **direct** host, not `-pooler`; can match `DATABASE_URL` if you only use a direct string)
   - `AUTH_SECRET` — long random secret (e.g. `openssl rand -base64 32` or `npx auth secret`)
   - `AUTH_URL` — e.g. `http://localhost:3000` in dev; your real `https://…` URL in production

4. **Database migrations**

   ```bash
   npm run db:migrate
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000): create an account, sign in, then use **Habits**.

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js in development |
| `npm run build` | `prisma generate` + production build |
| `npm run vercel-build` | `prisma migrate deploy` + generate + build (use as Vercel **Build Command**) |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create/apply Prisma migrations (dev) |
| `npm run db:studio` | Open Prisma Studio |

## Project layout (high level)

```
src/
  app/                 # Routes (marketing, auth, habits), layouts, API auth route
  components/          # Shared UI (button, card, …) and layout (header)
  features/
    auth/              # Register, sign-in, session provider
    habits/            # Actions, queries, calendar, heatmap, stats
  lib/                 # Prisma client, utilities
  generated/prisma/    # Generated Prisma client (do not edit)
prisma/
  schema.prisma        # Data model
  migrations/          # SQL migrations
```

## Deploying on Vercel + Neon

1. Create a database on [Neon](https://neon.tech) and copy two connection strings when available:
   - **Pooled** → `DATABASE_URL` (app queries)
   - **Direct** (host without `-pooler`) → `DIRECT_URL` (`prisma migrate deploy` needs this; avoids “permission denied for schema public” errors from the pooler)
2. In Vercel → **Settings → Environment Variables**, set `DATABASE_URL`, `DIRECT_URL` (optional; if you add it, it must be a full `postgresql://…` string — **do not leave it empty**), `AUTH_SECRET`, and `AUTH_URL` (your `https://….vercel.app` site). Paste the value **without** extra quotes around the whole URL.
3. **Build Command:** `npm run vercel-build`
4. Redeploy.

### “permission denied for schema public” on `vercel-build`

1. **Confirm `DIRECT_URL` on Vercel** is the **direct** host (no `-pooler` in the hostname). If unsure, delete `DIRECT_URL` and set **only** `DATABASE_URL` to the **direct** string (pooling **off** in Neon’s Connect panel) so migrations and the app both use a direct connection.

2. In Neon: **SQL Editor** → select the same database as in your URL → run the script in **`prisma/neon-grant-public.sql`** (edit the role name if yours is not `neondb_owner`).

3. Redeploy on Vercel.

### “P3005 — database schema is not empty” (baseline)

Your Neon database **already has tables** (e.g. from an earlier failed deploy), but Prisma’s migration history does not match, so `prisma migrate deploy` refuses to run.

**Pick one:**

1. **Clean slate (simplest)** — Wipe `public` on Neon, then redeploy:
   - **UI:** Neon → **Branches** → your branch (e.g. `main`) → **⋯** → **Reset** / **Reset from parent** (wording varies) — confirms data loss.
   - **SQL:** Neon → **SQL Editor** → select database → run **`prisma/neon-reset-public.sql`** (edit `neondb_owner` if your role differs).  
   Then **Redeploy** on Vercel so `migrate deploy` applies `20260423140000_init` on an empty schema.

2. **Baseline (keep existing DB)** — Only if the tables **already match** this repo’s schema (`User`, `Habit`, `HabitEntry`). On your machine, point `.env` at Neon (`DATABASE_URL` + `DIRECT_URL` direct), then run once:

   ```bash
   npm run db:baseline
   ```

   That records `20260423140000_init` as applied **without** re-running SQL. Then redeploy on Vercel.

If the live schema does **not** match the app (wrong columns / old experiments), use option **1** or fix the schema before baselining.