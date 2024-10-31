'use server';

import { appConfig } from '@/config/app';
import { env } from '@/env.mjs';
import { Quote } from '@/features/stock/types/quote';
import { QUOTE_SIMULATION } from '@/lib/fmp/simulation';
import { isSymbolValid } from '@/lib/utils/stock-helper';

const config = appConfig.fmp;

export const getServerQuote = async (symbol?: string, allFields?: boolean) => {
  if (config.simulation) {
    return QUOTE_SIMULATION;
  }

  if (!isSymbolValid(symbol)) {
    return;
  }

  const url = `${config.url}v3/quote/${symbol}?apikey=${env.FMP_API_KEY}`;

  try {
    const data = await fetch(url, { next: { revalidate: 5 } }).then(
      (res) => res.json() as Promise<Quote[]>,
    );

    const quote = data[0];
    if (allFields) {
      return quote;
    }

    return {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      changesPercentage: quote.changesPercentage,
      pe: quote.pe,
      eps: quote.eps,
    };
  } catch {
    return;
  }
};
