import type { EarningsTime } from '@prisma/client';

export interface Earnings {
  date?: string;
  eps?: number;
  epsEstimated: number;
  fiscalDateEnding?: string;
  revenue?: number;
  revenueEstimated: number;
  symbol: string;
  time: EarningsTime;
  updatedFromDate?: string;
}

export interface EarningsCall {
  content: string;
  date: string;
  quarter: number;
  symbol: string;
  year: number;
}

export interface EconomicCalendarItem {
  actual?: number;
  change?: number;
  changePercentage?: number;
  country: string;
  currency: string;
  date: string;
  estimate?: number;
  event: string;
  impact: 'High' | 'Low' | 'Medium' | 'None';
  previous?: number;
  unit?: string;
}

export interface NewsItem {
  image: string;
  publishedDate: string;
  site: string;
  text: string;
  title: string;
  url: string;
}

export interface SectorPE {
  date: string;
  exchange: string;
  pe: number;
  sector: string;
}

export interface SectorPerformance {
  averageChange: number;
  date: string;
  exchange: string;
  sector: string;
}
