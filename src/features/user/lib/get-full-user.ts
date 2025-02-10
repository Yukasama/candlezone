import { db } from '@/lib/db';

export const getFullUser = async ({ userId }: { userId: string }) => {
  return await db.user.findUnique({
    select: {
      portfolios: {
        orderBy: { title: 'asc' },
        select: {
          color: true,
          id: true,
          isPublic: true,
          title: true,
        },
      },
      recentStocks: {
        distinct: 'stockId',
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          stock: {
            select: {
              companyName: true,
              image: true,
              symbol: true,
            },
          },
        },
        take: 7,
      },
    },
    where: { id: userId },
  });
};
