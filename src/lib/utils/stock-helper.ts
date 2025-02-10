export const isSymbolValid = (symbol: string) => {
  const germanRegex = /^[a-z]{1,4}\.de$/i;
  const genericRegex = /^[a-z]{1,5}$/i;
  const adrRegex = /^[a-z]{4}[yv]$/i;

  if (adrRegex.test(symbol)) {
    return false;
  }

  return germanRegex.test(symbol) || genericRegex.test(symbol);
};

export const isStockValid = ({
  name,
  price,
  symbol,
  type,
}: {
  name: string;
  price: number;
  symbol: string;
  type: string;
}) => {
  return (
    isSymbolValid(symbol) &&
    !!name &&
    !!price &&
    type !== 'trust' &&
    !name.includes('%')
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
