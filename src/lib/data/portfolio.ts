import { db } from "../db";

export const getPortfoliosByUserId = async (userId?: string) => {
  return await db.portfolio.findMany({
    select: {
      id: true,
      title: true,
      color: true,
      createdAt: true,
      isPublic: true,
      stocks: {
        select: { stockId: true },
      },
    },
    where: { userId },
  });
};
