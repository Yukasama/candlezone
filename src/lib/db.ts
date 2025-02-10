import { env } from '@/env.mjs';
import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const libsql = createClient({
    authToken: env.TURSO_AUTH_TOKEN,
    url: env.TURSO_DATABASE_URL,
  });

  const adapter = new PrismaLibSQL(libsql);
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
