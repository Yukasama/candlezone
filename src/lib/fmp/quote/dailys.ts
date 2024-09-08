import { appConfig } from '@/config/app';
import { FMP_URLS } from '@/config/fmp';
import { QUOTE_SIMULATION } from '@/lib/utils/simulation';
import { isSymbolValid } from '@/lib/utils/stock-helper';
import { Quote } from '@/types/stock';

export const getDailys = async (action: 'actives' | 'winners' | 'losers') => {
  if (appConfig.fmp.simulation) {
    return [
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
      QUOTE_SIMULATION,
    ];
  }

  try {
    const response = await fetch(FMP_URLS[action], {
      cache: 'force-cache',
    }).then((res) => res.json() as Promise<Quote[]>);

    return response.filter((stock) => isSymbolValid(stock.symbol)).slice(0, 6);
  } catch {
    return [];
  }
};
