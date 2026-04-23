# Habit Streaks

A full-stack habit tracker: register, sign in, create habits, log days on a **month calendar**, see **streaks** and a **28-day heatmap**, **archive** or **edit** habits, and sign out. Built with **Next.js (App Router)**, **React**, **TypeScript**, **Prisma**, **SQLite**, and **Auth.js** (credentials).

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
| Database | SQLite via Prisma ORM + `better-sqlite3` adapter |
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

   - `DATABASE_URL` — default local value: `file:./prisma/dev.db`
   - `AUTH_SECRET` — long random secret (e.g. `openssl rand -base64 32` or `npx auth secret`)

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
