'use client';

import { Button, buttonVariants } from '@/components/ui/button';
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
  isFetching: boolean;
  onClick?: (stock: StockSearch) => void;
}

export const SearchbarResults = ({
  data,
  recentStocks,
  input,
  isFetching,
  onClick,
}: Props) => {
  const [showRecents, setShowRecents] = useState(false);

  useEffect(() => {
    setShowRecents(
      !isFetching && input.length === 0 && (recentStocks?.length ?? 0) > 0,
    );
  }, [isFetching, recentStocks, input]);

  if (isFetching || (input.length > 0 && !data)) {
    return <SkeletonList length={7} className="h-[45px]" />;
  }

  if (input.length > 0 && data?.length === 0) {
    return (
      <div className="f-box min-h-[339px] text-gray-400">No results found.</div>
    );
  }

  if (input.length === 0 && showRecents) {
    return (
      <div className="f-col gap-1">
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
    <div className="f-col gap-1">
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
          className="h-[45px] w-full justify-start"
        >
          <SymbolItem stock={stock} size="sm" fullLength />
        </Button>
      ) : (
        <Link
          href={`/stocks/${stock.symbol}`}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-[45px] w-full justify-start',
          )}
        >
          <SymbolItem stock={stock} size="sm" fullLength />
        </Link>
      )}
    </>
  );
};
