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
          id: true,
          symbol: true,
          companyName: true,
          image: true,
          sector: true,
          range: true,
          peRatioTTM: true,
        },
      },
    },
    where: { portfolioId },
    orderBy: { date: 'desc' },
  });
};
