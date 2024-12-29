'use client';

import { Loader } from '@/components/loader';
import { Separator } from '@/components/ui/separator';
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
      <div className="f-box mt-10 translate-y-10">
        <Loader />
      </div>
    );
  }

  if (input.length > 0 && (data?.length ?? 0) === 0) {
    return (
      <div className="f-box translate-y-10 text-[15px] text-gray-400">
        No results found.
      </div>
    );
  }

  if (input.length === 0 && showRecents) {
    return (
      <div className="f-col gap-1.5 p-2">
        {recentStocks?.map((stock) => (
          <div key={'recentStocks' + stock.symbol}>
            <Link
              href={`/stocks/${stock.symbol}`}
              className="mb-1.5 flex h-[50px] rounded-full p-1 px-2.5 hover:bg-accent"
            >
              <SymbolItem stock={stock} size="sm" fullLength />
            </Link>
            <Separator />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="f-col gap-1.5 p-2">
      {data?.map((stock) => (
        <div key={'search-command' + stock.symbol}>
          <Link
            href={`/stocks/${stock.symbol}`}
            className="mb-1.5 flex h-[50px] rounded-full p-1 px-2.5 hover:bg-accent"
          >
            <SymbolItem stock={stock} size="sm" fullLength />
          </Link>
          <Separator />
        </div>
      ))}
    </div>
  );
};
