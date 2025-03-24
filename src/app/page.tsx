import { siteConfig } from '@/config/site';
import { StockBubbleChart } from '@/features/home/bubble-chart';
import { getStockQuotes } from '@/features/stock/lib/get-stock-quotes';
import { db } from '@/lib/db';
// import { getSectorPerformance } from '@/lib/fmp/info/get-sector-performance';
// import { SkeletonGrid } from '@/components/ui/skeleton';
// import { WhatsNext } from '@/features/home/whats-next';
import { Suspense } from 'react';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default async function Homepage() {
  const stocks = await db.stock.findMany({
    orderBy: { marketCap: 'desc' },
    select: {
      companyName: true,
      country: true,
      earningsDate: true,
      id: true,
      image: true,
      marketCap: true,
      priceToEarningsRatioTTM: true,
      sector: true,
      symbol: true,
    },
    take: 70,
    where: {
      isEtf: false,
      symbol: { not: { contains: '.', in: ['AXTLF', 'GOOGL'] } },
    },
  });

  const stockQuotes = await getStockQuotes(stocks);
  // const sectorPerformance = await getSectorPerformance();

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold xl:text-3xl">
          What&asp;s happening today?
        </h1>
        {/* <Suspense fallback={<SkeletonGrid length={4} />}>
          <WhatsNext />
        </Suspense> */}

        <div className="h-[800px]">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <p>Loading market overview...</p>
              </div>
            }
          >
            <StockBubbleChart stocks={stockQuotes} />
          </Suspense>
        </div>

        {/* <div className="flex flex-col items-start gap-2 lg:flex-row">
          {sectorPerformance && (
            <SectorPerformanceChart data={sectorPerformance} />
          )}
        </div> */}
      </div>
    </div>
  );
}
