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
    forgotPasswordExpiry: 1000 * 60 * 60 * 24,
    verifyTokenExpiry: 1000 * 60 * 60 * 24,
  },
  update: {
    batchDelay: 60000,
    mileStone: 500,
    stocksToUpdate: 5000,
    symbolsPerBatch: 250,
  },
  upload: {
    batchSize: 500,
    concurrencyLimit: 5,
    mileStone: 100,
  },
};
