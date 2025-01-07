'use client';

import { Button } from '@/components/ui/button';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { RecentStocks } from '@/features/stock/types/stock';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { ChevronLeft, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { SearchbarInput } from '../components/searchbar-input';
import { SearchbarResults } from '../components/searchbar-results';

interface Props {
  recentStocks: RecentStocks;
}

export const SearchbarMobile = ({ recentStocks }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const { data, refetch, isFetching } = useQuery({
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
    enabled: false,
  });

  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 150),
    [refetch],
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

  useEffect(() => {
    setOpen(false);
    setInput('');
  }, [pathname]);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        size="icon"
        variant="ghost"
        aria-label="Search stocks"
        className="bg-background md:hidden"
      >
        <Search size={20} />
      </Button>

      <div
        className={cn(
          'f-col fixed inset-0 space-y-3 bg-background p-3 md:hidden',
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
          isFetching={isFetching}
          recentStocks={recentStocks}
        />
      </div>
    </>
  );
};
