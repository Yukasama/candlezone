import { getStockQuotes } from '@/lib/fmp/quote/quote';
import { Financials, Stock } from '@prisma/client';

export interface StockWithFinancials extends Stock {
  financials: Financials[];
}

export interface Earnings {
  date: string | null;
  symbol: string;
  eps: number | null;
  epsEstimated: number | null;
  time: 'bmo' | 'amc';
  revenue: number | null;
  revenueEstimated: number | null;
  fiscalDateEnding: string;
  updatedFromDate: string;
}

export type StockQuote = Awaited<ReturnType<typeof getStockQuotes>>[0];
