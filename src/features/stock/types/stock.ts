import type { Financials, Stock } from '@prisma/client';
import { getStockQuotes } from '../lib/get-stock-quotes';

export interface StockWithFinancials extends Stock {
  financials: Financials[];
}

export type StockQuote = Awaited<ReturnType<typeof getStockQuotes>>[number];
