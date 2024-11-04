import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { db } from '@/lib/db';
import { mergeOrders } from './merge-orders';

export const getPortfoliosByUser = async ({ userId }: { userId?: string }) => {
  return await db.portfolio.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
};

export const getFullPortfolios = async ({
  portfolioId,
}: {
  portfolioId: string;
}) => {
  const portfolio = await db.portfolio.findFirst({
    include: {
      orders: {
        include: {
          stock: {
            select: {
              id: true,
              symbol: true,
              companyName: true,
              image: true,
              peRatioTTM: true,
              sector: true,
              earningsDate: true,
              earningsEpsEstimated: true,
            },
          },
        },
        where: {
          deleted: false,
        },
      },
    },
    where: { id: portfolioId },
  });

  if (!portfolio) {
    return;
  }

  const stockMap = mergeOrders(portfolio.orders);
  const validOrders = [...stockMap.values()].map(
    ({ totalValue, quantity, order }) => {
      const averagePrice = totalValue / quantity;
      return {
        ...order,
        quantity,
        price: averagePrice,
      };
    },
  );

  const stockQuotes = await getStockQuotes(
    validOrders.map(({ stock }) => stock),
  );

  const ordersWithQuotes = stockQuotes.map((stock) => {
    const order = validOrders.find(({ stockId }) => stockId === stock.id)!;
    return { ...order, stock };
  });

  return {
    ...portfolio,
    orders: ordersWithQuotes,
  };
};

export const getFullPortfoliosByUser = async ({
  userId,
}: {
  userId: string;
}) => {
  const portfolios = await db.portfolio.findMany({
    include: {
      orders: {
        include: {
          stock: {
            select: {
              id: true,
              symbol: true,
              companyName: true,
              image: true,
              peRatioTTM: true,
              sector: true,
            },
          },
        },
        where: {
          deleted: false,
        },
      },
    },
    where: { userId: userId },
  });

  if (!portfolios || portfolios.length === 0) {
    return [];
  }

  return await Promise.all(
    portfolios.map(async (portfolio) => {
      const stockMap = mergeOrders(portfolio.orders);
      const validOrders = [...stockMap.values()].map(
        ({ totalValue, quantity, order }) => {
          const averagePrice = totalValue / quantity;
          return {
            ...order,
            quantity,
            price: averagePrice,
          };
        },
      );

      const stockQuotes = await getStockQuotes(
        validOrders.map(({ stock }) => stock),
      );

      const ordersWithQuotes = stockQuotes.map((stock) => {
        const order = validOrders.find(({ stockId }) => stockId === stock.id)!;
        return { ...order, stock };
      });

      return {
        ...portfolio,
        orders: ordersWithQuotes,
      };
    }),
  );
};
