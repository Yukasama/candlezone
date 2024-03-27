import { Portfolio, StockInPortfolio } from "@prisma/client";

export interface PortfolioWithStocks extends Portfolio {
  stocks: Pick<StockInPortfolio, "stockId">[];
}
