import { getFullPortfoliosByUser } from '@/features/portfolio/lib/queries';
import { ScreenerFilters } from '@/features/screener/screener-filters';
import { ScreenerView } from '@/features/screener/screener-view';
import { getUser } from '@/lib/auth';

export const metadata = { title: 'Stock Screener' };

export default async function ScreenerPage() {
  const user = await getUser();
  const portfolios = user
    ? await getFullPortfoliosByUser({ userId: user?.id })
    : [];

  return (
    <div className="relative flex gap-8 p-3 lg:px-5">
      <ScreenerFilters className="lg:f-col motion-preset-slide-right-sm hidden min-w-[250px] xl:w-[300px]" />
      <ScreenerView portfolios={portfolios} />
    </div>
  );
}
