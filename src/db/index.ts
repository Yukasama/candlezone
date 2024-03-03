import "server-only";

import { PrismaClient } from "@prisma/client";
// import { env } from "@/env.mjs";
// import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient;
}
let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;

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
