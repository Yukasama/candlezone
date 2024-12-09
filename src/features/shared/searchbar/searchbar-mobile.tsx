'use client';

import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import type { Stock } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { SearchbarResults } from './searchbar-results';

interface Props {
  recentStocks?: Pick<Stock, 'symbol' | 'companyName' | 'image'>[];
}

export const SearchbarMobile = ({ recentStocks = [] }: Readonly<Props>) => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [showRecents, setShowRecents] = useState(false);

  const pathname = usePathname();
  const toggleOpen = () => setOpen((prev) => (prev === open ? !open : open));

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
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    setOpen(false);
    setInput('');
  }, [pathname]);

  useEffect(() => {
    setShowRecents(open && !isLoading && !data && recentStocks.length > 0);
  }, [open, isLoading, data, recentStocks]);

  return (
    <>
      <Button
        onClick={toggleOpen}
        size="icon"
        variant="ghost"
        aria-label="Search stocks"
        className="flex bg-background sm:hidden"
      >
        <Search size={20} />
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
          <SearchbarResults
            data={data}
            input={input}
            isLoading={isLoading}
            recentStocks={recentStocks}
            showRecents={showRecents}
          />
        </CommandList>
      </CommandDialog>
    </>
  );
};
