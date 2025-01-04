'use client';

import { Loader } from '@/components/loader';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { RecentStocks } from '@/features/stock/types/stock';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SymbolItem } from '../../stock/components/symbol-item';

interface Props {
  recentStocks: RecentStocks;
}

export const Searchbar = ({ recentStocks }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const pathname = usePathname();
  const router = useRouter();

  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
    enabled: false,
  });

  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 150),
    [refetch],
  );

  const showRecentStocks =
    !isLoading &&
    (!data || data.length === 0) &&
    !!recentStocks?.length &&
    input.length === 0;

  const recentsCount = showRecentStocks ? recentStocks.length : 0;
  const dataCount = data?.length ?? 0;
  const totalCount = recentsCount + dataCount;

  const getStockFromIndex = useCallback(
    (index: number) => {
      if (index < recentsCount && recentStocks) {
        return recentStocks[index];
      }
      const dataIndex = index - recentsCount;
      if (dataIndex >= 0 && dataIndex < dataCount && data) {
        return data[dataIndex];
      }
    },
    [recentStocks, data, recentsCount, dataCount],
  );

  useEffect(() => {
    if (input.length > 0) {
      setOpen(true);
    }
  }, [input]);

  useEffect(() => {
    setOpen(false);
    setInput('');
    setSelectedIndex(-1);
  }, [pathname]);

  useEffect(() => {
    if (totalCount > 0) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [totalCount]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!totalCount) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev + 1;
            return next < totalCount ? next : 0;
          });
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev - 1;
            return Math.max(next, 0);
          });
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < totalCount) {
            const stock = getStockFromIndex(selectedIndex);
            if (stock) {
              router.push(`/stocks/${stock.symbol}`);
              setOpen(false);
              setInput('');
            }
          }
          break;
        }
      }
    },
    [getStockFromIndex, router, selectedIndex, totalCount],
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
    return () => {
      document.removeEventListener('keydown', down);
    };
  }, [open]);

  const hasNoSearchResults =
    !isLoading && input.length > 0 && data && data.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="md:f-center hidden w-[400px] justify-between rounded-full border bg-background px-4 shadow-sm">
        <div className="f-center">
          <Search size={18} className="text-gray-400" />
          <Input
            className="mb-[1px] w-full border-none"
            placeholder="Search Zenathra..."
            value={input}
            onChange={async (e) => {
              setInput(e.target.value);
              setSelectedIndex(-1);
              if (e.target.value.length > 0) {
                await debounceRequest();
              }
            }}
            onKeyDown={handleKeyDown}
            onClick={() => {
              setOpen(true);
            }}
          />
        </div>
        <X
          className={cn(
            'size-4 cursor-pointer',
            input.length > 0 ? 'flex' : 'hidden',
          )}
          onClick={() => {
            setInput('');
            setOpen(false);
            setSelectedIndex(-1);
          }}
        />
      </PopoverTrigger>

      <PopoverContent
        className="bg-faded hidden w-[400px] rounded-3xl md:block"
        side="bottom"
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        {isLoading && (
          <div className="f-box py-2">
            <Loader size={36} className="self-center" />
          </div>
        )}

        {!isLoading &&
          showRecentStocks &&
          recentStocks.map((stock, i) => {
            const isSelected = i === selectedIndex;
            return (
              <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                <SymbolItem
                  stock={stock}
                  fullLength
                  size="sm"
                  className={cn(
                    'rounded-full p-1.5 px-2 hover:bg-accent',
                    isSelected && 'bg-accent text-accent-foreground',
                  )}
                />
              </Link>
            );
          })}

        {!isLoading &&
          data &&
          data.length > 0 &&
          data.map((stock, i) => {
            const isSelected = i + recentsCount === selectedIndex;
            return (
              <Link key={stock.symbol} href={`/stocks/${stock.symbol}`}>
                <SymbolItem
                  stock={stock}
                  fullLength
                  size="sm"
                  className={cn(
                    'rounded-full p-1.5 px-2 hover:bg-accent',
                    isSelected && 'bg-accent text-accent-foreground',
                  )}
                />
              </Link>
            );
          })}

        {hasNoSearchResults && (
          <div className="p-2 text-center text-sm text-muted-foreground">
            No results found
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
