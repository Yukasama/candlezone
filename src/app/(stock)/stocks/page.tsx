import { SkeletonList } from '@/components/ui/skeleton';
import { StockTable } from '@/features/home/stock-table';
import { getFullPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { getPopularStocks } from '@/features/stock/lib/queries';
import { Suspense } from 'react';

export const metadata = { title: 'Popular Stocks' };

export default async function StockPage() {
  const [portfolios, stocks] = await Promise.all([
    getFullPortfoliosByUser(),
    getPopularStocks(),
  ]);

  const stockQuotes = await getStockQuotes(stocks);
  const stocksWithRank = stockQuotes.map((stock, i) => ({
    ...stock,
    rank: i + 1,
  }));

  return (
    <div className="m-3.5 flex flex-col gap-10 md:mx-8 lg:m-5 lg:mx-16 xl:mx-24">
      <Suspense fallback={<SkeletonList length={12} />}>
        <StockTable stocks={stocksWithRank} portfolios={portfolios} />
      </Suspense>
    </div>
  );
}
