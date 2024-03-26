import { db } from "../db";

export const getRecentStocksByUserId = async (
  userId?: string,
  take: number = 5
) => {
  return await db.userRecentStocks.findMany({
    select: {
      stock: {
        select: {
          id: true,
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
};
