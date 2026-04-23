import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { prepareRuntimeDatabaseUrl, readDatabaseUrlFromEnv } from "@/lib/database-url";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPool(): Pool {
  const raw = readDatabaseUrlFromEnv();
  if (!raw) {
    throw new Error(
      "DATABASE_URL is missing or empty. Set it in .env or Vercel to a postgresql:// URL (no wrapping quotes).",
    );
  }
  const connectionString = prepareRuntimeDatabaseUrl(raw);
  return new Pool({
    connectionString,
    max: process.env.VERCEL ? 1 : 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 15_000,
  });
}

function createPrismaClient(): PrismaClient {
  const pool = globalForPrisma.pgPool ?? createPool();
  globalForPrisma.pgPool = pool;

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
