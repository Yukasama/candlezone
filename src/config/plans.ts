export const PLANS = [
  {
    name: "Personal",
    description: "Free forever, no credit card required",
    maxPortfolios: 2,
    maxSymbolsPerPortfolio: 10,
    eye: false,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
    features: ["2 Portfolios", "10 Symbols per Portfolio", "Stock Screener"],
  },
  {
    name: "Starter",
    description: "Discover new products and features",
    maxPortfolios: 5,
    maxSymbolsPerPortfolio: 25,
    eye: true,
    price: {
      amount: 9.99,
      priceIds: {
        test: "price_1NuEwTA19umTXGu8MeS3hN8L",
        production: "",
      },
    },
    features: [
      "5 Portfolios",
      "25 Symbols per Portfolio",
      "Stock Screener",
      "AI Stock Ratings",
    ],
  },
  {
    name: "Premium",
    description: "Advanced stock analysis harnessing AI",
    maxPortfolios: 10,
    maxSymbolsPerPortfolio: 100,
    eye: true,
    price: {
      amount: 19.99,
      priceIds: {
        test: "price_1NuEwTA19umTXGu8MeS3hN8L",
        production: "",
      },
    },
    features: [
      "10 Portfolios",
      "100 Symbols per Portfolio",
      "Stock Screener",
      "AI Stock Ratings",
      "Stock Backtesting",
    ],
  },
];

export type PlanType = (typeof PLANS)[0];
