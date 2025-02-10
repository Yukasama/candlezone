export interface PortfolioChartData {
  domain: [number, number];
  endPrice: number;
  positive: boolean;
  results: PortfolioHistory[];
  startPrice: number;
  today: number;
}

export interface PortfolioHistory {
  date: string;
  realizedPL?: number;
  return: number;
}
