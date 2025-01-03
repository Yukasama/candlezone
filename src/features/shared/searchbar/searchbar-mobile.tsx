'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { cn } from '@/lib/utils';
import type { Stock } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { ChevronLeft, Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SearchbarResults } from './searchbar-results';

interface Props {
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
}

export const SearchbarMobile = ({ recentStocks }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [showRecents, setShowRecents] = useState(false);

  // 1. Create a ref for the input
  const inputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const { data, refetch, isLoading } = useQuery({
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
    enabled: false,
  });

  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 300),
    [refetch],
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleOpen();
      }
    };

    document.addEventListener('keydown', down);
    return () => {
      document.removeEventListener('keydown', down);
    };
  }, []);

  // Whenever the route changes, close the search panel and reset input
  useEffect(() => {
    setOpen(false);
    setInput('');
  }, [pathname]);

  // 2. Focus the input whenever `open` becomes `true`
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setShowRecents(
      open && !isLoading && !data && (recentStocks?.length ?? 0) > 0,
    );
  }, [open, isLoading, data, recentStocks]);

  return (
    <>
      <Button
        onClick={toggleOpen}
        size="icon"
        variant="ghost"
        aria-label="Search stocks"
        className="bg-background md:hidden"
      >
        <Search size={20} />
      </Button>

      <div
        className={cn(
          'f-col fixed inset-0 space-y-1.5 bg-background p-3 md:hidden',
          open
            ? 'pointer-events-auto z-50 opacity-100'
            : 'pointer-events-none -z-10 opacity-0',
        )}
      >
        <div className="f-center gap-1.5 border-b pb-3">
          <Button
            onClick={() => {
              setOpen(false);
            }}
            size="icon"
            variant="ghost"
            aria-label="Close search menu"
            className="f-box w-10"
          >
            <ChevronLeft size={20} />
          </Button>
          <Input
            // 3. Pass the ref to the Input element
            ref={inputRef}
            onChange={async (e) => {
              setInput(e.target.value);
              await debounceRequest();
            }}
            value={input}
            placeholder="Search Zenathra..."
            className="h-9"
          />
          <Button
            onClick={() => {
              setInput('');
            }}
            size="icon"
            variant="secondary"
            aria-label="Clear search"
            className={cn(
              'f-box w-10',
              input ? 'opacity-100' : 'pointer-events-none opacity-40',
            )}
          >
            <X size={20} />
          </Button>
        </div>

        <SearchbarResults
          data={data}
          input={input}
          isLoading={isLoading}
          recentStocks={recentStocks}
          showRecents={showRecents}
        />
      </div>
    </>
  );
};
