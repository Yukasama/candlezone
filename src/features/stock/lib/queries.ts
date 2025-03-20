import { db } from '@/lib/db';
import { unstable_cacheLife as cacheLife } from 'next/cache';

export const getPopularStocks = async () => {
  'use cache';
  cacheLife('weeks');

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
};

export const getStock = async ({ symbol }: { symbol: string }) => {
  'use cache';
  cacheLife('hours');

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
};
