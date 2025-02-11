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

  const { data, isFetching, refetch } = useQuery({
    enabled: false,
    queryFn: async () => await searchStocks({ input }),
    queryKey: ['search-stocks', input],
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
        aria-label="Search stocks"
        className="bg-background md:hidden"
        onClick={() => setOpen(true)}
        size="icon"
        variant="ghost"
      >
        <Search size={20} />
      </Button>

      <div
        className={cn(
          'bg-background fixed inset-0 flex flex-col space-y-3 p-3 md:hidden',
          open
            ? 'pointer-events-auto z-50 opacity-100'
            : 'pointer-events-none -z-10 opacity-0',
        )}
      >
        <div className="flex items-center gap-1.5">
          <Button
            aria-label="Close search menu"
            onClick={() => setOpen(false)}
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <SearchbarInput
            debounceRequest={debounceRequest}
            open={open}
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
