import { CustomTooltip } from '@/components/custom-tooltip';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getCompanyOutlook } from '@/lib/fmp/stock/get-company-outlook';
import { cn } from '@/lib/utils';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import type { Stock } from '@prisma/client';
import { after } from 'next/server';
import type { HTMLAttributes } from 'react';
import { updateStock } from '../lib/update-stock';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<Stock, 'id' | 'symbol' | 'mktCap' | 'updatedAt'>;
  update?: boolean;
}

export const Valuation = async ({
  stock,
  className,
  update = false,
}: Readonly<Props>) => {
  const isEUR = stock.symbol.includes('.DE');

  const stockData = await getCompanyOutlook({ symbol: stock.symbol });
  if (!stockData) {
    return (
      <div className={cn('f-col gap-1 sm:py-6', className)}>
        <h2 className="text-xl font-light lg:hidden">Company Valuation</h2>
        <Separator className="sm:mb-2 lg:mb-5 lg:hidden" />
        <div className="lg:f-center grid grid-cols-2 gap-3 pt-2 sm:pt-0 md:gap-5 lg:gap-8">
          No data available
        </div>
      </div>
    );
  }

  const data = [
    {
      title: 'Market Cap',
      value: formatMarketCap(stock.mktCap, isEUR),
      tooltip:
        "Market cap is how much all of a company's shares are worth in the stock market.",
    },
    {
      title: 'P/E Ratio',
      value: stockData.ratios.peRatioTTM?.toFixed(2),
      tooltip:
        "The P/E ratio compares a company's share price to per-share earnings.",
    },
    {
      title: 'P/B Ratio',
      value: stockData.ratios.priceToBookRatioTTM?.toFixed(2),
      tooltip:
        "The P/B ratio compares a company's market capitalization to its book value.",
    },
    {
      title: 'EPS',
      value: stockData.ratios.pegRatioTTM?.toFixed(2),
      tooltip: "EPS measures a company's profit allocated to each stock share.",
    },
  ];

  after(async () => {
    if (update) {
      await updateStock({ stock, stockData });
    }
  });

  return (
    <div className={cn('f-col gap-1 sm:py-6', className)}>
      <h2 className="text-xl font-light lg:hidden">Company Valuation</h2>
      <Separator className="sm:mb-2 lg:mb-5 lg:hidden" />
      <div className="lg:f-center grid grid-cols-2 gap-3 pt-2 sm:pt-0 md:gap-5 lg:gap-8">
        {data.map(({ title, tooltip, value }) => (
          <CustomTooltip key={title} side="bottom" content={tooltip}>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-gray-400 sm:text-[15px]">
                {value ?? 'N/A'}
              </p>
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
      <div className="lg:f-center grid grid-cols-2 gap-3 pt-2 sm:pt-0 md:gap-5 lg:gap-8">
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
