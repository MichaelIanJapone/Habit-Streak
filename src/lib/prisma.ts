import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

function sqliteFilePathFromEnv(): string {
  const raw = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

  if (!raw.startsWith("file:")) {
    return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
  }

  const rest = raw.slice("file:".length);

  if (rest.startsWith("//")) {
    try {
      return fileURLToPath(new URL(raw));
    } catch {
      /* fall through to relative handling */
    }
  }

  if (rest.startsWith("/") || /^[A-Za-z]:/.test(rest)) {
    return rest;
  }

  return path.resolve(process.cwd(), rest.replace(/^\.\/?/, ""));
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const adapter = new PrismaBetterSqlite3({ url: sqliteFilePathFromEnv() });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
