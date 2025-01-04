import { db } from '@/lib/db';

export const getFullUser = async ({ userId }: { userId: string }) => {
  return await db.user.findUnique({
    select: {
      portfolios: {
        select: {
          id: true,
          title: true,
          color: true,
          isPublic: true,
        },
        orderBy: { title: 'asc' },
      },
      recentStocks: {
        select: {
          stock: {
            select: {
              symbol: true,
              image: true,
              companyName: true,
            },
          },
        },
        distinct: 'stockId',
        take: 7,
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    where: { id: userId },
  });
};
