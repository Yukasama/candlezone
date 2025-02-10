import 'server-only';

export const appConfig = {
  fmp: {
    historyUrl: 'historical-price-full',
    simulation: false,
    url: 'https://financialmodelingprep.com/stable/',
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
    batchSize: 250,
    concurrencyLimit: 15,
    mileStone: 5000,
    symbolsPerFetch: 1100,
    testSymbols: ['AAPL', 'MSFT'],
  },
};
