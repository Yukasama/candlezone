'use client';

import { StockImage } from '@/features/stock/components/stock-image';
import { StockQuote } from '@/features/stock/types/stock';
import { sectorColors } from '@/lib/fmp/data/filters';
import { cn } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import Link from 'next/link';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  asLink?: boolean;
  showPrice?: boolean;
  stock: Pick<
    StockQuote,
    | 'changesPercentage'
    | 'companyName'
    | 'image'
    | 'price'
    | 'sector'
    | 'symbol'
  >;
  subtext?: string;
}

interface StockCardProps extends Props {
  width?: number;
}

export const StockCard = ({
  asLink,
  className,
  showPrice,
  stock,
  subtext,
  width = 250,
}: StockCardProps) => {
  const isPositive = (stock.changesPercentage ?? 0) >= 0;

  return (
    <>
      {asLink ? (
        <Link
          className={cn(
            'group bg-accent/70 hover:border-accent-foreground/20 hover:bg-accent flex h-[56px] items-center gap-2 rounded-xl border p-3 pr-2 transition-all duration-300 ease-out hover:scale-[1.01]',
            isPositive
              ? 'hover:shadow-success/20'
              : 'hover:shadow-destructive/20',
            showPrice ? 'min-w-[340px]' : 'w-[240px]',
            className,
          )}
          href={`/stocks/${stock.symbol}`}
          style={{ width: `${String(width)}px` }}
        >
          <StockCardModel
            className={cn(className)}
            showPrice={showPrice}
            stock={stock}
            subtext={subtext}
          />
        </Link>
      ) : (
        <div
          className={cn(
            'flex h-[40px] items-center gap-[7px] rounded-xl',
            className,
          )}
          style={{ width: `${String(width)}px` }}
        >
          <StockCardModel
            className={cn(className)}
            showPrice={showPrice}
            stock={stock}
            subtext={subtext}
          />
        </div>
      )}
    </>
  );
};

const StockCardModel = ({ asLink, showPrice, stock, subtext }: Props) => {
  const isPositive = (stock.changesPercentage ?? 0) >= 0;
  const bgColor = Object.keys(sectorColors).includes(stock.sector ?? '')
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sectorColors[stock.sector!]
    : '#32CD32';

  return (
    <>
      <div className="bg-muted-foreground/10 border-muted-foreground/15 rounded-full border p-1 transition-all duration-300">
        <StockImage px={asLink ? 34 : 25} src={stock.image} />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="truncate text-start text-sm font-medium">
          {stock.companyName}
        </p>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-muted-foreground/85 font-medium">
            {stock.symbol}
          </span>
          <div
            className="mt-[1px] h-2 min-w-2 rounded-full"
            style={{ backgroundColor: bgColor }}
          />
          <p className="text-muted-foreground/80 truncate">
            {subtext ?? stock.sector}
          </p>
        </div>
      </div>
      {showPrice && (
        <div className="flex flex-col items-end gap-0.5 rounded-lg px-2 py-1 transition-colors duration-300">
          <p className="text-sm font-medium tracking-tight">
            $
            {stock.price?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              isPositive ? 'text-success' : 'text-destructive',
            )}
          >
            {isPositive ? (
              <ArrowBigUp
                className="text-success"
                fill={'var(--color-success)'}
                size={15}
              />
            ) : (
              <ArrowBigDown
                className="text-destructive"
                fill={'var(--color-destructive)'}
                size={15}
              />
            )}
            {isPositive ? '+' : ''}
            {stock.changesPercentage?.toFixed(2)}%
          </p>
        </div>
      )}
    </>
  );
};
