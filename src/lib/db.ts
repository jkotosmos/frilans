import { PrismaClient } from "@prisma/client";

// Prevent hot-reload in dev from spawning a new PrismaClient (and thus a new
// connection pool) on every file change.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
