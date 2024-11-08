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
import { AIMetric } from '@/features/stock/symbol/ai-metric';
import { Statistics } from '@/features/stock/symbol/statistics';
import { StockTags } from '@/features/stock/symbol/stock-tags';
import { Valuation, ValuationLoader } from '@/features/stock/symbol/valuation';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ symbol: string }>;
}

export default async function SymbolPage({ params }: Readonly<Props>) {
  const { symbol } = await params;

  const stock = await db.stock.findFirst({
    select: {
      id: true,
      symbol: true,
      companyName: true,
      image: true,
      earningsDate: true,
      updatedAt: true,
      website: true,
      sector: true,
      industry: true,
      description: true,
      country: true,
      mktCap: true,
      isEtf: true,
    },
    where: { symbol: symbol.toUpperCase() },
  });

  if (!stock) {
    return notFound();
  }

  return (
    <div className="f-col m-5 lg:mx-10 xl:m-12 xl:grid xl:grid-cols-7 xl:gap-8">
      <div></div>
      <div className="f-col col-span-5 gap-7">
        <div className="f-col gap-6">
          <div className="f-col justify-between gap-5 lg:flex-row">
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
                <div className="f-center gap-3">
                  <p className="motion-preset-slide-down-sm max-w-[230px] truncate text-[21px] font-semibold lg:max-w-[300px] xl:text-2xl">
                    {stock.companyName}
                  </p>
                  <Popover>
                    <PopoverTrigger
                      className="motion-preset-slide-down-sm"
                      aria-label="See stock info"
                    >
                      <Info className="size-4 text-gray-400" />
                    </PopoverTrigger>
                    <PopoverContent className="line-clamp-3 bg-accent px-2 text-sm">
                      {stock.description}
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="motion-preset-slide-down-sm text-gray-400">
                  {stock.symbol}
                </p>
                <div className="mt-2 flex gap-1.5">
                  <StockTags stock={stock} />
                  {stock.earningsDate && (
                    <Badge className="motion-preset-slide-down-sm">
                      {format(parseISO(stock.earningsDate), 'MMMM d, yyyy')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Price stock={stock} className="lg:hidden" />

            <div className="f-col gap-1">
              <h2 className="text-xl font-light lg:hidden">AI Analytics</h2>
              <Separator className="lg:hidden" />
              <div className="f-center motion-preset-slide-down-sm gap-5">
                {aiMetrics.map((value) => (
                  <AIMetric key={value.title} {...value} />
                ))}
              </div>
            </div>
          </div>

          <div className="f-col justify-between gap-6 sm:px-0.5 lg:flex-row lg:items-center">
            <Price stock={stock} className="hidden lg:flex" />
            <Suspense fallback={<ValuationLoader />}>
              <Valuation stock={stock} className="f-center hidden lg:flex" />
            </Suspense>
          </div>
        </div>

        <PriceChart
          symbol={symbol}
          className="motion-preset-slide-up-sm -mt-5 lg:mt-0"
        />
        <Suspense fallback={<ValuationLoader />}>
          <Valuation stock={stock} className="lg:hidden" />
        </Suspense>

        {!stock.isEtf && (
          <div className="f-col gap-1">
            <h2 className="text-xl font-light lg:text-2xl">Statistics</h2>
            <Separator />
            <Suspense fallback={<Loader />}>
              <Statistics stock={stock} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
