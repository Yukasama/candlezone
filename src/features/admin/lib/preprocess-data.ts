import { appConfig } from '@/config/app';
import { createEarnings } from '@/lib/fmp/earnings-factory';
import { createStock } from '@/lib/fmp/stock-factory';
import { Earnings } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';
import type { Prisma } from '@prisma/client';
import { Profile, RatiosTTM, StockDCF } from '../types/upload';

interface ProcessedStockData {
  dcf: StockDCF | undefined;
  earnings: Earnings[];
  earningsDate: string | undefined;
  peersList: string | undefined;
  profile: Profile;
  ratiosTTM: RatiosTTM | undefined;
}

const { timeToWait } = appConfig.upload;

interface Props {
  data: {
    earnings: {
      fiscalDateEnding: Date | null;
      stockId: number;
    }[];
    id: number;
    symbol: string;
    updatedAt: Date;
  }[];
  startTime: number;
  stocks: ProcessedStockData[];
}

export const preprocessData = ({ data, startTime, stocks }: Props) => {
  const existingStockMap = new Map(
    data.map((st) => [st.symbol.toUpperCase(), st]),
  );
  const latestFiscalDates = new Map<number, Date | null>(
    data.flatMap((st) =>
      st.earnings.map((e) => [st.id, e.fiscalDateEnding] as const),
    ),
  );

  const updates: (Prisma.StockCreateInput & {
    id: number;
  })[] = [];
  const creates: Prisma.StockCreateInput[] = [];
  const earningsData: Omit<
    Prisma.EarningsCreateInput & { stockId: number },
    'stock'
  >[] = [];

  let updatesSkipped = 0;
  for (const stock of stocks) {
    const existing = existingStockMap.get(
      String(stock.profile.symbol).toUpperCase(),
    );
    const commonData = createStock(stock);
    const now = Date.now();

    if (existing) {
      const lastUpdate = existing.updatedAt.getTime();
      const diff = now - lastUpdate;
      if (diff < timeToWait) {
        updatesSkipped++;
        continue;
      }

      updates.push({ ...commonData, id: existing.id });
      const latestFiscal = latestFiscalDates.get(existing.id);
      if (stock.earnings.length > 0) {
        const newEarnings = latestFiscal
          ? stock.earnings.filter(
              (e) =>
                new Date(String(e.fiscalDateEnding)) > new Date(latestFiscal),
            )
          : stock.earnings;

        for (const earning of newEarnings) {
          earningsData.push(createEarnings({ earning, stockId: existing.id }));
        }
      }
    } else {
      creates.push(commonData);
    }
  }

  logger.info(
    'uploadStocks (preprocessed): time=%ss, tx=[updates=%s, creates=%s, earnings=%s, updatesSkipped=%s]',
    ((Date.now() - startTime) / 1000).toFixed(1),
    updates.length,
    creates.length,
    earningsData.length,
    updatesSkipped,
  );

  return { creates, earningsData, updates, updatesSkipped };
};
