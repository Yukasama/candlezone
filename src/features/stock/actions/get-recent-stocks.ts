'use server';

import { getUser } from '@/features/auth/actions/get-user';
import { db } from '@/lib/db';

interface Props {
  take?: number;
  withDefaults?: boolean;
}

export const getRecentStocks = async ({
  take = 7,
  withDefaults = false,
}: Props) => {
  const user = await getUser();

  let recentStocks =
    user &&
    (await db.userRecentStocks
      .findMany({
        distinct: 'stockId',
        orderBy: { createdAt: 'desc' },
        select: {
          stock: {
            select: {
              companyName: true,
              id: true,
              image: true,
              isEtf: true,
              range: true,
              symbol: true,
            },
          },
        },
        take,
        where: { userId: user.id },
      })
      .then((result) => result.map(({ stock }) => stock)));

  if (!withDefaults || (!!user && !recentStocks)) {
    return recentStocks;
  }

  if (!recentStocks || recentStocks.length === 0) {
    recentStocks = await db.stock.findMany({
      orderBy: { mktCap: 'desc' },
      select: {
        companyName: true,
        id: true,
        image: true,
        isEtf: true,
        range: true,
        symbol: true,
      },
      take,
      where: {
        symbol: { not: { in: ['AXTLF', 'GOOGL'] } },
      },
    });
  }

  return recentStocks;
};
