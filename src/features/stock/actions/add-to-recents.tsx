import { db } from '@/lib/db';

export const addToRecents = async ({
  userId,
  stockId,
}: {
  userId: string;
  stockId: string;
}) => {
  const oneDayAgo = new Date(Date.now() - 60000 * 60 * 24);
  const recentEntry = await db.userRecentStocks.count({
    where: {
      userId,
      stockId,
      createdAt: { gte: oneDayAgo },
    },
  });

  if (!recentEntry) {
    await db.userRecentStocks.create({
      data: {
        userId,
        stockId,
      },
    });
  }
};
