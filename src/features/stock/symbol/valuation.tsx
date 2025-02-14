import { CustomTooltip } from '@/components/custom-tooltip';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import type { Stock } from '@prisma/client';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<
    Stock,
    | 'id'
    | 'marketCap'
    | 'netIncomePerShareTTM'
    | 'priceToBookRatioTTM'
    | 'priceToEarningsGrowthRatioTTM'
    | 'priceToEarningsRatioTTM'
    | 'symbol'
  >;
}

export const Valuation = ({ className, stock }: Readonly<Props>) => {
  const isEUR = stock.symbol.includes('.DE');
  const data = [
    {
      title: 'Market Cap',
      tooltip:
        "Market cap is how much all of a company's shares are worth in the stock market.",
      value: formatMarketCap(stock.marketCap, isEUR),
    },
    {
      title: 'P/E Ratio',
      tooltip:
        "The P/E ratio compares a company's share price to per-share earnings.",
      value: stock.priceToEarningsRatioTTM?.toFixed(2) ?? '-',
    },
    {
      title: 'P/B Ratio',
      tooltip:
        "The P/B ratio compares a company's market capitalization to its book value.",
      value: stock.priceToBookRatioTTM?.toFixed(2) ?? '-',
    },
    {
      title: 'EPS',
      tooltip: "EPS measures a company's profit allocated to each stock share.",
      value: stock.netIncomePerShareTTM?.toFixed(2) ?? '-',
    },
  ];

  return (
    <div className={cn('flex flex-col gap-1 sm:py-6', className)}>
      <h2 className="text-xl font-light lg:hidden">Company Valuation</h2>
      <Separator className="sm:mb-2 lg:mb-5 lg:hidden" />
      <div className="grid grid-cols-2 items-center gap-3 pt-2 sm:pt-0 md:gap-5 lg:flex lg:gap-8">
        {data.map(({ title, tooltip, value }) => (
          <CustomTooltip content={tooltip} key={title} side="bottom">
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-desc text-sm sm:text-[15px]">{value}</p>
            </div>
          </CustomTooltip>
        ))}
      </div>
    </div>
  );
};

export const ValuationLoader = ({
  className,
}: Readonly<HTMLAttributes<HTMLDivElement>>) => {
  const data = [
    { title: 'Market Cap' },
    { title: 'P/E Ratio' },
    { title: 'P/B Ratio' },
    { title: 'EPS' },
  ];

  return (
    <div className={cn('flex gap-1 sm:py-6', className)}>
      <h2 className="text-xl font-light lg:hidden">Company Valuation</h2>
      <Separator className="sm:mb-2 lg:mb-5 lg:hidden" />
      <div className="grid grid-cols-2 items-center gap-3 pt-2 sm:pt-0 md:gap-5 lg:flex lg:gap-8">
        {data.map(({ title }) => (
          <div key={`skeleton-${title}-valuation`}>
            <p className="font-semibold">{title}</p>
            <Skeleton className="h-5 w-14" />
          </div>
        ))}
      </div>
    </div>
  );
};
