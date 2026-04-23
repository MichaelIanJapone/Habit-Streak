import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Use a PostgreSQL URL (e.g. from Neon) locally and on Vercel.");
  }
  return new Pool({
    connectionString,
    max: process.env.VERCEL ? 5 : 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
  });
}

function createPrismaClient(): PrismaClient {
  const pool = globalForPrisma.pgPool ?? createPool();
  if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
