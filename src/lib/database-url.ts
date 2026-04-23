/** Normalize env DB URL for `pg` (trim, strip wrapping quotes/newlines, postgres → postgresql). */
export function readDatabaseUrlFromEnv(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (raw == null) return undefined;
  let s = raw.trim().replace(/\r\n|\r|\n/g, "");
  if (s.length === 0) return undefined;
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  if (s.length === 0) return undefined;
  if (s.startsWith("postgres://") && !s.startsWith("postgresql://")) {
    s = `postgresql://${s.slice("postgres://".length)}`;
  }
  return s;
}
