import { CustomTooltip } from '@/components/custom-tooltip';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentStocks } from '@/features/stock/actions/get-recent-stocks';
import { StockCard } from '@/features/stock/components/stock-card';
import { StockImage } from '@/features/stock/components/stock-image';
import Link from 'next/link';
import { Suspense } from 'react';

const SKELETON_LENGTH = 5;

export const SidebarRecents = async () => {
  const recentStocks = await getRecentStocks({});

  if (recentStocks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        {Array.from({ length: SKELETON_LENGTH }).map((_, i) => (
          <div
            className="bg-faded size-8 rounded-full"
            key={'skeleton' + String(i)}
          />
        ))}
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-1.5">
          {Array.from({ length: SKELETON_LENGTH }).map((_, i) => (
            <Skeleton
              className="size-8 rounded-full"
              key={'skeleton' + String(i)}
            />
          ))}
        </div>
      }
    >
      <div className="flex flex-col items-center gap-1">
        {recentStocks.map((stock) => (
          <CustomTooltip
            content={
              <Link href={`/stocks/${stock.symbol}`} prefetch={true}>
                <StockCard stock={stock} width={200} />
              </Link>
            }
            key={stock.symbol}
          >
            <Link
              className={buttonVariants({ size: 'icon', variant: 'ghost' })}
              href={`/stocks/${stock.symbol}`}
            >
              <StockImage px={25} src={stock.image} />
            </Link>
          </CustomTooltip>
        ))}
      </div>
    </Suspense>
  );
};
