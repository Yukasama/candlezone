import { getQuotes } from '@/lib/fmp/quote/get-quote';
import { Quote } from '@/lib/fmp/types/quote';
import { Stock } from '@prisma/client';

type RequiredStockFields = Pick<Stock, 'id' | 'symbol' | 'companyName'>;

type StockWithAdditionalFields = RequiredStockFields &
  Partial<Omit<Stock, keyof RequiredStockFields>>;

export const getStockQuotes = async (stocks: StockWithAdditionalFields[]) => {
  const quotes = await getQuotes({
    symbols: stocks.map(({ symbol }) => symbol),
  });

  return stocks.map((stock) => ({
    ...stock,
    ...(quotes?.find((q) => q.symbol === stock.symbol) as Quote | undefined),
  }));
};
