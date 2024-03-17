import { db } from "../db";

export async function getPortfoliosByUserId(userId: string | undefined) {
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
}
