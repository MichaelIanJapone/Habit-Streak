-- Run ONCE in Neon: Project → SQL Editor → choose database "neondb" (or your DB name) → Run.
-- Fixes: "permission denied for schema public" during `prisma migrate deploy` (Vercel / CI).
--
-- If your connection string user is NOT `neondb_owner`, replace it below (the part before ":" in postgresql://USER:...).

GRANT USAGE, CREATE ON SCHEMA public TO neondb_owner;
ALTER SCHEMA public OWNER TO neondb_owner;

-- Optional: ensure future tables in public are usable by the app role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO neondb_owner;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO neondb_owner;
