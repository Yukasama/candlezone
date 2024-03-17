import "server-only";

import { PrismaClient } from "@prisma/client";
// import { env } from "@/env.mjs";
// import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// For edge runtime

// function makePrisma() {
//   return new PrismaClient({
//     datasources: { db: { url: env.ACCELERATE_URL } },
//   }).$extends(withAccelerate());
// }

// const globalForPrisma = global as unknown as {
//   prisma: ReturnType<typeof makePrisma>;
// };

// export const db = globalForPrisma.prisma ?? makePrisma();

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = makePrisma();
// }
