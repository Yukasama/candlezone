import { StockQuote } from '@/features/stock/types/stock';
import { getQuote } from '@/lib/fmp/quote/get-quote';

export const preparePrice = async (
  currentQuote: StockQuote,
  orderPrice?: number,
) => {
  if (orderPrice !== 0 && orderPrice) {
    return orderPrice;
  }

  const doesPriceExist = !!currentQuote.price;
  const quote = doesPriceExist
    ? currentQuote
    : await getQuote({ symbol: currentQuote.symbol });

  const currentPrice = quote?.price;
  if (!currentPrice) {
    throw new Error('Stock price not available.');
  }

  return currentPrice;
};
