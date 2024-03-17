import { db } from "../db";
import { isToday } from 'date-fns';

// export async function getLatestStockById(id: string) {
//   const stockInDb = await db.stock.findFirst({
//     select: {
//       symbol: true,
//       updatedAt: true,
//     },
//     where: { id },
//   });

//   if(!stockInDb) {
//     const stockFromApi = await getStock(stockInDb.symbol);
//   };


//   const upToDate = isToday(stockInDb.updatedAt);

//   if() return null;
// }

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
