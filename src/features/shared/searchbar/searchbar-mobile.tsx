'use client';

import { Button } from '@/components/ui/button';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { RecentStocks } from '@/features/stock/types/stock';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { ChevronLeft, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SearchbarInput } from './searchbar-input';
import { SearchbarResults } from './searchbar-results';

interface Props {
  recentStocks: RecentStocks;
}

export const SearchbarMobile = ({ recentStocks }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [showRecents, setShowRecents] = useState(false);

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

  useEffect(() => {
    setOpen(false);
    setInput('');
  }, [pathname]);

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
        <div className="f-center gap-1.5">
          <Button
            onClick={() => {
              setOpen(false);
            }}
            size="icon"
            variant="ghost"
            aria-label="Close search menu"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <SearchbarInput
            open={open}
            debounceRequest={debounceRequest}
            searchInput={input}
            setInput={setInput}
          />
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
