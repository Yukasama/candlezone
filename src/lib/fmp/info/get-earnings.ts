import { fmpClient } from '@/lib/axios';
import { Earnings } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';
import { formatDate } from '@/lib/utils/date-helpers';
import { isSymbolValid } from '@/lib/utils/stock-helper';
import { addMonths } from 'date-fns';

export const getEarnings = async () => {
  try {
    const today = new Date();
    const threeMonthsLater = addMonths(today, 3);

    const { data } = await fmpClient.get<Earnings[]>(
      `v3/earning_calendar?from=${formatDate(today)}&to=${formatDate(threeMonthsLater)}`,
    );

    return data.filter((entry) => isSymbolValid(entry.symbol));
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getEarnings (error): %s', error.message);
    }
  }
};
