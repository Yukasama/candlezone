import { db } from '@/lib/db';
import { unstable_cache } from '@/lib/utils/unstable-cache';

export const getPopularStocks = unstable_cache(
  async () => {
    return db.stock.findMany({
      orderBy: { marketCap: 'desc' },
      select: {
        companyName: true,
        country: true,
        exchange: true,
        id: true,
        image: true,
        industry: true,
        marketCap: true,
        range: true,
        sector: true,
        symbol: true,
      },
      take: 300,
      where: {
        exchange: { not: 'Other OTC' },
        isActivelyTrading: true,
        isEtf: false,
        isFund: false,
        symbol: { not: { contains: '.', in: ['GOOGL', 'BRK-A', 'MICRD'] } },
      },
    });
  },
  () => ['getPopularStocks'],
  { revalidate: 60 * 60 * 24 * 30 },
);

export const getStock = unstable_cache(
  async ({ symbol }: { symbol: string }) => {
    return await db.stock.findUnique({
      select: {
        companyName: true,
        country: true,
        description: true,
        earningsDate: true,
        id: true,
        image: true,
        industry: true,
        isEtf: true,
        marketCap: true,
        netIncomePerShareTTM: true,
        peersList: true,
        priceToBookRatioTTM: true,
        priceToEarningsGrowthRatioTTM: true,
        priceToEarningsRatioTTM: true,
        range: true,
        sector: true,
        symbol: true,
        updatedAt: true,
        website: true,
      },
      where: { symbol: symbol.toUpperCase() },
    });
  },
  ({ symbol }: { symbol: string }) => ['getStock' + symbol.toUpperCase()],
  { revalidate: 60 * 60 * 16 },
);
