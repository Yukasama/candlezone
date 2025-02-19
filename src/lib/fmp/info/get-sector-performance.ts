import { fmpNewClient } from '@/lib/axios';
import { SectorPerformance } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';
import { formatDate } from '@/lib/utils/date-helpers';

export const getSectorPerformance = async () => {
  try {
    const today = formatDate(new Date());

    const { data } = await fmpNewClient.get<SectorPerformance[]>(
      `/sector-performance-snapshot?date=${today}`,
      { next: { revalidate: 60 * 2 } },
    );

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logger.debug('getSectorPerformance (error): %s', error.message);
    }
  }
};
