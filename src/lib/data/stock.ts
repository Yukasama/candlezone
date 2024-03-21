import { db } from "../db";

export async function getRecentStocksByUserId(
  userId: string | undefined,
  take: number = 5
) {
  return await db.userRecentStocks.findMany({
    select: {
      stock: {
        select: {
          symbol: true,
          image: true,
          companyName: true,
          sector: true,
          industry: true,
          peRatioTTM: true,
        },
      },
    },
    where: { userId },
    orderBy: { createdAt: "desc" },
    distinct: "stockId",
    take,
  });
}
