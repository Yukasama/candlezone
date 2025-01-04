import { getUser } from '@/features/auth/actions/get-user';
import { db } from '@/lib/db';

interface Props {
  take?: number;
  withDefaults?: boolean;
}

export const getRecentStocks = async ({
  take = 5,
  withDefaults = false,
}: Props) => {
  const user = await getUser();

  let recentStocks =
    user &&
    (await db.userRecentStocks
      .findMany({
        select: {
          stock: {
            select: {
              symbol: true,
              image: true,
              companyName: true,
            },
          },
        },
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        distinct: 'stockId',
        take,
      })
      .then((result) => result.map(({ stock }) => stock)));

  if (!withDefaults) {
    return recentStocks;
  }

  if (!recentStocks || recentStocks.length === 0) {
    recentStocks = await db.stock.findMany({
      select: {
        symbol: true,
        companyName: true,
        image: true,
      },
      orderBy: { mktCap: 'desc' },
      take,
    });
  }

  return recentStocks;
};
