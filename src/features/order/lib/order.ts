import { db } from '@/lib/db';

export const getOrdersWithStockByPortfolioId = async ({
  portfolioId,
}: {
  portfolioId: string;
}) => {
  return await db.portfolioOrder.findMany({
    include: {
      stock: {
        select: {
          id: true,
          symbol: true,
          companyName: true,
          image: true,
          sector: true,
          peRatioTTM: true,
        },
      },
    },
    where: { portfolioId },
    orderBy: { date: 'desc' },
  });
};
