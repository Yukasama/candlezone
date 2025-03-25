import { siteConfig } from '@/config/site';
import { getBubbleData } from '@/features/home/actions/get-bubble-data';
import { StockBubbleChart } from '@/features/home/bubble-chart';
// import { getSectorPerformance } from '@/lib/fmp/info/get-sector-performance';
// import { SkeletonGrid } from '@/components/ui/skeleton';
// import { WhatsNext } from '@/features/home/whats-next';
import { Suspense } from 'react';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default async function Homepage() {
  const stocks = await getBubbleData();
  // const sectorPerformance = await getSectorPerformance();

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold xl:text-3xl">
          What&apos;s happening today?
        </h1>
        {/* <Suspense fallback={<SkeletonGrid length={4} />}>
          <WhatsNext />
        </Suspense> */}

        <div className="h-[900px]">
          <Suspense>
            <StockBubbleChart stocks={stocks} />
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
