import 'server-only';

export const appConfig = {
  token: {
    verifyTokenExpiry: 1000 * 60 * 60 * 24,
    forgotPasswordExpiry: 1000 * 60 * 60 * 24,
  },
  upload: {
    batchSize: 250,
    concurrencyLimit: 15,
    mileStone: 5000,
    symbolsPerFetch: 1100,
  },
  update: {
    mileStone: 500,
    symbolsPerBatch: 250,
    batchDelay: 60000,
    stocksToUpdate: 5000,
  },
  portfolio: {
    maxStocksPerChange: 50,
  },
  fmp: {
    simulation: false,
    url: 'https://financialmodelingprep.com/api/',
    historyUrl: 'historical-price-full',
  },
};
