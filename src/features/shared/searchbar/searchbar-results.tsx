'use client';

import { Loader } from '@/components/loader';
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import type { Stock } from '@prisma/client';
import Link from 'next/link';

interface Props {
  data?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
  input: string;
  showRecents: boolean;
  isLoading: boolean;
}

export const SearchbarResults = ({
  data,
  recentStocks,
  input,
  showRecents,
  isLoading,
}: Props) => {
  if (isLoading) {
    return (
      <CommandEmpty className="f-box">
        <Loader />
      </CommandEmpty>
    );
  }

  if (input.length > 0 && (data?.length ?? 0) > 0 && !isLoading) {
    return <CommandEmpty>No results found.</CommandEmpty>;
  }

  if (input.length === 0 && showRecents) {
    return (
      <CommandGroup heading="Recently Viewed">
        {recentStocks?.map((stock) => (
          <Link
            key={'recentStocks' + stock.symbol}
            href={`/stocks/${stock.symbol}`}
          >
            <CommandItem value={stock.symbol + stock.companyName}>
              <SymbolItem stock={stock} size="sm" fullLength />
            </CommandItem>
          </Link>
        ))}
      </CommandGroup>
    );
  }

  return (
    <CommandGroup heading="Stocks">
      {data?.map((stock) => (
        <Link
          key={'search-command' + stock.symbol}
          href={`/stocks/${stock.symbol}`}
        >
          <CommandItem value={stock.symbol + stock.companyName}>
            <SymbolItem stock={stock} size="sm" fullLength />
          </CommandItem>
        </Link>
      ))}
    </CommandGroup>
  );
};
