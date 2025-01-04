import { searchStocks } from '../actions/search-stocks';
import { getRecentStocks } from '../lib/get-recent-stocks';
import { getStockQuotes } from '../lib/get-stock-quotes';

export type StockQuote = Awaited<ReturnType<typeof getStockQuotes>>[number];

export type StockSearch = Awaited<ReturnType<typeof searchStocks>>[number];

export type RecentStocks = Awaited<ReturnType<typeof getRecentStocks>>;
