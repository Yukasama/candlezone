import { getStock } from "@/actions/fmp/get-stock";
import { db } from "../db";
import { isToday } from "date-fns";

export async function getLatestStockById(symbol: string) {
  const stockInDb = await db.stock.findFirst({
    where: { symbol },
  });

  try {
    if (!stockInDb) {
      return await getStock(symbol, true);
    }

    const upToDate = isToday(stockInDb.updatedAt);
    if (!upToDate) {
      return await getStock(symbol);
    }

    return stockInDb;
  } catch (error) {
    return null;
  }
}

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
