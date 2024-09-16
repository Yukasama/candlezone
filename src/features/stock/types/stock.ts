import { getStockQuotes } from '@/lib/fmp/quote/quote';
import { Financials, Stock } from '@prisma/client';

export interface StockWithFinancials extends Stock {
  financials: Financials[];
}

export type StockQuote = Awaited<ReturnType<typeof getStockQuotes>>[0];
