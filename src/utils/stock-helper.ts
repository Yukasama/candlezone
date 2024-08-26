import { Quote } from '@/types/stock';

export const isSymbolValid = (symbol?: string) => {
  const germanRegex = /^[a-z]{1,4}\.de$/i;
  const genericRegex = /^[a-z]{1,5}$/i;

  return germanRegex.test(symbol ?? '') || genericRegex.test(symbol ?? '');
};

export const formatMarketCap = (value?: number, isEUR?: boolean) => {
  const formatter = new Intl.NumberFormat(isEUR ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency: isEUR ? 'EUR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(value ?? 0);
};

export const getQuoteBySymbol = ({
  quotes,
  symbol,
}: {
  quotes: Quote[];
  symbol: string;
}) => {
  return quotes.find((quote) => quote.symbol === symbol);
};
