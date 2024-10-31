import { db } from '@/lib/db';
import { addDays, format } from 'date-fns';

export const getCurrentEarnings = async ({ monday }: { monday: Date }) => {
  const mondayFormatted = format(monday, 'yyyy-MM-dd');
  const friday = format(addDays(monday, 4), 'yyyy-MM-dd');

  return await db.stock.findMany({
    select: {
      symbol: true,
      companyName: true,
      image: true,
      mktCap: true,
      earningsDate: true,
      earningsEpsEstimated: true,
      earningsTime: true,
      earningsRevenue: true,
      earningsRevenueEstimated: true,
      earningsEps: true,
    },
    where: {
      earningsDate: {
        gte: mondayFormatted,
        lte: friday,
      },
      symbol: {
        not: {
          contains: '.DE',
          equals: 'GOOGL',
        },
      },
      country: 'US',
    },
    orderBy: {
      mktCap: 'desc',
    },
    take: 100,
  });
};
