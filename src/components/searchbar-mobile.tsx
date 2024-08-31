'use client';

import { searchStocks } from '@/actions/stock/search-stocks';
import { Stock } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { User } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from './loader';
import { SymbolItem } from './stock/symbol-item';
import { Button } from './ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

interface Props {
  user?: User;
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
}

export const SearchbarMobile = ({
  user,
  recentStocks = [],
}: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const toggleOpen = () => setOpen((prev) => (prev === open ? !open : open));

  const { isFetching, data, refetch } = useQuery({
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
    enabled: false,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceRequest = useCallback(
    debounce(async () => await refetch(), 300),
    [],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleOpen();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpen(false);
    setInput('');
  }, [pathname]);

  return (
    <>
      <Button
        onClick={toggleOpen}
        size="icon"
        variant="ghost"
        aria-label="Search stocks"
        className="flex sm:hidden"
      >
        <Search size={18} />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          onValueChange={async (text) => {
            setInput(text);
            await debounceRequest();
          }}
          value={input}
          placeholder="Search stocks..."
        />

        <CommandList key={data?.length}>
          {input.length === 0 ? (
            user &&
            recentStocks?.length > 0 && (
              <CommandGroup heading="Recently Viewed">
                {recentStocks?.map((stock) => (
                  <Link
                    key={'recentlyviewed' + stock.symbol}
                    href={`/stocks/${stock.symbol}`}
                  >
                    <CommandItem value={stock.symbol + stock.companyName}>
                      <SymbolItem stock={stock} size="sm" />
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            )
          ) : isFetching ? (
            <CommandEmpty className="f-box">
              <Loader />
            </CommandEmpty>
          ) : data?.length ? (
            <CommandGroup heading="Stocks">
              {data.map((stock) => (
                <Link
                  key={'search-command' + stock.symbol}
                  href={`/stocks/${stock.symbol}`}
                >
                  <CommandItem value={stock.symbol + stock.companyName}>
                    <SymbolItem stock={stock} size="sm" />
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
