import { CustomTooltip } from '@/components/ui/custom-tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { formatMarketCap } from '@/utils/stock-helper';
import { Stock } from '@prisma/client';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock: Pick<
    Stock,
    'symbol' | 'mktCap' | 'peRatioTTM' | 'pegRatioTTM' | 'priceToBookRatioTTM'
  >;
}

export const Valuation = ({ stock, className }: Readonly<Props>) => {
  const isEUR = stock.symbol.includes('.DE');

  const data = [
    {
      title: 'Market Cap',
      value: formatMarketCap(stock.mktCap!, isEUR),
      tooltip:
        "Market cap is how much all of a company's shares are worth in the stock market.",
    },
    {
      title: 'P/E Ratio',
      value: stock.peRatioTTM?.toFixed(2),
      tooltip:
        "The P/E ratio compares a company's share price to per-share earnings.",
    },
    {
      title: 'P/B Ratio',
      value: stock.priceToBookRatioTTM?.toFixed(2),
      tooltip:
        "The P/B ratio compares a company's market capitalization to its book value.",
    },
    {
      title: 'EPS',
      value: stock.pegRatioTTM?.toFixed(2),
      tooltip: "EPS measures a company's profit allocated to each stock share.",
    },
  ];

  return (
    <div className={cn('f-col gap-1', className)}>
      <h2 className="flex text-xl font-light md:hidden">Company Valuation</h2>
      <Separator className="flex md:hidden" />
      <div className="grid grid-cols-2 gap-3 pt-2 sm:pt-0 md:flex md:items-center md:gap-5 lg:gap-8">
        {data.map((metric) => (
          <CustomTooltip
            key={metric.title}
            side="bottom"
            content={metric.tooltip}
          >
            <div>
              <p className="font-semibold">{metric.title}</p>
              <p className="text-sm text-gray-400 sm:text-[15px]">
                {metric.value ?? 'N/A'}
              </p>
            </div>
          </CustomTooltip>
        ))}
      </div>
    </div>
  );
};
