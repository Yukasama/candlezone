import { getStockQuotes } from '@/lib/fmp/quote/quote';
import { Financials, Stock } from '@prisma/client';

export interface StockWithFinancials extends Stock {
  financials: Financials[];
}

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

export type StockQuote = Awaited<ReturnType<typeof getStockQuotes>>[0];
