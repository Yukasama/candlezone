import { db } from '@/lib/db';

export const getOrdersByPortfolio = async ({
  portfolioId,
}: {
  portfolioId: string;
}) => {
  return await db.portfolioOrder.findMany({
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
    orderBy: { date: 'desc' },
    where: { portfolioId },
  });
};
