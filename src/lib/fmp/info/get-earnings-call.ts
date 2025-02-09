import { fmpClient } from '@/lib/axios';
import { EarningsCall } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';

export const getEarningsCall = async ({ symbol }: { symbol: string }) => {
  try {
    const { data } = await fmpClient.get<EarningsCall>(
      `v3/earning_call_transcript/${symbol}`,
    );

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('getEarningsCall (error): %s', error.message);
    }
  }
};
