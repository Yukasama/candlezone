import { db } from '@/lib/db';
import { revalidateTag } from 'next/cache';

export const addToRecents = async ({
  stockId,
  userId,
}: {
  stockId: string;
  userId: string;
}) => {
  const oneDayAgo = new Date(Date.now() - 60000 * 60 * 24);
  const recentEntry = await db.userRecentStocks.count({
    where: {
      createdAt: { gte: oneDayAgo },
      stockId,
      userId,
    },
  });

  if (!recentEntry) {
    await db.userRecentStocks.create({
      data: {
        stockId,
        userId,
      },
    });
    revalidateTag(`recent-stocks-${userId}`);
  }
};
