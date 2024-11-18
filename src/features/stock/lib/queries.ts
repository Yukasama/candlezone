import { db } from '@/lib/db';
import { unstable_cache } from '@/lib/utils/unstable-cache';

export const getPopularStocks = unstable_cache(
  async () => {
    return db.stock.findMany({
      select: {
        id: true,
        symbol: true,
        companyName: true,
        image: true,
        sector: true,
        industry: true,
        country: true,
        exchangeShortName: true,
        mktCap: true,
      },
      where: {
        symbol: { not: { in: ['GOOGL', 'BRK-A', 'MICRD'], contains: '.' } },
        isEtf: false,
        isFund: false,
        isActivelyTrading: true,
        exchangeShortName: { not: 'Other OTC' },
      },
      orderBy: { mktCap: 'desc' },
      take: 300,
    });
  },
  () => ['getPopularStocks'],
  { revalidate: 60 * 60 * 24 * 30 },
);

export const getRecentStocksByUserId = async (userId?: string, take = 5) => {
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
    orderBy: { createdAt: 'desc' },
    distinct: 'stockId',
    take,
  });
};

export const addToRecentStocks = async ({
  userId,
  stockId,
}: {
  userId: string;
  stockId: string;
}) => {
  const oneDayAgo = new Date(Date.now() - 60000 * 60 * 24);
  const recentEntry = await db.userRecentStocks.count({
    where: {
      userId,
      stockId,
      createdAt: { gte: oneDayAgo },
    },
  });

  if (!recentEntry) {
    await db.userRecentStocks.create({
      data: {
        userId,
        stockId,
      },
    });
  }
};

export const getFinancials = unstable_cache(
  async ({ stockId }: { stockId: string }) => {
    return await db.financials.findMany({
      select: {
        priceEarningsRatio: true,
        priceToSalesRatio: true,
        priceToBookRatio: true,
        priceEarningsToGrowthRatio: true,
        grossProfitMargin: true,
        operatingProfitMargin: true,
        netProfitMargin: true,
        dividendYield: true,
      },
      where: {
        id: stockId,
        date: { gte: '2015-01-01' },
      },
      orderBy: { date: 'desc' },
      take: 8,
    });
  },
  ({ stockId }: { stockId: string }) => ['getFinancials' + stockId],
  { revalidate: 60 * 60 * 24 * 30 },
);

export const getStock = unstable_cache(
  async ({ symbol }: { symbol: string }) => {
    return await db.stock.findUnique({
      select: {
        id: true,
        symbol: true,
        companyName: true,
        image: true,
        earningsDate: true,
        updatedAt: true,
        website: true,
        sector: true,
        industry: true,
        description: true,
        country: true,
        mktCap: true,
        isEtf: true,
        peersList: true,
      },
      where: { symbol: symbol.toUpperCase() },
    });
  },
  ({ symbol }: { symbol: string }) => ['getStock' + symbol.toUpperCase()],
  { revalidate: 60 * 60 * 16 },
);
