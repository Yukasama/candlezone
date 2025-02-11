import type { Stock } from '@prisma/client';

export const isSymbolValid = (symbol: string) => {
  const germanRegex = /^[a-z]{1,4}\.de$/i;
  const genericRegex = /^[a-z]{1,5}$/i;
  const adrRegex = /^[a-z]{4}[yv]$/i;

  if (adrRegex.test(symbol)) {
    return false;
  }

  return germanRegex.test(symbol) || genericRegex.test(symbol);
};

export const isStockValid = (
  stock: Pick<
    Stock,
    'companyName' | 'isFund' | 'marketCap' | 'sector' | 'symbol' | 'website'
  >,
) => {
  return (
    isSymbolValid(stock.symbol) &&
    !!stock.companyName &&
    !!stock.website &&
    stock.isFund === false &&
    !stock.companyName.includes('%')
  );
};

export const formatMarketCap = (value?: null | number, isEUR?: boolean) => {
  if (!value) {
    return '-';
  }

  const formatter = new Intl.NumberFormat(isEUR ? 'de-DE' : 'en-US', {
    currency: isEUR ? 'EUR' : 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: 'currency',
  });

  return formatter.format(value);
};
