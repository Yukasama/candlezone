import "server-only";

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// import "server-only";

// import { PrismaClient } from "@prisma/client";
// import { Pool, neonConfig } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import ws from "ws";
// import { env } from "@/env.mjs";

// neonConfig.webSocketConstructor = ws;
// const connectionString = `${env.DATABASE_URL}`;
// const pool = new Pool({
//   connectionString,
//   idleTimeoutMillis: 0,
//   connectionTimeoutMillis: 0,
// });
// const adapter = new PrismaNeon(pool);

// export const db = new PrismaClient({ adapter });
