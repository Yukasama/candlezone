'use client';

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
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchbarResults } from '../components/searchbar-results';

interface Props {
  recentStocks: RecentStocks;
}

export const Searchbar = ({ recentStocks }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const pathname = usePathname();
  const router = useRouter();

  const { data, isFetching, refetch } = useQuery({
    enabled: false,
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
  });

  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 150),
    [refetch],
  );

  const showRecentStocks =
    !isFetching &&
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

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        asChild
        className="bg-background hidden w-[400px] items-center justify-between rounded-full border px-4 shadow-sm md:flex"
      >
        <div className="flex items-center">
          <Search className="text-desc" size={18} />
          <Input
            className="mb-[1px] w-full border-none"
            onChange={async (e) => {
              setInput(e.target.value);
              setSelectedIndex(-1);
              if (e.target.value.length > 0) {
                await debounceRequest();
              }
            }}
            onClick={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search Zenathra..."
            value={input}
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
        align="start"
        className="bg-faded hidden w-[400px] flex-col rounded-3xl md:flex"
        onOpenAutoFocus={(e) => e.preventDefault()}
        side="bottom"
      >
        <SearchbarResults
          data={data}
          input={input}
          isFetching={isFetching}
          recentStocks={recentStocks}
        />
      </PopoverContent>
    </Popover>
  );
};
