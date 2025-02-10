import { getRecentStocks } from '../actions/get-recent-stocks';
import { searchStocks } from '../actions/search-stocks';
import { getStockQuotes } from '../lib/get-stock-quotes';

export type RecentStocks = Awaited<ReturnType<typeof getRecentStocks>>;

export type StockQuote = Awaited<ReturnType<typeof getStockQuotes>>[number];

export type StockSearch = Awaited<ReturnType<typeof searchStocks>>[number];
