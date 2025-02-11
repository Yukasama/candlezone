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
  input: string;
  isFetching: boolean;
  onClick?: (stock: StockSearch) => void;
  recentStocks?: RecentStocks;
}

export const SearchbarResults = ({
  data,
  input,
  isFetching,
  onClick,
  recentStocks,
}: Props) => {
  const [showRecents, setShowRecents] = useState(false);

  useEffect(() => {
    setShowRecents(
      !isFetching && input.length === 0 && (recentStocks?.length ?? 0) > 0,
    );
  }, [isFetching, recentStocks, input]);

  if (isFetching || (input.length > 0 && !data)) {
    return <SkeletonList className="h-[45px]" length={7} />;
  }

  if (input.length > 0 && data?.length === 0) {
    return (
      <div className="text-desc flex min-h-[339px] items-center justify-center">
        No results found.
      </div>
    );
  }

  if (input.length === 0 && showRecents) {
    return (
      <div className="flex flex-col gap-1">
        {recentStocks?.map((stock) => (
          <ResultList
            key={'recents' + stock.symbol}
            onClick={onClick}
            stock={stock}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {data?.map((stock) => (
        <ResultList
          key={'search' + stock.symbol}
          onClick={onClick}
          stock={stock}
        />
      ))}
    </div>
  );
};

interface ListProps {
  onClick?: (stock: StockSearch) => void;
  stock: StockSearch;
}

const ResultList = ({ onClick, stock }: ListProps) => {
  return (
    <>
      {onClick ? (
        <Button
          className="h-[45px] w-full justify-start"
          onClick={() => onClick(stock)}
          variant="ghost"
        >
          <SymbolItem fullLength size="sm" stock={stock} />
        </Button>
      ) : (
        <Link
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-[45px] w-full justify-start',
          )}
          href={`/stocks/${stock.symbol}`}
        >
          <SymbolItem fullLength size="sm" stock={stock} />
        </Link>
      )}
    </>
  );
};
