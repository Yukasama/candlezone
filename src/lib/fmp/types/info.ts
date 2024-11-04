export interface Earnings {
  date?: string;
  symbol: string;
  eps?: number;
  epsEstimated: number;
  time: 'bmo' | 'amc';
  revenue?: number;
  revenueEstimated: number;
  fiscalDateEnding?: string;
  updatedFromDate?: string;
}

export interface EconomicEvent {
  date: string;
  country: string;
  event: string;
  currency: string;
  previous?: number;
  estimate?: number;
  actual?: number;
  change?: number;
  impact: 'None' | 'Low' | 'Medium' | 'High';
  changePercentage?: number;
  unit?: string;
}

export interface ListedSymbol {
  symbol: string;
  name: string;
  price: number;
  exchange: string;
  exchangeShortName: string;
  type: string;
}

export interface SectorPE {
  date: string;
  sector: string;
  exchange: string;
  pe: number;
}

export interface NewsItem {
  publishedDate: string;
  title: string;
  image: string;
  site: string;
  text: string;
  url: string;
}
