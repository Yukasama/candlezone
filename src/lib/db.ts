import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // const myDB = getRequestContext().env.DB;
  // const adapter = new PrismaD1(myDB);
  // return new PrismaClient({ adapter });
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
  // eslint-disable-next-line unicorn/prefer-global-this
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = db;
}
