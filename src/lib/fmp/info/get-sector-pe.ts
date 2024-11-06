import { fmpClient } from '@/lib/axios';
import { SectorPE } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';
import { formatDate } from '@/lib/utils/date-helpers';

export const getSectorPe = async () => {
  try {
    const today = formatDate(new Date());

    const { data } = await fmpClient.get<SectorPE[]>(
      `/v4/sector_price_earning_ratio?date=${today}&exchange=NYSE`,
      { next: { revalidate: 60 * 60 * 1 } },
    );

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getSectorPe (error): %s', error.message);
    }
  }
};
