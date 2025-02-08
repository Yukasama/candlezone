import { getFullPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { ScreenerFilters } from '@/features/screener/screener-filters';
import { ScreenerView } from '@/features/screener/screener-view';
import { Suspense } from 'react';

export const metadata = { title: 'Stock Screener' };

export default async function ScreenerPage() {
  const portfolios = await getFullPortfoliosByUser();

  return (
    <div className="relative flex gap-8 p-3 lg:px-5">
      <Suspense>
        <ScreenerFilters className="motion-preset-slide-right-sm hidden min-w-[250px] flex-col lg:flex xl:w-[300px]" />
      </Suspense>
      <Suspense>
        <ScreenerView portfolios={portfolios} />
      </Suspense>
    </div>
  );
}
