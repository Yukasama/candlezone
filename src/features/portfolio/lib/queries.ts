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
    orderBy: { createdAt: 'asc' },
    where: { userId: user.id },
  });
};

export const getPortfolioPositionsByUser = async () => {
  const user = await getUser();
  if (!user) {
    return;
  }

  const portfolios = await db.portfolio.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      color: true,
      id: true,
      orders: {
        select: {
          deleted: true,
          price: true,
          quantity: true,
          stock: true,
          stockId: true,
          type: true,
        },
        where: {
          deleted: false,
        },
      },
      title: true,
    },
    where: { userId: user.id },
  });

  if (portfolios.length === 0) {
    return [];
  }

  return portfolios.map((portfolio) => {
    const stockMap = mergeOrders(portfolio.orders);
    const positions = [...stockMap.values()].map(({ order, quantity }) => ({
      ...order,
      quantity,
    }));

    return {
      color: portfolio.color,
      id: portfolio.id,
      positions,
      title: portfolio.title,
    };
  });
};

export const getFullPortfolio = async ({
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
              companyName: true,
              earningsDate: true,
              id: true,
              image: true,
              priceToEarningsRatioTTM: true,
              range: true,
              sector: true,
              symbol: true,
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
    ({ order, quantity, totalValue }) => {
      const averagePrice = totalValue / quantity;
      return {
        ...order,
        averagePrice,
        quantity,
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
              companyName: true,
              id: true,
              image: true,
              priceToEarningsRatioTTM: true,
              range: true,
              sector: true,
              symbol: true,
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
        ({ order, quantity, totalValue }) => {
          const averagePrice = totalValue / quantity;
          return {
            ...order,
            price: averagePrice,
            quantity,
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
