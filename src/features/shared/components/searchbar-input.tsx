'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StockSearch } from '@/features/stock/types/stock';
import { cn } from '@/lib/utils';
import type { QueryObserverResult } from '@tanstack/react-query';
import type { DebouncedFunc } from 'lodash';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  debounceRequest: DebouncedFunc<
    () => Promise<QueryObserverResult<StockSearch[]>>
  >;
  searchInput: string;
  setInput: (value: string) => void;
}

export const SearchbarInput = ({
  open,
  debounceRequest,
  searchInput,
  setInput,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="bg-accent flex h-9 flex-1 items-center rounded-full">
      <Input
        ref={inputRef}
        autoFocus={open}
        onChange={async (e) => {
          setInput(e.target.value);
          if (e.target.value.length > 0) {
            await debounceRequest();
          }
        }}
        value={searchInput}
        className="bg-accent h-9 border-none text-base placeholder:-translate-y-[1px]"
        placeholder="Search Zenathra..."
      />
      <Button
        onClick={() => {
          setInput('');
        }}
        size="small-icon"
        variant="ghost"
        aria-label="Clear search"
        disabled={!searchInput}
        className={cn('mr-1.5', searchInput ? 'opacity-100' : 'opacity-20')}
      >
        <X size={18} />
      </Button>
    </div>
  );
};
