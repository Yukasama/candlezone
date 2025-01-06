'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SkeletonList } from '@/components/ui/skeleton';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { RecentStocks, StockSearch } from '@/features/stock/types/stock';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Props {
  data?: StockSearch[];
  recentStocks?: RecentStocks;
  input: string;
  isPending: boolean;
  onClick?: (stock: StockSearch) => void;
}

export const SearchbarResults = ({
  data,
  recentStocks,
  input,
  isPending,
  onClick,
}: Props) => {
  const [showRecents, setShowRecents] = useState(false);

  useEffect(() => {
    if (input.length > 0) {
      setShowRecents(false);
      return;
    }

    setShowRecents(
      !isPending &&
        (!data || data.length === 0) &&
        (recentStocks?.length ?? 0) > 0 &&
        input.length === 0,
    );
  }, [isPending, data, recentStocks, input]);

  if (isPending) {
    return (
      <div className="h-[410px]">
        <SkeletonList length={7} />
      </div>
    );
  }

  if (input.length > 0 && (data?.length ?? 0) === 0) {
    return (
      <div className="f-box min-h-[408px] translate-y-10 text-[15px] text-gray-400">
        No results found.
      </div>
    );
  }

  if (input.length === 0 && showRecents) {
    return (
      <div>
        {recentStocks?.map((stock) => (
          <ResultList
            key={'recents' + stock.symbol}
            stock={stock}
            onClick={onClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {data?.map((stock) => (
        <ResultList
          key={'search' + stock.symbol}
          stock={stock}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

interface ListProps {
  stock: StockSearch;
  onClick?: (stock: StockSearch) => void;
}

const ResultList = ({ stock, onClick }: ListProps) => {
  return (
    <>
      {onClick ? (
        <Button
          variant="ghost"
          onClick={() => {
            onClick(stock);
          }}
          className="h-[50px] w-full justify-start"
        >
          <SymbolItem stock={stock} size="sm" fullLength />
        </Button>
      ) : (
        <Link
          href={`/stocks/${stock.symbol}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-[50px] w-full justify-start',
          )}
        >
          <SymbolItem stock={stock} size="sm" fullLength />
        </Link>
      )}
      <Separator className="opacity-50" />
    </>
  );
};
