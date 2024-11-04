import { createClient } from '@libsql/client/web';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});

const adapter = new PrismaLibSQL(libsql);
export const db = new PrismaClient({ adapter });
