import { appConfig } from '@/config/app';
import { Quote } from '@/features/stock/types/quote';
import { INDEXQUOTES_SIMULATION } from '@/lib/fmp/simulation';
import 'server-only';
import { FMP_URLS } from '../config';

export const getIndexQuotes = async (allFields?: boolean) => {
  if (appConfig.fmp.simulation) {
    return INDEXQUOTES_SIMULATION;
  }

  const requiredIndexes = new Set(['^GSPC', '^GDAXI', '^NDX', '^DJI']);

  const data = await fetch(FMP_URLS.indexQuotes, {
    next: { revalidate: 30 },
  }).then((res) => res.json() as Promise<Quote[]>);

  const results = data.filter((result) => requiredIndexes.has(result.symbol));

  if (allFields) {
    return results;
  }

  return results?.map((res) => {
    return {
      symbol: res.symbol,
      name: res.name,
      price: res.price,
      changesPercentage: res.changesPercentage,
    };
  });
};
