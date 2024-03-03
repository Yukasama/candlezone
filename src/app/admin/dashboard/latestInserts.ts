"use server";

import { db } from "@/db";

export async function fetchLatestInserts() {
  return await db.stock.findMany({
    take: 6,
    orderBy: { updatedAt: "desc" },
    select: {
      symbol: true,
      companyName: true,
      image: true,
      updatedAt: true,
    },
  });
}
