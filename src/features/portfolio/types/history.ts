export interface PortfolioHistory {
  date: string;
  return: number;
  realizedPL?: number;
}

export interface PortfolioChartData {
  domain: [number, number];
  startPrice: number;
  endPrice: number;
  today: number;
  positive: boolean;
  results: PortfolioHistory[];
}
