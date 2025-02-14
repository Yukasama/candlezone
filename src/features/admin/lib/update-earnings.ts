import { createEarnings } from '@/lib/fmp/earnings-factory';
import { Earnings } from '@/lib/fmp/types/info';
import type { Prisma } from '@prisma/client';

export const upsertEarnings = async (
  tx: Prisma.TransactionClient,
  stockId: number,
  earnings: Earnings[],
) => {
  for (const earning of earnings) {
    const date = new Date(String(earning.date));
    const year = date.getFullYear();

    const existingEarning = await tx.earnings.findFirst({
      where: {
        AND: [
          { date: { gte: new Date(year, date.getMonth(), 1) } },
          { date: { lt: new Date(year, date.getMonth() + 1, 1) } },
          earning.fiscalDateEnding
            ? { fiscalDateEnding: new Date(String(earning.fiscalDateEnding)) }
            : {},
        ],
        stockId,
      },
    });

    const data = createEarnings({ earning, stockId });

    await (existingEarning
      ? tx.earnings.update({
          data,
          where: { id: existingEarning.id },
        })
      : tx.earnings.create({ data }));
  }
};
