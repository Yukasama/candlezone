const baseFeatures = ['Stock Screener'];

export const PLANS = [
  {
    description: 'Free forever, no credit card required',
    eye: false,
    features: ['2 Portfolios', '10 Symbols per Portfolio', ...baseFeatures],
    maxPortfolios: 2,
    maxSymbolsPerPortfolio: 10,
    name: 'Personal',
    price: {
      amount: 0,
      priceIds: {
        production: '',
        test: '',
      },
    },
  },
  {
    description: 'Discover new products and features',
    eye: true,
    features: [
      '5 Portfolios',
      '25 Symbols per Portfolio',
      ...baseFeatures,
      'AI Stock Ratings',
    ],
    maxPortfolios: 5,
    maxSymbolsPerPortfolio: 25,
    name: 'Starter',
    price: {
      amount: 9.99,
      priceIds: {
        production: '',
        test: 'price_1NuEwTA19umTXGu8MeS3hN8L',
      },
    },
  },
  {
    description: 'Advanced stock analysis harnessing AI',
    eye: true,
    features: [
      '10 Portfolios',
      '100 Symbols per Portfolio',
      ...baseFeatures,
      'AI Stock Ratings',
      'Stock Backtesting',
    ],
    maxPortfolios: 10,
    maxSymbolsPerPortfolio: 100,
    name: 'Premium',
    price: {
      amount: 19.99,
      priceIds: {
        production: '',
        test: 'price_1NuEwTA19umTXGu8MeS3hN8L',
      },
    },
  },
];

export type PlanType = (typeof PLANS)[0];
