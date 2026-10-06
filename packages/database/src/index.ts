import { PrismaClient } from '@prisma/client';
import path from 'node:path';

// Ensure consistent SQLite path across monorepo packages and test runners
if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'file:./dev.db' || process.env.DATABASE_URL.includes('dev.db')) {
  const dbPath = path.resolve(__dirname, '../prisma/dev.db').replace(/\\/g, '/');
  process.env.DATABASE_URL = `file:${dbPath}`;
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export * from '@prisma/client';
