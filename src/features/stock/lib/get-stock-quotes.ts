import { getQuotes } from '@/lib/fmp/quote/get-quotes';
import { Quote } from '@/lib/fmp/types/quote';
import type { Stock } from '@prisma/client';

type RequiredStockFields = Pick<Stock, 'companyName' | 'id' | 'symbol'>;

type StockWithAdditionalFields = Partial<
  Omit<Stock, keyof RequiredStockFields>
> &
  RequiredStockFields;

export const getStockQuotes = async (stocks: StockWithAdditionalFields[]) => {
  const quotes = await getQuotes({
    symbols: stocks.map(({ symbol }) => symbol),
  });

  return stocks.map((stock) => ({
    ...stock,
    ...(quotes?.find((q) => q.symbol === stock.symbol) as Quote | undefined),
  }));
};
