import { CustomTooltip } from '@/components/custom-tooltip';
import { Loader } from '@/components/loader';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { PriceChart } from '@/features/stock/chart/price-chart';
import { Price } from '@/features/stock/components/price';
import { StockImage } from '@/features/stock/components/stock-image';
import { aiMetrics } from '@/features/stock/config/ai-metric';
import { getStock } from '@/features/stock/lib/queries';
import { AIMetric } from '@/features/stock/symbol/ai-metric';
import { Statistics } from '@/features/stock/symbol/statistics';
import { StockTags } from '@/features/stock/symbol/stock-tags';
import { Valuation, ValuationLoader } from '@/features/stock/symbol/valuation';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ symbol: string }>;
}

export default async function SymbolPage({ params }: Readonly<Props>) {
  const { symbol } = await params;

  const stock = await getStock({ symbol });
  if (!stock) {
    return notFound();
  }

  return (
    <div className="m-5 flex flex-col lg:mx-10 xl:m-12 xl:grid xl:grid-cols-7 xl:gap-8">
      <div></div>
      <div className="col-span-5 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-between gap-5 lg:flex-row">
            <div className="flex gap-3 sm:gap-5">
              <CustomTooltip
                content="Visit Website"
                side="bottom"
                sideOffset={-10}
              >
                <Link
                  className={cn(
                    '-ml-1',
                    !stock.website && 'pointer-events-none',
                  )}
                  href={stock.website ?? ''}
                  prefetch={false}
                  aria-label="Company Website"
                  target="_blank"
                >
                  <StockImage
                    src={stock.image}
                    priority
                    px={92}
                    className="motion-preset-slide-down-sm size-[80px] lg:size-[92px]"
                  />
                </Link>
              </CustomTooltip>
              <div>
                <div className="flex items-center gap-3">
                  <p className="motion-preset-slide-down-sm max-w-[230px] truncate text-[21px] font-semibold lg:max-w-[300px] xl:text-2xl">
                    {stock.companyName}
                  </p>
                  <Popover>
                    <PopoverTrigger
                      className="motion-preset-slide-down-sm"
                      aria-label="See stock info"
                    >
                      <Info className="text-desc size-4" />
                    </PopoverTrigger>
                    <PopoverContent className="bg-accent line-clamp-4 w-80 px-2 text-sm">
                      {stock.description}
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="motion-preset-slide-down-sm text-desc">
                  {stock.symbol}
                </p>
                <div className="mt-2 flex gap-1.5">
                  <StockTags stock={stock} />
                  {stock.earningsDate && (
                    <Badge className="motion-preset-slide-down-sm whitespace-nowrap">
                      {format(stock.earningsDate, 'MMMM d, yyyy')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Price stock={stock} className="lg:hidden" />

            <div className="hidden flex-col gap-1 lg:flex">
              <div className="motion-preset-slide-down-sm flex items-center gap-5">
                {aiMetrics.map((value) => (
                  <AIMetric key={value.title} {...value} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 sm:px-0.5 lg:flex-row lg:items-center">
            <Price stock={stock} className="hidden lg:flex" />
            <Suspense fallback={<ValuationLoader />}>
              <Valuation
                stock={stock}
                update
                className="hidden items-center lg:flex"
              />
            </Suspense>
          </div>
        </div>

        <Suspense>
          <PriceChart symbol={symbol} className="motion-preset-slide-up-sm" />
        </Suspense>

        <div className="flex flex-col gap-1 lg:hidden">
          <h2 className="text-xl font-light">AI Analytics</h2>
          <Separator />
          <div className="flex items-center gap-5">
            {aiMetrics.map((value) => (
              <AIMetric key={value.title} {...value} id="2" />
            ))}
          </div>
        </div>

        <Suspense fallback={<ValuationLoader />}>
          <Valuation stock={stock} className="lg:hidden" />
        </Suspense>

        {!stock.isEtf && (
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-light lg:text-2xl">Statistics</h2>
            <Separator />
            <Suspense fallback={<Loader />}>
              <Statistics stock={stock} />
            </Suspense>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-light lg:text-2xl">Insider Trading</h2>
          <Separator />
        </div>
      </div>
    </div>
  );
}
