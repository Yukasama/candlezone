'use client';

import { Loader } from '@/components/loader';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import { PopoverClose } from '@radix-ui/react-popover';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // <--- Important for routing
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SymbolItem } from '../../stock/components/symbol-item';

interface Props {
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
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

  // Debounce the search so we don't spam queries
  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 150),
    [refetch],
  );

  // 1) Keep the popover open & input focused even when typing spaces
  //    We do NOT close popover automatically when the input is empty
  //    or only contains spaces.
  useEffect(() => {
    // If input is non-empty, ensure popover is open
    // (But if you want the popover open even on empty input, you can remove the condition.)
    if (input.length > 0) {
      setOpen(true);
    }
  }, [input]);

  // 2) Whenever the route changes, close the search panel and reset input
  useEffect(() => {
    setOpen(false);
    setInput('');
  }, [pathname]);

  // 3) Update the selectedIndex whenever data changes
  //    If we have results, automatically select the first result (index 0).
  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [data]);

  // 4) Keyboard event handler for arrow-key navigation & "Enter" to select
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!data || data.length === 0) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          setSelectedIndex((prev) => {
            // Move down in the list or loop back to the top
            const next = prev + 1;
            return next < data.length ? next : 0;
          });
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          setSelectedIndex((prev) => {
            // Move up in the list or loop to the bottom
            const next = prev - 1;
            return next >= 0 ? next : data.length - 1;
          });
          break;
        }

        case 'Enter': {
          e.preventDefault();
          if (selectedIndex >= 0 && data[selectedIndex]) {
            router.push(`/stocks/${data[selectedIndex].symbol}`);
            setOpen(false);
            setInput('');
          }
          break;
        }
      }
    },
    [data, selectedIndex, router],
  );

  // 5) (Optional) If user presses Ctrl/Meta at any point, close popover (per your old code)
  //    Adjust or remove this if it interferes with other shortcuts
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

  // 6) Decide when to show recent stocks vs. search results
  //    If we have no input or data is empty, we can show recent stocks.
  const showRecentStocks =
    !isLoading &&
    (!data || data.length === 0) &&
    !!recentStocks?.length &&
    input.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="md:f-center hidden w-[400px] justify-between rounded-full border bg-background px-4 shadow-sm">
        <div className="f-center border">
          <Search size={18} className="mr-2 text-gray-400" />
          <Input
            className="mb-[1px] w-full border-none"
            placeholder="Search stocks..."
            value={input}
            // 7) Handle typed input (including spaces) & refetch
            onChange={async (e) => {
              setInput(e.target.value);
              if (e.target.value.length > 0) {
                await debounceRequest();
              }
            }}
            // 8) Keep the input focused, handle arrow keys & Enter
            onKeyDown={handleKeyDown}
            onClick={() => {
              setOpen(true);
            }}
          />
        </div>
        <PopoverClose asChild>
          <X
            className={cn(
              'size-4 cursor-pointer',
              input.length > 0 ? 'flex' : 'hidden',
            )}
            onClick={() => {
              setInput('');
              // If you want to keep the popover open even when clearing input:
              // remove the line below.
              setOpen(false);
            }}
          />
        </PopoverClose>
      </PopoverTrigger>

      <PopoverContent
        className="bg-faded hidden w-[400px] rounded-3xl md:block"
        side="bottom"
        align="start"
        // Prevent re-focusing so the Input doesn't lose focus on open/close
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        {/* LOADING STATE */}
        {isLoading && (
          <div className="f-box py-2">
            <Loader size={36} className="self-center" />
          </div>
        )}

        {/* RECENT STOCKS (if user hasn't typed anything yet) */}
        {!isLoading &&
          showRecentStocks &&
          recentStocks.map((stock) => (
            <PopoverClose key={stock.symbol} asChild>
              <Link href={`/stocks/${stock.symbol}`}>
                <SymbolItem
                  stock={stock}
                  fullLength
                  size="sm"
                  className="rounded-full p-1.5 px-2 hover:bg-accent"
                />
              </Link>
            </PopoverClose>
          ))}

        {/* SEARCH RESULTS */}
        {!isLoading &&
          data &&
          data.length > 0 &&
          data.map((stock, i) => {
            // Pass a "selected" prop so we can highlight
            const isSelected = i === selectedIndex;
            return (
              <PopoverClose key={stock.symbol} asChild>
                <Link href={`/stocks/${stock.symbol}`}>
                  <SymbolItem
                    stock={stock}
                    fullLength
                    size="sm"
                    className={cn(
                      'rounded-full p-1.5 px-2 hover:bg-accent',
                      // Simple highlight style for selected item
                      isSelected && 'bg-accent text-accent-foreground',
                    )}
                  />
                </Link>
              </PopoverClose>
            );
          })}

        {/* "NO RESULTS FOUND" MESSAGE */}
        {!isLoading && data && data.length === 0 && input.length > 0 && (
          <div className="p-2 text-center text-sm text-muted-foreground">
            No results found
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
