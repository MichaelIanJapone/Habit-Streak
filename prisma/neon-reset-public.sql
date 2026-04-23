-- OPTION A — Full reset of schema `public` on Neon (loses ALL data in public).
-- Run in Neon: SQL Editor → select your database (e.g. neondb) → paste → Run once.
-- Then redeploy on Vercel so `prisma migrate deploy` runs on an empty schema.

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

-- Restore access for app roles (Neon default owner; adjust if your role name differs)
GRANT ALL ON SCHEMA public TO neondb_owner;
GRANT ALL ON SCHEMA public TO public;
ALTER SCHEMA public OWNER TO neondb_owner;
