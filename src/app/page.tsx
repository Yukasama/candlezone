import { siteConfig } from '@/config/site';
import { BubbleChartLoader } from '@/features/home/bubble-chart-loader';
import { StockBubbleChartWrapper } from '@/features/home/bubble-chart-wrapper';
import { Suspense } from 'react';
// import { getSectorPerformance } from '@/lib/fmp/info/get-sector-performance';
// import { SkeletonGrid } from '@/components/ui/skeleton';
// import { WhatsNext } from '@/features/home/whats-next';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default function Homepage() {
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
          <Suspense fallback={<BubbleChartLoader />}>
            <StockBubbleChartWrapper />
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
