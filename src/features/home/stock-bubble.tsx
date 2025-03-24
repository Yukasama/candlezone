import { CustomTooltip } from '@/components/custom-tooltip';
import { cn } from '@/lib/utils';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import Link from 'next/link';
import { StockCard } from '../stock/components/stock-card';
import { StockImage } from '../stock/components/stock-image';
import { StockQuote } from '../stock/types/stock';
import {
  formatParameterValue,
  getBackgroundOpacity,
  getBorderOpacity,
} from './lib/bubble-helpers';

interface StockBubbleProps {
  isHovered: boolean;
  isOtherHovered: boolean;
  position: {
    exceedsRange: boolean;
    excessAmount: number;
    isPositive: boolean;
    originalChangePct: number;
    size: number;
    x: number;
    y: number;
  };
  setHoveredStock: (symbol?: string) => void;
  stock: StockQuote;
}

export const StockBubble = ({
  isHovered,
  isOtherHovered,
  position,
  setHoveredStock,
  stock,
}: StockBubbleProps) => {
  const { exceedsRange, isPositive, originalChangePct, size, x, y } = position;
  const bgOpacity = getBackgroundOpacity(originalChangePct);
  const borderOpacity = getBorderOpacity(originalChangePct);

  const getAnimationDelay = () => {
    if (!stock.symbol || stock.symbol.length === 0) {
      return '0s';
    }
    const codePoint = stock.symbol.codePointAt(0) ?? 65;
    return `${((codePoint % 10) / 6).toFixed(2)}s`;
  };

  const tooltipContent = (
    <div className="space-y-3 p-1">
      <StockCard stock={stock} />

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Price</p>
          <p className="font-medium">${stock.price?.toFixed(2)}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Market Cap</p>
          <p className="font-medium">
            {formatParameterValue('marketCap', stock.marketCap ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CustomTooltip
        className="rounded-xl"
        content={tooltipContent}
        key={stock.symbol}
        side="top"
      >
        <Link
          className={cn(
            'absolute top-0 left-0 flex cursor-pointer items-center justify-center rounded-full border',
            !isHovered && 'motion-preset-oscillate-sm motion-duration-2000',
            isPositive ? 'border-success' : 'border-destructive',
            isOtherHovered && 'opacity-40 grayscale',
          )}
          href={`/stocks/${stock.symbol}`}
          onMouseEnter={() => setHoveredStock(stock.symbol)}
          onMouseLeave={() => setHoveredStock(undefined)}
          style={{
            animationDelay: getAnimationDelay(),
            animationFillMode: 'forwards',
            animationTimingFunction: 'ease-in-out',
            backgroundColor: isPositive
              ? `rgba(22, 163, 74, ${String(bgOpacity)})`
              : `rgba(225, 29, 72, ${String(bgOpacity)})`,
            borderColor: isPositive
              ? `rgba(22, 163, 74, ${String(borderOpacity)})`
              : `rgba(225, 29, 72, ${String(borderOpacity)})`,
            boxShadow: isPositive
              ? `0 0 12px 3px rgba(22, 163, 74, 0.15), 0 0 24px 6px rgba(22, 163, 74, 0.08)`
              : `0 0 12px 3px rgba(225, 29, 72, 0.15), 0 0 24px 6px rgba(225, 29, 72, 0.08)`,
            height: size,
            transform: `translate(${String(x - size / 2)}px, ${String(y - size / 2)}px)`,
            transition:
              'transform 1000ms cubic-bezier(0.2, 0.8, 0.2, 1), background-color 300ms ease, border-color 300ms ease, opacity 300ms ease, filter 300ms ease, z-index 0ms',
            width: size,
            zIndex: isHovered ? 10 : 1,
          }}
        >
          <div className="flex flex-col items-center">
            <StockImage px={size / 2} src={stock.image} />
            <p
              className={cn(
                'text-[15px] font-semibold',
                isPositive ? 'text-success' : 'text-destructive',
              )}
            >
              {isPositive ? '+' : ''}
              {originalChangePct.toFixed(2)}%
            </p>
            {exceedsRange && (
              <div
                className={cn(
                  'absolute -right-3 rounded-full lg:-right-1.5',
                  isPositive
                    ? 'bg-success/80 top-3 lg:top-4.5'
                    : 'bg-destructive/80 bottom-5 lg:bottom-6',
                )}
              >
                {isPositive ? (
                  <ArrowBigUp size={20} strokeWidth={1.5} />
                ) : (
                  <ArrowBigDown size={20} strokeWidth={1.5} />
                )}
              </div>
            )}
          </div>
        </Link>
      </CustomTooltip>
    </>
  );
};
