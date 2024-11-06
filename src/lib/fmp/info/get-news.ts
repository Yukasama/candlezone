import { fmpClient } from '@/lib/axios';
import { NewsItem } from '@/lib/fmp/types/info';
import { logger } from '@/lib/logger';

export const getNews = async () => {
  try {
    const { data } = await fmpClient.get<NewsItem[]>('v4/general_news?page=0', {
      next: { revalidate: 60 * 60 * 24 },
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logger.error('getNews (error): %s', error.message);
    }
  }
};
