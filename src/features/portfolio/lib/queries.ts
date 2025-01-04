import { getUser } from '@/features/auth/actions/get-user';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { db } from '@/lib/db';
import { mergeOrders } from './merge-orders';

export const getPortfoliosByUser = async () => {
  const user = await getUser();
  if (!user) {
    return;
  }

  return await db.portfolio.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });
};

export const getPortfolioPositionsByUser = async () => {
  const user = await getUser();
  if (!user) {
    return;
  }

  const portfolios = await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      color: true,
      orders: {
        select: {
          stockId: true,
          type: true,
          quantity: true,
          price: true,
          stock: true,
          deleted: true,
        },
        where: {
          deleted: false,
        },
      },
    },
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });

  if (portfolios.length === 0) {
    return [];
  }

  return portfolios.map((portfolio) => {
    const stockMap = mergeOrders(portfolio.orders);
    const positions = [...stockMap.values()].map(({ quantity, order }) => ({
      ...order,
      quantity,
    }));

    return {
      id: portfolio.id,
      title: portfolio.title,
      color: portfolio.color,
      positions,
    };
  });
};

export const getFullPortfolios = async ({
  portfolioId,
}: {
  portfolioId: string;
}) => {
  const portfolio = await db.portfolio.findUnique({
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
        averagePrice,
      };
    },
  );

  const stockQuotes = await getStockQuotes(
    validOrders.map(({ stock }) => stock),
  );

  const ordersWithQuotes = stockQuotes.map((stock) => {
    const order = validOrders.find(({ stockId }) => stockId === stock.id);
    return { ...order, stock };
  });

  return {
    ...portfolio,
    orders: ordersWithQuotes,
  };
};

export const getFullPortfoliosByUser = async () => {
  const user = await getUser();
  if (!user) {
    return;
  }

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
    where: { userId: user.id },
  });

  if (portfolios.length === 0) {
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
        const order = validOrders.find(({ stockId }) => stockId === stock.id);
        return { ...order, stock };
      });

      return {
        ...portfolio,
        orders: ordersWithQuotes,
      };
    }),
  );
};
