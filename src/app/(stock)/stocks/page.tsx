import { Skeleton } from '@/components/ui/skeleton';
import { StockTable } from '@/features/home/stock-table';
import { getFullPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { getPopularStocks } from '@/features/stock/lib/queries';
import { getUser } from '@/lib/auth';
import { Suspense } from 'react';

export const metadata = { title: 'Popular Stocks' };
export const runtime = 'edge';

export default async function StockPage() {
  const user = await getUser();
  const [portfolios, stocks] = await Promise.all([
    user ? getFullPortfoliosByUser({ userId: user?.id }) : [],
    getPopularStocks(),
  ]);

  const stockQuotes = await getStockQuotes(stocks);
  const stocksWithRank = stockQuotes.map((stock, i) => ({
    ...stock,
    rank: i + 1,
  }));

  return (
    <div className="f-col m-3.5 gap-10 md:mx-8 lg:m-5 lg:mx-16 xl:mx-24">
      <Suspense
        fallback={Array.from({ length: 12 }, (_, i) => (
          <Skeleton className="my-1.5 h-14 w-full" key={`skeleton-${i}`} />
        ))}
      >
        <StockTable stocks={stocksWithRank} portfolios={portfolios} />
      </Suspense>
    </div>
  );
}
