export const isSymbolValid = (symbol: string) => {
  const germanRegex = /^[a-z]{1,4}\.de$/i;
  const genericRegex = /^[a-z]{1,5}$/i;
  const adrRegex = /^[a-z]{4}[yv]$/i;

  if (adrRegex.test(symbol)) {
    return false;
  }

  return germanRegex.test(symbol) || genericRegex.test(symbol);
};

export const formatMarketCap = (value: number, isEUR?: boolean) => {
  const formatter = new Intl.NumberFormat(isEUR ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency: isEUR ? 'EUR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value ?? 0);
};
