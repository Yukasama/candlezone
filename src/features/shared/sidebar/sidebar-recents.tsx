import { CustomTooltip } from '@/components/custom-tooltip';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentStocks } from '@/features/stock/actions/get-recent-stocks';
import { StockImage } from '@/features/stock/components/stock-image';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import Link from 'next/link';
import { Suspense } from 'react';

const SKELETON_LENGTH = 5;

export const SidebarRecents = async () => {
  const recentStocks = await getRecentStocks({ take: 7 });

  if (!recentStocks || recentStocks.length === 0) {
    return (
      <div className="f-col items-center gap-1.5">
        {Array.from({ length: SKELETON_LENGTH }).map((_, i) => (
          <div
            key={'skeleton' + String(i)}
            className="bg-faded size-8 rounded-full"
          />
        ))}
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="f-col items-center gap-1.5">
          {Array.from({ length: SKELETON_LENGTH }).map((_, i) => (
            <Skeleton
              key={'skeleton' + String(i)}
              className="size-8 rounded-full"
            />
          ))}
        </div>
      }
    >
      <div className="f-col items-center gap-1">
        {recentStocks.map((stock) => (
          <CustomTooltip
            key={stock.symbol}
            content={
              <Link href={`/stocks/${stock.symbol}`} prefetch={true}>
                <SymbolItem
                  stock={stock}
                  className="pr-2"
                  size="sm"
                  fullLength
                />
              </Link>
            }
          >
            <Link
              href={`/stocks/${stock.symbol}`}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <StockImage src={stock.image} px={25} />
            </Link>
          </CustomTooltip>
        ))}
      </div>
    </Suspense>
  );
};
