export interface StockDCF {
  date: string;
  dcfPercentDiff: number;
  discountedCashFlow: number;
  symbol: string;
}

export interface StockPeer {
  peers: string;
  symbol: string;
}
