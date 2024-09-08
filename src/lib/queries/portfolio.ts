import { db } from '@/lib/db';
import { getStockQuotes } from '@/lib/fmp/quote/quote';
import { OrderWithStock } from '@/types/portfolio';

export const getPortfoliosByUser = async ({ userId }: { userId?: string }) => {
  return await db.portfolio.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });
};

export const getPortfoliosWithStockIdsByUser = async ({
  userId,
}: {
  userId?: string;
}) => {
  return await db.portfolio.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: {
      orders: {
        select: { stockId: true },
        distinct: ['stockId'],
      },
    },
  });
};

export const getPortfoliosWithStocksByUser = async ({
  userId,
}: {
  userId?: string;
}) => {
  return await db.portfolio.findMany({
    include: {
      orders: {
        select: {
          stockId: true,
          stock: {
            select: {
              symbol: true,
              image: true,
              companyName: true,
            },
          },
        },
        distinct: ['stockId'],
        where: {
          deleted: false,
        },
      },
    },
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPortfolioWithPositions = async ({
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
    return {
      ...order,
      stock,
    };
  });

  return {
    ...portfolio,
    orders: ordersWithQuotes,
  };
};

export const getPortfoliosWithPositionsByUser = async ({
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
        return {
          ...order,
          stock,
        };
      });

      return {
        ...portfolio,
        orders: ordersWithQuotes,
      };
    }),
  );
};

const mergeOrders = (orders: OrderWithStock[]) => {
  const stockMap = new Map<
    string,
    {
      quantity: number;
      order: OrderWithStock;
      totalValue: number;
    }
  >();

  for (const order of orders) {
    const existing = stockMap.get(order.stockId);
    const amount = order.type === 'BUY' ? order.quantity : -order.quantity;
    const newQuantity = existing ? existing.quantity + amount : amount;

    const totalValue = existing
      ? existing.totalValue + order.price * amount
      : order.price * amount;

    if (newQuantity > 0) {
      stockMap.set(order.stockId, {
        quantity: newQuantity,
        order: existing?.order ?? order,
        totalValue,
      });
    } else {
      stockMap.delete(order.stockId);
    }
  }

  return stockMap;
};
