import { db } from '@/lib/db';

export const getPortfoliosAndStocksByUser = async ({
  userId,
}: {
  userId?: string;
}) => {
  const popularStocks = await db.stock.findMany({
    select: {
      symbol: true,
      companyName: true,
      image: true,
    },
    where: {
      symbol: { in: ['MSFT', 'AAPL', 'NVDA', 'AMZN', 'GOOG'] },
    },
    orderBy: { mktCap: 'desc' },
  });

  if (!userId) {
    return {
      portfolios: [],
      recentStocks: popularStocks.map((stock) => ({
        stock,
      })),
    };
  }

  const userWithPortfoliosAndStocks = await db.user.findFirst({
    select: {
      portfolios: {
        select: {
          id: true,
          title: true,
          color: true,
          isPublic: true,
        },
        orderBy: { title: 'asc' },
      },
      recentStocks: {
        select: {
          stock: {
            select: {
              symbol: true,
              image: true,
              companyName: true,
            },
          },
        },
        distinct: 'stockId',
        take: 7,
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    where: { id: userId },
  });

  if (userWithPortfoliosAndStocks?.recentStocks.length === 0) {
    return {
      portfolios: userWithPortfoliosAndStocks?.portfolios,
      recentStocks: popularStocks.map((stock) => ({
        stock,
      })),
    };
  }
  return userWithPortfoliosAndStocks;
};
