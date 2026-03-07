import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

prisma.$connect().catch((error) => {
  logger.error(
    'Failed to connect to database. Ensure DATABASE_URL is set correctly and PostgreSQL is running.',
    error
  );
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

export { prisma };
