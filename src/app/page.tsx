import { SkeletonGrid } from '@/components/ui/skeleton';
import { siteConfig } from '@/config/site';
import { IndexChart } from '@/features/home/index-chart';
import { NewsSlider } from '@/features/home/news-slider';
import { WhatsNext } from '@/features/home/whats-next';
import { Suspense } from 'react';

export const metadata = {
  title: `Stock Research & Analysis | ${siteConfig.name}`,
};

export default function Homepage() {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-3">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold xl:text-3xl">
          Whats happening today?
        </h1>
        <NewsSlider />
        <IndexChart />

        <Suspense fallback={<SkeletonGrid />}>
          <WhatsNext />
        </Suspense>
      </div>
    </div>
  );
}
