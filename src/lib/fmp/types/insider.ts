export interface InsiderTrade {
  symbol: string;
  cik: string;
  year: number;
  quarter: number;
  purchases: number;
  sales: number;
  buySellRatio: number;
  totalBought: number;
  totalSold: number;
  averageBought: number;
  averageSold: number;
  pPurchases: number;
  sSales: number;
}
