import { PrismaClient } from '@prisma/client';
import 'server-only';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db;
}

// neonConfig.webSocketConstructor = ws;
// const connectionString = `${env.DATABASE_URL}`;

// const pool = new Pool({ connectionString });
// const adapter = new PrismaNeon(pool);
// export const db = new PrismaClient({ adapter });
