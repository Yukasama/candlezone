import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import type { HTMLAttributes } from 'react';
import { StockImage } from './stock-image';

interface Props extends HTMLAttributes<HTMLDivElement> {
  stock?: Pick<Stock, 'symbol' | 'companyName'> & Partial<Pick<Stock, 'image'>>;
  size?: 'sm' | 'md';
  fullLength?: boolean;
}

export const SymbolItem = ({
  stock,
  size = 'md',
  fullLength,
  className,
}: Readonly<Props>) => {
  const isSmall = size === 'sm';

  return (
    <div
      className={cn(
        'flex items-center gap-[9px]',
        isSmall ? 'gap-2' : 'gap-[9px]',
        className,
      )}
    >
      <StockImage src={stock?.image} px={isSmall ? 32 : 35} />
      <div>
        <p
          className={cn(
            'max-w-[150px] truncate text-start font-semibold',
            isSmall && 'text-sm',
            !fullLength && 'max-w-[75px]',
          )}
        >
          {stock?.companyName}
        </p>
        <p
          className={cn(
            'text-desc text-start font-semibold',
            isSmall ? 'text-xs' : 'text-sm',
          )}
        >
          {stock?.symbol}
        </p>
      </div>
    </div>
  );
};
