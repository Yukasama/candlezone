'use client';

import { searchStocks } from '@/features/stock/actions/search-stocks';
import { cn } from '@/lib/utils';
import { Stock } from '@prisma/client';
import { PopoverClose } from '@radix-ui/react-popover';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Loader } from '../../../components/loader';
import { Input } from '../../../components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import { SymbolItem } from '../../stock/components/symbol-item';

interface Props {
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
}

export const Searchbar = ({ recentStocks = [] }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const { isFetching, data, refetch } = useQuery({
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
    enabled: false,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceRequest = useCallback(
    debounce(async () => await refetch(), 100),
    [],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        if (open) {
          setOpen(false);
          setInput('');
        }
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setInput('');
  }, [pathname]);

  useEffect(() => {
    if (input.trim().length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [input]);

  const showRecentStocks =
    open && !isFetching && !data && recentStocks.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <div className="sm:f-center hidden w-[400px] justify-between rounded-full border px-4">
          <div className="f-center">
            <Search size={18} className="text-gray-400" />
            <Input
              className="border-none"
              placeholder="Search stocks..."
              value={input}
              onChange={async (e) => {
                setInput(e.target.value);
                if (e.target.value.length > 0) {
                  await debounceRequest();
                }
              }}
              onClick={() => setOpen(true)}
            />
          </div>
          <PopoverClose asChild>
            <X
              className={cn(
                'size-4 cursor-pointer',
                input.length > 0 ? 'flex' : 'hidden',
              )}
              onClick={() => setInput('')}
            />
          </PopoverClose>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="bg-faded w-[400px] rounded-3xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {showRecentStocks &&
          recentStocks?.map((stock) => (
            <PopoverClose key={stock.symbol} asChild>
              <Link href={`/stocks/${stock.symbol}`}>
                <SymbolItem
                  stock={stock}
                  size="sm"
                  className="rounded-full p-1.5 px-2 hover:bg-accent"
                />
              </Link>
            </PopoverClose>
          ))}
        {isFetching ? (
          <div className="f-box">
            <Loader size={36} className="self-center" />
          </div>
        ) : (
          data?.map((stock) => (
            <PopoverClose key={stock.symbol} asChild>
              <Link href={`/stocks/${stock.symbol}`}>
                <SymbolItem
                  stock={stock}
                  size="sm"
                  className="rounded-full p-1.5 px-2 hover:bg-accent"
                />
              </Link>
            </PopoverClose>
          ))
        )}
      </PopoverContent>
    </Popover>
  );
};
