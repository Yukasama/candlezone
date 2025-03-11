import 'server-only';

export const appConfig = {
  fmp: {
    historyUrl: 'historical-price-full',
    newUrl: 'https://financialmodelingprep.com/stable/',
    simulation: false,
    url: 'https://financialmodelingprep.com/api/',
  },
  portfolio: {
    maxStocksPerChange: 50,
  },
  token: {
    forgotPasswordExpiry: 1000 * 60 * 60,
    verifyTokenExpiry: 1000 * 60 * 60,
  },
  upload: {
    batchSize: 160,
    concurrencyLimit: 5,
    minUpdatesRequired: 100,
    timeToWait: 1000 * 60 * 60 * 6,
  },
};
